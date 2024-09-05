import bindings from "bindings"
import type { Node } from "./ast"

const loadAddon = () => bindings("queryparser")

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
}

export function parseQuery(query: string) {
  return new Promise<Node[]>((resolve, reject) => {
    PgQuery ??= loadAddon()
    PgQuery.parseQueryAsync(query, (err, result) => {
      err ? reject(err) : resolve(JSON.parse(result))
    })
  })
}

export function parseQuerySync(query: string): Node[] {
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
