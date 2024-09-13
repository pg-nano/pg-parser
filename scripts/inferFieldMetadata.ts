import fs from 'node:fs'
import path from 'node:path'
import { select, castArrayIfExists, unique } from 'radashi'
import { parseTestFile } from '../test/parseTestFile'
import { parseQuerySync } from '../src/lib/binding'
import { walk } from '../src/lib/walk'
import type { Node } from '../src/lib/ast'
import { NodeTag } from '../src/lib/node'

const testDir = 'libpg_query/test/sql/postgres_regress'
const testFiles = fs.readdirSync(testDir)

export type NodeFieldMetadata = [
  nullable: boolean,
  tags: string[] | null,
  listTags: string[] | null,
]

export type NodeFieldMetadataByTag = {
  [typeName: string]:
    | { [fieldName: string]: NodeFieldMetadata | undefined }
    | undefined
}

const fieldsByNodeTag: NodeFieldMetadataByTag = {}

const toNodeTag = (value: unknown) => {
  if (value != null && typeof value === 'object') {
    const keys = Object.keys(value)
    if (keys.length === 1 && /^[A-Z]/.test(keys[0])) {
      return keys[0]
    }
  }
}

const inferNodeTags = (value: unknown) =>
  Array.isArray(value)
    ? unique(select(value, toNodeTag))
    : castArrayIfExists(toNodeTag(value)) ?? null

const inferListTags = (value: Node[]) => {
  const lists = value.filter(NodeTag.isList)
  const itemTags = lists.flatMap(list => inferNodeTags(list.List.items) ?? [])
  return itemTags.length > 0 ? unique(itemTags) : null
}

for (const testFile of testFiles) {
  try {
    const stmts = parseTestFile(path.join(testDir, testFile))
    for (const { stmt } of stmts) {
      try {
        const ast = parseQuerySync(stmt)
        walk(ast, path => {
          const defaultNullability = path.tag in fieldsByNodeTag
          const seen = (fieldsByNodeTag[path.tag] ??= {})

          for (const key in path.node) {
            const value = (path.node as any)[key]
            const tags = inferNodeTags(value)
            const listTags =
              tags && Array.isArray(value) && tags.includes('List')
                ? inferListTags(value)
                : null

            if (seen[key] == null) {
              seen[key] = [defaultNullability, tags, listTags]
            } else {
              if (tags) {
                seen[key][1] = seen[key][1]
                  ? unique([...tags, ...seen[key][1]])
                  : tags
              }
              if (listTags) {
                seen[key][2] = seen[key][2]
                  ? unique([...listTags, ...seen[key][2]])
                  : listTags
              }
            }
          }

          for (const key in seen) {
            if (!(key in path.node)) {
              seen[key] ??= [true, null, null]
              seen[key][0] = true
            }
          }
        })
      } catch {}
    }
  } catch {}
}

fs.writeFileSync('nodeFields.json', JSON.stringify(fieldsByNodeTag, null, 2))
