import fs from "node:fs"
import { typeMappings } from "./typeMappings"

type StructsByModule = Record<string, Record<string, StructDef>>
type EnumsByModule = Record<string, Record<string, EnumDef>>

type StructDef = {
  fields: (FieldDef | { comment: string })[]
  comment?: string | null
}

type FieldDef = {
  name: string
  c_type: string
  comment?: string | null
}

type EnumDef = {
  values: (EnumValueDef | { comment: string })[]
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

  const [structsByModule, enumsByModule, typeDefs, nodeTypes]: [
    StructsByModule,
    EnumsByModule,
    TypeDef[],
    string[],
  ] = await Promise.all([
    fetch(baseURL + "struct_defs.json").then((r) => r.json()),
    fetch(baseURL + "enum_defs.json").then((r) => r.json()),
    fetch(baseURL + "typedefs.json").then((r) => r.json()),
    fetch(baseURL + "nodetypes.json").then((r) => r.json()),
  ])

  const entityNames = [
    ...typeDefs.map((t) => t.new_type_name),
    ...Object.values(enumsByModule).flatMap((e) => Object.keys(e)),
    ...Object.values(structsByModule).flatMap((s) => Object.keys(s)),
  ]

  const unknownTypes = new Set<string>()
  const warnUnknownType = (name: string, label = "type") => {
    if (!unknownTypes.has(name)) {
      unknownTypes.add(name)
      console.warn("Unknown %s: %O", label, name)
    }
  }

  const applyTypeMapping = (name: string, c_type: string): string => {
    const rawType = c_type.replace(/\*$/, "")
    const mapping = (name && typeMappings[name]) || typeMappings[rawType]
    if (mapping) {
      return mapping
    }
    if (entityNames.includes(rawType)) {
      return rawType
    }
    warnUnknownType(rawType)
    return "any"
  }

  let code = ""

  code +=
    "export type Node =\n  | " +
    nodeTypes
      .map((name) => {
        const exists = entityNames.includes(name)
        if (!exists) {
          warnUnknownType(name, "node type")
        }
        return `{ ${name}: ${exists ? name : "any"} }`
      })
      .join("\n  | ") +
    "\n"

  for (const typeDef of typeDefs) {
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
      code += "\n"
      code += formatComment(comment, "")
      code += `export enum ${enumName} {\n`
      for (const value of values) {
        code += formatComment(value.comment, "  ")
        if ("name" in value) {
          code += `  ${value.name},\n`
        }
      }
      code += `}\n`
    }
  }
  for (const structs of Object.values(structsByModule)) {
    for (let [typeName, { fields, comment }] of Object.entries(structs)) {
      code += "\n"
      code += formatComment(comment, "")
      code += `export type ${typeName} = {\n`

      for (const field of fields) {
        let fieldCode = formatComment(field.comment, "  ")

        if ("name" in field) {
          const fieldName = field.name.replace(/\[.+?\]$/, "")

          let fieldType = applyTypeMapping(
            typeName + "." + fieldName,
            field.c_type,
          )

          if (fieldName === "type" && fieldType === "NodeTag") {
            // Strangely, the result of pg_query_parse doesn't actually include
            // the node tags, so skip defining them.
            continue
          }

          if (fieldType === "any[]" && /^List\*?$/.test(field.c_type)) {
            const comment = field.comment?.replace(/^[\s\*\/]+/, "") ?? ""
            if (/oid list/i.test(comment)) {
              fieldType = "Oid[]"
            } else if (/integer list/i.test(comment)) {
              fieldType = "number[]"
            } else {
              const possibleType = comment.match(/\b[lL]ist of ([A-Z]\w+)\b/)
              if (possibleType) {
                let typeName = possibleType[1]
                if (entityNames.includes(typeName)) {
                  fieldType = `${typeName}[]`
                } else if (typeName.endsWith("s")) {
                  typeName = typeName.slice(0, -1)
                  if (entityNames.includes(typeName)) {
                    fieldType = `${typeName}[]`
                  }
                }
              }
              if (fieldType === "any[]") {
                warnUnknownType(typeName + "." + fieldName, "list type")
              }
            }
          }

          fieldCode += `  ${fieldName}: ${fieldType}\n`
        }

        code += fieldCode
      }

      code += `}\n`
    }
  }

  fs.writeFileSync("ast.ts", code)
}

main()
