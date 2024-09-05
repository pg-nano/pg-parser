import fs from "node:fs"

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

const typeMappings: Record<string, string> = {
  bool: "boolean",
  bits32: "number",
  char: "string",
  "char*": "string",
  double: "number",
  long: "number",
  int: "number",
  int16: "number",
  int32: "number",
  uint32: "number",
  uint64: "number",
  "unsigned int": "number",
  "signed int": "number",
  NameData: "string",
  RelFileNumber: "number",
  ParallelVacuumState: "any",

  // Overrides
  "Query.commandType": `"select" | "insert" | "update" | "delete" | "merge" | "utility"`,
  "Query.querySource": "string",
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

  function applyTypeMapping(name: string, c_type: string): string {
    const mapping = typeMappings[name] || typeMappings[c_type]
    if (mapping) {
      return mapping
    }
    const rawType = c_type.replace(/\*$/, "")
    if (entityNames.includes(rawType)) {
      return rawType
    }
    return "any"
  }

  let code = ""

  code +=
    "export type Node =\n  | " +
    nodeTypes
      .map((name) => {
        const exists = entityNames.includes(name)
        if (!exists && name.endsWith("List")) {
          const elementName = name.slice(0, -4)
          const elementExists = entityNames.includes(elementName)
          return `{ ${name}: ${elementExists ? elementName : "any"}[] }`
        }
        return `{ ${name}: ${exists ? name : "any"} }`
      })
      .join("\n  | ") +
    "\n"

  for (const typeDef of typeDefs) {
    code += "\n"
    code += formatComment(typeDef.comment, "")
    code += `export type ${typeDef.new_type_name} = ${applyTypeMapping(typeDef.new_type_name, typeDef.source_type)}\n`
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
      code += `export const enum ${enumName} {\n`
      let index = 0
      for (const value of values) {
        code += formatComment(value.comment, "  ")
        if ("name" in value) {
          code += `  ${value.name} = ${value.value ?? index},\n`
          index++
        }
      }
      code += `}\n`
    }
  }
  for (const structs of Object.values(structsByModule)) {
    for (const [typeName, { fields, comment }] of Object.entries(structs)) {
      code += "\n"
      code += formatComment(comment, "")
      code += `export type ${typeName} = {\n`

      for (const field of fields) {
        code += formatComment(field.comment, "  ")
        if ("name" in field) {
          const fieldName = field.name.replace(/\[.+?\]$/, "")
          const fieldType = applyTypeMapping(
            typeName + "." + fieldName,
            field.c_type,
          )

          code += `  ${fieldName}: ${fieldType}\n`
        }
      }

      code += `}\n`
    }
  }

  fs.writeFileSync("ast.ts", code)
}

main()
