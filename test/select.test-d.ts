import { describe, expectTypeOf, test } from 'vitest'
import type { ColumnRef, Expr } from '../src/lib/ast'
import { select } from '../src/lib/select'

describe('select', () => {
  test('union of multiple node types', () => {
    const value = {} as Expr
    const fields = select(value, 'fields')
    expectTypeOf(fields).toEqualTypeOf<ColumnRef['fields'] | undefined>()
  })
})
