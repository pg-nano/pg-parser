/**
 * If a node type should exist in the `Expr` union type, but currently doesn't,
 * add it here. This is only necessary if the type doesn't already meet one of
 * these criteria:
 * - Its type name ends in "Expr"
 * - It has a field named "xpr"
 */
export const expressionTypes = new Set([
  'A_Const',
  'List',
  'TypeCast',
  'FuncCall',
  'ColumnRef',
  'ParamRef',
])
