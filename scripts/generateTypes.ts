import fs from 'node:fs'
import path from 'node:path'
import { bitMasks } from './data/bitMasks'
import { expressionFields } from './data/expressionFields'
import { expressionTypes } from './data/expressionTypes'
import { fieldMetadataMap } from './data/fieldMetadata'
import { nullableFields } from './data/nullableFields'
import { skippedEntities } from './data/skippedEntities'
import { typeMappings } from './data/typeMappings'

type StructsByModule = Record<string, Record<string, StructDef>>
type EnumsByModule = Record<string, Record<string, EnumDef>>

type Comment = {
  name?: undefined
  comment: string
}

type StructDef = {
  fields: (FieldDef | Comment)[]
  comment?: string | null
}

type FieldDef = {
  name: string
  c_type: string
  comment?: string | null
}

type EnumDef = {
  values: (EnumValueDef | Comment)[]
  comment?: string | null
}

type EnumValueDef = {
  name: string
  value: number
  comment?: string | null
}

type TypeDef = {
  new_type_name: string
  source_type: string
  comment?: string | null
}

function formatComment(
  comment: string | null | undefined,
  indent: string,
): string {
  if (comment == null || comment === '') {
    return ''
  }
  return comment
    .replace(/\/\*/, '/**')
    .replace(/^\s*/, indent)
    .replace(/\n?$/, '\n')
}

function readSrcData<T>(fileName: string): T {
  const scriptDir = new URL('.', import.meta.url).pathname
  const dataPath = path.join(scriptDir, '../libpg_query/srcdata', fileName)
  const content = fs.readFileSync(dataPath, 'utf-8')
  return JSON.parse(content) as T
}

