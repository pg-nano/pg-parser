import { fingerprintSync, splitWithScannerSync } from '../binding'
import fs from 'node:fs'

export function parseTestFile(testPath: string) {
  let sql = fs.readFileSync(testPath, 'utf8')
  sql = sql.replace(/FROM STDIN;[\S\s]+\n\\./i, 'FROM STDIN;')

  const stmts = splitWithScannerSync(sql)
  const lineBreaks = getLineBreakLocations(sql)
  const fingerprints = new Set<string>()

  const tests: { line: number; stmt: string }[] = []

  for (let { location, length } of stmts) {
    // Skip comments and empty lines.
    const originalLocation = location
    while (sql[location] === '\n' || sql.substr(location, 2) === '--') {
      location = sql.indexOf('\n', location + 1) + 1
    }
    length -= location - originalLocation

    const stmt = sql.slice(location, location + length)
    if (stmt) {
      try {
        const fingerprint = fingerprintSync(stmt)
        if (fingerprints.has(fingerprint)) {
          continue
        }

        // Get the line number.
        const line =
          lineBreaks.findIndex(lineBreak => location < lineBreak) + 1 ||
          lineBreaks.length

        tests.push({ line, stmt })
        fingerprints.add(fingerprint)
      } catch {}
    }
  }

  return tests
}

function getLineBreakLocations(sql: string) {
  const locations: number[] = []
  for (let i = 0; i < sql.length; i++) {
    if (sql[i] === '\n') {
      locations.push(i)
    }
  }
  return locations
}
