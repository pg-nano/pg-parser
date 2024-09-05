import { parseQuery, splitWithScannerSync } from "../index"
import fs from "node:fs"

export function parseTestFile(testPath: string) {
  let sql = fs.readFileSync(testPath, "utf8")
  sql = sql.replace(/FROM STDIN;[\S\s]+\n\\./i, "FROM STDIN;")

  const stmts = splitWithScannerSync(sql)
  const lineBreaks = getLineBreakLocations(sql)

  const tests: { line: number; run: () => Promise<any> }[] = []

  for (let { location, length } of stmts) {
    // Skip comments and empty lines.
    const originalLocation = location
    while (sql[location] === "\n" || sql.substr(location, 2) === "--") {
      location = sql.indexOf("\n", location + 1) + 1
    }
    length -= location - originalLocation

    // Get the line number.
    const line =
      lineBreaks.findIndex((lineBreak) => location < lineBreak) + 1 ||
      lineBreaks.length

    tests.push({
      line,
      run: async () => {
        const stmt = sql.slice(location, location + length)
        return parseQuery(stmt)
      },
    })
  }

  return tests
}

function getLineBreakLocations(sql: string) {
  const locations: number[] = []
  for (let i = 0; i < sql.length; i++) {
    if (sql[i] === "\n") {
      locations.push(i)
    }
  }
  return locations
}
