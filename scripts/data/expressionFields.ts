/**
 * If a field accepts an arbitrary expression, add it here.
 */
export const expressionFields = new Set([
  'A_ArrayExpr.elements',
  'A_Indirection.arg',
  'AlterTableCmd.def',
  'BoolExpr.args',
  'CollateClause.arg',
  'CreatePolicyStmt.qual',
  'DeleteStmt.whereClause',
  'FuncCall.args',
  'FuncCall.agg_filter',
  'GroupingSet.content',
  'IndexStmt.whereClause',
  'JoinExpr.quals',
  'MergeWhenClause.condition',
  'MergeWhenClause.values',
  'MergeStmt.joinCondition',
  'MinMaxExpr.args',
  'RangeFunction.functions',
  'RangeTableSample.args',
  'ResTarget.val',
  'ReturnStmt.returnval',
  'RowExpr.args',
  'RuleStmt.whereClause',
  'SelectStmt.groupClause',
  'SelectStmt.havingClause',
  'SelectStmt.whereClause',
  'SelectStmt.limitCount',
  'SelectStmt.limitOffset',
  'SortBy.node',
  'TypeCast.arg',
  'UpdateStmt.whereClause',
  'XmlExpr.args',
])
