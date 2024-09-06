import fs from "node:fs"
import { typeMappings } from "./typeMappings"
import { type NodeFieldMetadataByTag } from "./inferFieldMetadata"

/** A record of node tag -> field name -> nullability */
const nodeFieldsByTag: NodeFieldMetadataByTag = JSON.parse(
  fs.readFileSync("nodeFields.json", "utf8"),
)

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
  if (comment == null || comment === "") {
    return ""
  }
  return comment
    .replace(/\/\*/, "/**")
    .replace(/^\s*/, indent)
    .replace(/\n?$/, "\n")
}

const bitMasks: Record<string, string[]> = {
  AclMode: [
    "ACL_NO_RIGHTS",
    "ACL_INSERT",
    "ACL_SELECT",
    "ACL_UPDATE",
    "ACL_DELETE",
    "ACL_TRUNCATE",
    "ACL_REFERENCES",
    "ACL_TRIGGER",
    "ACL_EXECUTE",
    "ACL_USAGE",
    "ACL_CREATE",
    "ACL_CREATE_TEMP",
    "ACL_CONNECT",
    "ACL_SET",
    "ACL_ALTER_SYSTEM",
  ],
}

async function main() {
  const baseURL =
    "https://raw.githubusercontent.com/pganalyze/libpg_query/16-latest/srcdata/"

  const [structsByModule, enumsByModule, typeDefs, nodeTypes] =
    await Promise.all([
      fetch(baseURL + "struct_defs.json").then((r) =>
        r.json(),
      ) as Promise<StructsByModule>,
      fetch(baseURL + "enum_defs.json").then((r) =>
        r.json(),
      ) as Promise<EnumsByModule>,
      fetch(baseURL + "typedefs.json").then((r) => r.json()) as Promise<
        TypeDef[]
      >,
      fetch(baseURL + "nodetypes.json")
        .then((r) => r.json())
        .then((r) => new Set(r as string[])),
    ])

  const entityNames = [
    ...typeDefs.map((t) => t.new_type_name),
    ...Object.values(enumsByModule).flatMap((e) => Object.keys(e)),
    ...Object.values(structsByModule).flatMap((s) => Object.keys(s)),
  ]

  const skippedEntities = new Set([
    "NodeTag",
    "ParallelVacuumState",
    "QuerySource",
    "VacAttrStatsP",
    "pg_wchar",
  ])

  const shouldSkipEntity = (name: string) => {
    if (skippedEntities.has(name)) {
      return true
    }
    if (name.startsWith("Block")) {
      return true
    }
    return false
  }

  const unknownTypes = new Set<string>()
  const warnUnknownType = (name: string, label = "type") => {
    if (!unknownTypes.has(name)) {
      unknownTypes.add(name)
      // console.warn("Unknown %s: %O", label, name)
    }
  }

  const applyTypeMapping = (name: string, c_type: string): string => {
    const rawType = c_type.replace(/\*$/, "")
    const mapping = (name && typeMappings[name]) || typeMappings[rawType]
    if (mapping) {
      if (mapping === "Node" && name.endsWith("expr")) {
        return "Expr"
      }
      return mapping
    }
    if (entityNames.includes(rawType)) {
      return rawType
    }
    warnUnknownType(rawType)
    return "any"
  }

  let code = ""

  for (const typeDef of typeDefs) {
    if (shouldSkipEntity(typeDef.new_type_name)) {
      continue
    }

    code += "\n"
    code += formatComment(typeDef.comment, "")

    const bitMask = bitMasks[typeDef.new_type_name]
    if (bitMask) {
      code += `export enum ${typeDef.new_type_name} {\n`
      bitMask.forEach((value, index) => {
        code += `  ${value} = ${index > 0 ? "1 << " + (index - 1) : 0},\n`
      })
      code += `}\n`
    } else {
      code += `export type ${typeDef.new_type_name} = ${applyTypeMapping(typeDef.new_type_name, typeDef.source_type)}\n`
    }
  }

  for (const enums of Object.values(enumsByModule)) {
    const keys = Object.keys(enums)
    if (keys.length === 0) {
      continue
    }

    // Remove copyright comment.
    enums[keys[0]].comment = ""

    for (const [enumName, { values, comment }] of Object.entries(enums)) {
      if (shouldSkipEntity(enumName)) {
        continue
      }

      code += "\n"
      code += formatComment(comment, "")
      code += `export enum ${enumName} {\n`
      for (const value of values) {
        code += formatComment(value.comment, "  ")
        if ("name" in value) {
          code += `  ${value.name} = "${value.name}",\n`
        }
      }
      code += `}\n`
    }
  }

  delete structsByModule["../backend/parser/gram"]
  delete structsByModule["../backend/parser/gramparse"]

  const constTypes: string[] = []
  const expressionTypes = new Set([
    "A_Const",
    "List",
    "TypeCast",
    "FuncCall",
    "ColumnRef",
  ])

  const abstractTypes: Record<string, StructDef | null> = {
    A_Const: null,
    Expr: null,
    List: null,
    Query: null,
    RangeTblEntry: null,
    RangeTblFunction: null,
    TableFunc: null,
  }

  /** Type aliases are excluded from the Node type */
  const typeAliases = new Set(Object.keys(abstractTypes))

  /** Fix structs that do not reflect the AST accurately */
  const fixedStructs: Record<string, string> = {
    PartitionRangeDatum: "Expr",
  }

  for (const structs of Object.values(structsByModule)) {
    for (const typeName in abstractTypes) {
      if (structs[typeName]) {
        abstractTypes[typeName] = structs[typeName]
        delete structs[typeName]
      }
    }

    for (let [typeName, { fields, comment }] of Object.entries(structs)) {
      if (shouldSkipEntity(typeName)) {
        continue
      }

      if (typeName.endsWith("Expr")) {
        expressionTypes.add(typeName)
      }

      code += "\n"
      code += formatComment(comment, "")
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
        namedFields[0].name.endsWith("val") &&
        namedFields[0].name.length > 3
      ) {
        constTypes.push(typeName)
      }

      const fieldMetadata = nodeFieldsByTag[typeName]
      if (!fieldMetadata) {
        // If field metadata could not be inferred from libpg_query's test
        // suite, then it's likely not a node type.
        typeAliases.add(typeName)
      }

      code += "{\n"

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
        let fieldTsDef = ""

        if (field.name !== undefined) {
          const fieldName = field.name.replace(/\[.+?\]$/, "")

          if (fieldName === "xpr") {
            expressionTypes.add(typeName)
            continue
          }

          let fieldType = applyTypeMapping(
            typeName + "." + fieldName,
            field.c_type,
          )

          if (fieldName === "type" && fieldType === "NodeTag") {
            // Strangely, the result of pg_query_parse doesn't actually include
            // the node tags, so skip defining them.
            continue
          }

          if (fieldName === "relations") {
            console.log({ typeName, fieldName, fieldType, field })
          }

          const debugTags = false

          if (fieldType === "any" || fieldType === "Node") {
            const inferredTags = fieldMetadata?.[fieldName]?.[1]
            if (inferredTags) {
              debugTags &&
                console.log(
                  "Inferred tags for %s.%s:",
                  typeName,
                  fieldName,
                  inferredTags,
                )
              fieldType =
                "(" +
                inferredTags.map((tag) => `{ ${tag}: ${tag} }`).join(" | ") +
                ")"
            }
          } else if (fieldType === "any[]") {
            const inferredListTags = fieldMetadata?.[fieldName]?.[2]
            if (inferredListTags) {
              debugTags &&
                console.log(
                  "Inferred list tags for %s.%s:",
                  typeName,
                  fieldName,
                  inferredListTags,
                )

              fieldType =
                "List<" +
                inferredListTags
                  .map((tag) => `{ ${tag}: ${tag} }`)
                  .join(" | ") +
                ">"

              if (field.c_type === "List*") {
                fieldType += "[]"
              }
            }
            if (fieldType === "any[]" && field.c_type === "List*") {
              const inferredTags = fieldMetadata?.[fieldName]?.[1]
              if (inferredTags) {
                debugTags &&
                  console.log(
                    "Inferred tags for %s.%s:",
                    typeName,
                    fieldName,
                    inferredTags,
                  )
                fieldType =
                  "(" +
                  inferredTags.map((tag) => `{ ${tag}: ${tag} }`).join(" | ") +
                  ")[]"
              }
            }
            if (fieldType === "any[]") {
              warnUnknownType(typeName + "." + fieldName, "list type")
            }
          }

          const nullable = fieldMetadata
            ? (fieldMetadata[fieldName]?.[0] ?? true)
            : /\b(NULL|NIL)\b/.test(field.comment ?? "")

          fieldTsDef += `  ${fieldName}${nullable ? "?" : ""}: ${fieldType}\n`
        }

        code += formatComment(field.comment, "  ") + fieldTsDef
      }

      code += `}\n`
    }
  }

  for (const name of typeAliases) {
    nodeTypes.delete(name)
    expressionTypes.delete(name)
  }

  nodeTypes.forEach((name) => {
    if (!entityNames.includes(name)) {
      nodeTypes.delete(name)
    }
  })

  nodeTypes.add("List")
  nodeTypes.add("A_Const")
  expressionTypes.add("A_Const")

  code += "\n"
  code += formatComment(abstractTypes.List?.comment, "")
  code += "export type List<T = Node> = { items: T[] }\n"

  code += "\n"
  code += formatComment(abstractTypes.A_Const?.comment, "")
  code += "export type A_Const =\n  | " + constTypes.join("\n  | ") + "\n"

  code += "\n"
  code += formatComment(abstractTypes.Expr?.comment, "")
  code +=
    "export type Expr =\n  | " +
    Array.from(
      expressionTypes,
      (name) => `{ ${name}: ${name}${name === "List" ? "<Expr>" : ""} }`,
    ).join("\n  | ") +
    "\n"

  code += "\n"
  code +=
    "export type Node =\n  | " +
    Array.from(nodeTypes, (name) => `{ ${name}: ${name} }`).join("\n  | ") +
    "\n"

  fs.writeFileSync("ast.ts", code.trimStart())

  const nodeClass = `
import type { Node } from "./ast"

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
  constructor(readonly tag: TNodeTag, readonly node: NodeByTag<TNodeTag>, readonly parent: NodePath | null) {}
  ${Array.from(
    nodeTypes,
    (name) => `
  is${name}(): this is NodePath<"${name}"> {
    return this.tag === "${name}"
  }`,
  )
    .join("")
    .trimStart()}
}
  
function isTaggedNode(node: object, tag: string) {
  const keys = Object.keys(node)
  return keys.length === 1 && keys[0] === tag
}

export const NodeTag = {
  ${Array.from(
    nodeTypes,
    (name) => `
  is${name}(node: object | undefined): node is { ${name}: import("./ast").${name} } {
    return node != null && isTaggedNode(node, "${name}")
  }`,
  )
    .join(",")
    .trimStart()}
}
`

  fs.writeFileSync("node.ts", nodeClass.trimStart())
}

main()
