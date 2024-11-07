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
