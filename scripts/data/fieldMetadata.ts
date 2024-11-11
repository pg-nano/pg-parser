import fs from 'node:fs'
import path from 'node:path'
import { mapValues } from 'radashi'
import type { NodeFieldMetadataByTag } from '../inferFieldMetadata'

const dataDir = new URL('.', import.meta.url).pathname
const data = mapValues(
  JSON.parse(
    fs.readFileSync(path.join(dataDir, 'fieldMetadata.json'), 'utf8'),
  ) as NodeFieldMetadataByTag,
  fieldMap =>
    mapValues(fieldMap!, ([nullable, tags, listTags]) => ({
      nullable,
      tags,
      listTags,
    })),
)

/**
 * Field metadata is inferred from test cases sourced from the libpg_query
 * repository. Check out the {@link ../inferFieldMetadata.ts inferFieldMetadata}
 * module for more details.
 */
export const fieldMetadataMap = data as {
  [typeName: string]: {
    [fieldName: string]: typeof data[string][string] | undefined
  } | undefined
}
