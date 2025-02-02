import fs from 'node:fs'
import path from 'node:path'

const testDir = 'libpg_query/test/sql/postgres_regress'
const testFiles = fs.readdirSync(testDir)

const cwd = process.cwd()

const renderTest = (testFile: string) => `
import { describe, test, expect } from "vitest"
import { parseTestFile } from "../parseTestFile"
import { parseQuery } from "../../index"

describe("${testFile}", () => {
  const tests = parseTestFile("${path.relative(cwd, path.join(testDir, testFile))}")
  for (const { line, stmt } of tests) {
    test("line " + line, async () => {
      try {
        const ast = await parseQuery(stmt)
        expect([stmt, ast]).toMatchSnapshot()
      } catch (error) {
        expect([stmt, error]).toMatchSnapshot()
      }
    })
  }
})
`

const outDir = 'test/postgres_regress'
fs.mkdirSync(outDir, { recursive: true })

for (const testFile of testFiles) {
  fs.writeFileSync(
    path.join(outDir, testFile.replace(/\.sql$/, '.test.ts')),
    renderTest(testFile),
  )
}
