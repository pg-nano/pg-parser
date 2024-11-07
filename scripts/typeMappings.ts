export const typeMappings: Record<string, string> = {
  void: 'void',
  bool: 'boolean',
  bits32: 'number',
  char: 'string',
  'char*': 'string',
  double: 'number',
  float4: 'number',
  long: 'number',
  int: 'number',
  int16: 'number',
  int32: 'number',
  uint16: 'number',
  uint32: 'number',
  uint64: 'number',
  'unsigned int': 'number',
  'signed int': 'number',

  // Overrides
  List: 'any[]',
  NameData: 'string',
  Node: 'Node',
  RelFileNumber: 'number',
  'Alias.colnames': NodeArray('String'),
  'Constraint.generated_when': '"a" | "d"',
  'SelectStmt.valuesLists': 'List<Expr>[]',
}

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

/**
 * If a field's nullability is incorrectly inferred, add it here.
 */
export const nullableFields = new Set([
  'A_Expr.rexpr',
  'A_Indices.uidx',
  'AccessPriv.priv_name',
  'Aggref.aggdistinct',
  'Alias.colnames',
  'Boolean.boolval',
  'ClosePortalStmt.portalname',
  'ClusterStmt.relation',
  'CurrentOfExpr.cursor_name',
  'DeallocateStmt.name',
  'IntoClause.viewQuery',
  'OnConflictClause.infer',
  'SetOperationStmt.groupClauses',
  'SubPlan.testexpr',
  'VacuumRelation.relation',
])

function Node(types: string) {
  return types
    .split(' | ')
    .map(type => `{ ${type}: ${type} }`)
    .join(' | ')
}

function NodeArray(types: string) {
  return `(${Node(types)})[]`
}
