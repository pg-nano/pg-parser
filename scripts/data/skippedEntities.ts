/**
 * These are not used anywhere. They're for libpg_query's internal use.
 */
export const skippedEntities = new Set([
  'BlockId',
  'BlockIdData',
  'BlockNumber',
  'NodeTag',
  'ParallelVacuumState',
  'Query',
  'QuerySource',
  'RangeTblEntry',
  'RangeTblFunction',
  'TableFunc',
  'VacAttrStatsP',
  'pg_wchar',
])
