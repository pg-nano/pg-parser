import bindings from 'bindings'
import type { Node } from './ast'
import type { TokenKind, KeywordKind } from './tokens'

const loadAddon = () => bindings('queryparser')

let PgQuery: {
  parseQueryAsync: (
    query: string,
    callback: (err: Error | null, result: string) => void,
  ) => void
  parseQuerySync: (query: string) => string
  parsePlPgSQLAsync: (
    query: string,
    callback: (err: Error | null, result: string) => void,
  ) => void
  parsePlPgSQLSync: (query: string) => string
  fingerprintAsync: (
    query: string,
    callback: (err: Error | null, result: string) => void,
  ) => void
  fingerprintSync: (query: string) => string
  scanSync: (query: string) => ScanResult
  splitWithScannerSync: (query: string) => {
    location: number
    length: number
  }[]
}

export type ParseResult = {
  stmts: { stmt: Node; stmt_location?: number; stmt_len?: number }[]
  version: number
}

export interface Token {
  kind: TokenKind
  start: number
  end: number
  keyword: KeywordKind
}

export type ScanResult = Token[]

export function parseQuery(query: string) {
  return new Promise<ParseResult>((resolve, reject) => {
    PgQuery ??= loadAddon()
    PgQuery.parseQueryAsync(query, (err, result) => {
      err ? reject(err) : resolve(JSON.parse(result))
    })
  })
}

export function parseQuerySync(query: string): ParseResult {
  return JSON.parse((PgQuery ??= loadAddon()).parseQuerySync(query))
}

export function parsePlPgSQL(query: string) {
  return new Promise<Node[]>((resolve, reject) => {
    PgQuery ??= loadAddon()
    PgQuery.parsePlPgSQLAsync(query, (err, result) => {
      err ? reject(err) : resolve(JSON.parse(result))
    })
  })
}

export function parsePlPgSQLSync(query: string): Node[] {
  return JSON.parse((PgQuery ??= loadAddon()).parsePlPgSQLSync(query))
}

export function fingerprint(query: string) {
  return new Promise<string>((resolve, reject) => {
    PgQuery ??= loadAddon()
    PgQuery.fingerprintAsync(query, (err, result) => {
      err ? reject(err) : resolve(result)
    })
  })
}

export function fingerprintSync(query: string): string {
  return (PgQuery ??= loadAddon()).fingerprintSync(query)
}

export function scanSync(query: string) {
  return (PgQuery ??= loadAddon()).scanSync(query)
}

export function splitWithScannerSync(query: string) {
  return (PgQuery ??= loadAddon()).splitWithScannerSync(query)
}