async function main() {
  const [structsByModule, enumsByModule, typeDefs, nodeTypes] =
    await Promise.all([
      readSrcData<StructsByModule>('struct_defs.json'),
      readSrcData<EnumsByModule>('enum_defs.json'),
      readSrcData<TypeDef[]>('typedefs.json'),
      new Set(readSrcData<string[]>('nodetypes.json')),
    ])

  const entityNames = [
    ...typeDefs.map(t => t.new_type_name),
    ...Object.values(enumsByModule).flatMap(e => Object.keys(e)),
    ...Object.values(structsByModule).flatMap(s => Object.keys(s)),
  ]

  const shouldSkipEntity = (name: string) => skippedEntities.has(name)

  // When true, warn about unknown types.
  const debugUnknownTypes = false

  // A type is unknown if it's not found in typeMappings or entityNames.
  const unknownTypes = new Set<string>()
  const warnUnknownType = (name: string, label = 'type') => {
    if (debugUnknownTypes && !unknownTypes.has(name)) {
      unknownTypes.add(name)
      console.warn('Unknown %s: %O', label, name)
    }
  }

  // Map a C type to a TypeScript type.
  const applyTypeMapping = (name: string, c_type: string): string => {
    const rawType = c_type.replace(/\*$/, '')
    const mapping = (name && typeMappings[name]) || typeMappings[rawType]
    if (mapping) {
      if (mapping === 'Node' && name.endsWith('expr')) {
        return 'Expr'
      }
      return mapping
    }
    if (entityNames.includes(rawType)) {
      return rawType
    }
    warnUnknownType(rawType)
    return 'any'
  }

  // This is the output TypeScript code.
  let code = '/* This file is auto-generated by scripts/generateTypes.ts */\n'

  // Typedefs are mostly mapped to type aliases, but at least one is a bitmask,
  // which gets mapped to an enum.
  for (const typeDef of typeDefs) {
    if (shouldSkipEntity(typeDef.new_type_name)) {
      continue
    }

    code += '\n'
    code += formatComment(typeDef.comment, '')

    const bitMask = bitMasks[typeDef.new_type_name]
    if (bitMask) {
      code += `export enum ${typeDef.new_type_name} {\n`
      bitMask.forEach((value, index) => {
        code += `  ${value} = ${index > 0 ? '1 << ' + (index - 1) : 0},\n`
      })
      code += `}\n`
    } else {
      code += `export type ${typeDef.new_type_name} = ${applyTypeMapping(typeDef.new_type_name, typeDef.source_type)}\n`
    }
  }

  for (const [moduleId, enums] of Object.entries(enumsByModule)) {
    if (!moduleId.startsWith('nodes/')) {
      // Ignore internal enums.
      continue
    }

    const keys = Object.keys(enums)
    if (keys.length === 0) {
      continue
    }

    // Remove copyright comment.
    enums[keys[0]].comment = ''

    for (const [enumName, { values, comment }] of Object.entries(enums)) {
      if (shouldSkipEntity(enumName)) {
        continue
      }

      code += '\n'
      code += formatComment(comment, '')
      code += `export enum ${enumName} {\n`
      for (const value of values) {
        code += formatComment(value.comment, '  ')
        if ('name' in value) {
          code += `  ${value.name} = "${value.name}",\n`
        }
      }
      code += `}\n`
    }
  }

  const renderTagType = (tag: string) =>
    tag === '{}' ? tag : `{ ${tag}: ${tag} }`

  const renderTagTypes = (tags: string[], fieldPath: string) => {
    if (expressionFields.has(fieldPath)) {
      if (tags.includes('{}')) {
        return 'Expr | {}'
      }
      return 'Expr'
    }
    return tags.sort().map(renderTagType).join(' | ')
  }

  delete structsByModule['../backend/parser/gram']
  delete structsByModule['../backend/parser/gramparse']
  delete structsByModule['commands/vacuum']

  /** Constant types are included in the "A_Const" union of object types. */
  const constTypes: string[] = []

  const abstractTypes: Record<string, StructDef | null> = {
    A_Const: null,
    Expr: null,
    List: null,
  }

  /** Object types do not represent an AST node. */
  const objectTypes = new Set<string>()

  /** Fix structs that do not reflect the AST accurately */
  const fixedStructs: Record<string, string> = {
    PartitionRangeDatum: 'Expr',
  }

  for (const structs of Object.values(structsByModule)) {
    for (const typeName in abstractTypes) {
      if (structs[typeName]) {
        abstractTypes[typeName] = structs[typeName]
        delete structs[typeName]
      }
    }

    for (const [typeName, { fields, comment }] of Object.entries(structs)) {
      if (shouldSkipEntity(typeName)) {
        continue
      }

      // Assume any struct with a name ending in "Expr" can be used where an
      // expression is allowed.
      if (typeName.endsWith('Expr')) {
        expressionTypes.add(typeName)
      }

      code += '\n'
      code += formatComment(comment, '')
      code += `export type ${typeName} = `

      if (typeName in fixedStructs) {
        code += fixedStructs[typeName]
        continue
      }

      const namedFields = fields.filter(
        (field): field is FieldDef => field.name !== undefined,
      )
      if (
        namedFields.length === 1 &&
        namedFields[0].name.endsWith('val') &&
        namedFields[0].name.length > 3
      ) {
        // A_Const double-wraps the value for some strange reason.
        //   https://github.com/pganalyze/libpg_query/issues/265
        constTypes.push(`{ ${namedFields[0].name}: ${typeName} }`)
      }

      const fieldMetadata = fieldMetadataMap[typeName]
      if (!fieldMetadata) {
        // If field metadata could not be inferred from libpg_query's test
        // suite, then it's likely not a node type.
        objectTypes.add(typeName)
      }

      code += '{\n'

      for (let i = 0; i < fields.length; i++) {
        const field = fields[i]

        // Merge lone comments into the next field if possible without
        // overwriting another comment. This helps with NULL detection.
        if (
          field.name == null &&
          fields[i + 1] &&
          fields[i + 1].comment == null
        ) {
          fields[i + 1].comment = field.comment
          continue
        }

        /** TypeScript definition for the field. */
        let fieldTsDef = ''

        if (field.name !== undefined) {
          const fieldName = field.name.replace(/\[.+?\]$/, '')

          // The "xpr" field is never actually included in the AST. It exists to
          // signify that the struct can be used where an expression is allowed.
          if (fieldName === 'xpr') {
            expressionTypes.add(typeName)
            continue
          }

          const fieldPath = typeName + '.' + fieldName

          let fieldType = applyTypeMapping(fieldPath, field.c_type)

          if (fieldName === 'type' && fieldType === 'NodeTag') {
            // Strangely, the result of pg_query_parse doesn't actually include
            // the node tags, so skip defining them.
            continue
          }

          const debugTags = false

          if (fieldType === 'any' || fieldType === 'Node') {
            const inferredTags = fieldMetadata?.[fieldName]?.tags
            if (inferredTags) {
              if (debugTags) {
                console.log('Inferred tags for %s:', fieldPath, inferredTags)
              }
              fieldType = renderTagTypes(inferredTags, fieldPath)
            }
          } else if (fieldType === 'any[]') {
            const inferredListTags = fieldMetadata?.[fieldName]?.listTags
            if (inferredListTags) {
              if (debugTags) {
                console.log(
                  'Inferred list tags for %s:',
                  fieldPath,
                  inferredListTags,
                )
              }

              fieldType =
                'List<' + renderTagTypes(inferredListTags, fieldPath) + '>'

              if (field.c_type === 'List*') {
                fieldType += '[]'
              }
            }
            if (fieldType === 'any[]' && field.c_type === 'List*') {
              const inferredTags = fieldMetadata?.[fieldName]?.tags
              if (inferredTags) {
                if (debugTags) {
                  console.log('Inferred tags for %s:', fieldPath, inferredTags)
                }
                fieldType =
                  '(' + renderTagTypes(inferredTags, fieldPath) + ')[]'
              }
            }
          }

          if (
            (fieldType === 'any[]' || fieldType === '({ String: String })[]') &&
            /\bname\b/.test(field.comment ?? '')
          ) {
            fieldType = 'QualifiedName'
          } else if (fieldType === 'any[]') {
            warnUnknownType(typeName + '.' + fieldName, 'list type')
          }

          const nullable =
            (fieldMetadata
              ? fieldMetadata[fieldName]?.nullable ?? true
              : /\b(NULL|NIL|if any)\b/.test(field.comment ?? '')) ||
            nullableFields.has(fieldPath)

          fieldTsDef += `  ${fieldName}${nullable ? '?' : ''}: ${fieldType}\n`
        }

        code += formatComment(field.comment, '  ') + fieldTsDef
      }

      code += `}\n`
    }
  }

  // These are untested by libpg_query's test suite, so they've been incorrectly
  // marked as object types, even though they are valid node types.
  objectTypes.delete('CreateExtensionStmt')
  objectTypes.delete('AlterExtensionStmt')
  objectTypes.delete('AlterExtensionContentsStmt')

  for (const name of [...objectTypes, ...skippedEntities]) {
    expressionTypes.delete(name)
    nodeTypes.delete(name)
  }

  nodeTypes.forEach(name => {
    if (!entityNames.includes(name)) {
      nodeTypes.delete(name)
    }
  })

  // A_Const can represent a NULL value.
  constTypes.push('{ isnull: true }')

  code += '\n'
  code += `/** A qualified name for referencing a database object, e.g. "public.my_table" */\n`
  code += 'export type QualifiedName = { String: String }[]\n'

  code += '\n'
  code += formatComment(abstractTypes.List?.comment, '')
  code += 'export type List<T = Node> = { items: T[] }\n'

  code += '\n'
  code += formatComment(abstractTypes.A_Const?.comment, '')
  code +=
    'export type A_Const =\n  | ' + constTypes.sort().join('\n  | ') + '\n'

  code += '\n'
  code += formatComment(abstractTypes.Expr?.comment, '')
  code +=
    'export type Expr =\n  | ' +
    [...expressionTypes]
      .sort()
      .map(name => `{ ${name}: ${name}${name === 'List' ? '<Expr>' : ''} }`)
      .join('\n  | ') +
    '\n'

  code += '\n'
  code +=
    'export type Node =\n  | ' +
    [...nodeTypes]
      .sort()
      .map(name => `{ ${name}: ${name} }`)
      .join('\n  | ') +
    '\n'

  fs.writeFileSync('src/lib/ast.ts', code.trimStart())

  code = `
/* This file is auto-generated by scripts/generateTypes.ts */
import type { Node } from "./ast.js"

/** The tag of every possible node. */
export type NodeTag<TNode extends Node = Node> = TNode extends any
  ? keyof TNode
  : never

/** The type of a node by its tag. */
export type NodeByTag<TNodeTag extends NodeTag> = Node extends infer TNode
  ? TNode extends any
    ? TNodeTag extends keyof TNode
      ? TNode[TNodeTag]
      : never
    : never
  : never

export class NodePath<TNodeTag extends NodeTag = NodeTag> {
  constructor(readonly tag: TNodeTag, readonly node: NodeByTag<TNodeTag>, readonly parent: NodePath | null, readonly keyPath: readonly (string | number)[]) {}
  ${Array.from(
    nodeTypes,
    name => `
  is${name}(): this is NodePath<"${name}"> {
    return this.tag === "${name}"
  }`,
  )
    .join('')
    .trimStart()}
}
`

  fs.writeFileSync('src/lib/node.ts', code.trimStart())

  code = `
/* This file is auto-generated by scripts/generateTypes.ts */
function isTaggedNode(node: object, tag: string) {
  const keys = Object.keys(node)
  return keys.length === 1 && keys[0] === tag
}

export const typeGuards = {
  ${Array.from(
    nodeTypes,
    name => `
  is${name}(node: object | undefined): node is { ${name}: import("./ast").${name} } {
    return node != null && isTaggedNode(node, "${name}")
  }`,
  )
    .join(',')
    .trimStart()}
}
`

  fs.writeFileSync('src/lib/typeGuards.ts', code.trimStart())
}

main()
