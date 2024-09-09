import { describe, test, expectTypeOf } from "vitest"
import { select } from "../select"
import { ColumnRef, Expr } from "../ast"

describe("select", () => {
  test("union of multiple node types", () => {
    const value = {} as Expr
    const fields = select(value, "fields")
    expectTypeOf(fields).toEqualTypeOf<ColumnRef["fields"] | undefined>()
  })
})
