/**
 * Grantable rights are encoded so that we can OR them together in a bitmask.
 * The present representation of AclItem limits us to 32 distinct rights,
 * even though AclMode is defined as uint64.  See utils/acl.h.
 *
 * Caution: changing these codes breaks stored ACLs, hence forces initdb.
 */
export enum AclMode {
  ACL_NO_RIGHTS = 0,
  ACL_INSERT = 1 << 0,
  ACL_SELECT = 1 << 1,
  ACL_UPDATE = 1 << 2,
  ACL_DELETE = 1 << 3,
  ACL_TRUNCATE = 1 << 4,
  ACL_REFERENCES = 1 << 5,
  ACL_TRIGGER = 1 << 6,
  ACL_EXECUTE = 1 << 7,
  ACL_USAGE = 1 << 8,
  ACL_CREATE = 1 << 9,
  ACL_CREATE_TEMP = 1 << 10,
  ACL_CONNECT = 1 << 11,
  ACL_SET = 1 << 12,
  ACL_ALTER_SYSTEM = 1 << 13,
}

/**
 * DistinctExpr - expression node for "x IS DISTINCT FROM y"
 *
 * Except for the nodetag, this is represented identically to an OpExpr
 * referencing the "=" operator for x and y.
 * We use "=", not the more obvious "<>", because more datatypes have "="
 * than "<>".  This means the executor must invert the operator result.
 * Note that the operator function won't be called at all if either input
 * is NULL, since then the result can be determined directly.
 */
export type DistinctExpr = OpExpr

/**
 * NullIfExpr - a NULLIF expression
 *
 * Like DistinctExpr, this is represented the same as an OpExpr referencing
 * the "=" operator for x and y.
 */
export type NullIfExpr = OpExpr

/**
 * Typedefs for identifying qualifier selectivities and plan costs as such.
 * These are just plain "double"s, but declaring a variable as Selectivity
 * or Cost makes the intent more obvious.
 *
 * These could have gone into plannodes.h or some such, but many files
 * depend on them...
 */
export type Selectivity = number

export type Cost = number

export type Cardinality = number

export type ParamListInfo = ParamListInfoData

/**
 * user defined attribute numbers start at 1.   -ay 2/95
 */
export type AttrNumber = number

/**
 * Pointer
 *		Variable holding address of any memory resident object.
 *
 *		XXX Pointer arithmetic is done with this, so it can't be void *
 *		under "true" ANSI compilers.
 */
export type Pointer = string

/**
 * Index
 *		Index into any memory resident array.
 *
 * Note:
 *		Indices are non negative.
 */
export type Index = number

/**
 * Offset
 *		Offset into any memory resident array.
 *
 * Note:
 *		This differs from an Index in that an Index is always
 *		non negative, whereas Offset may be negative.
 */
export type Offset = number

/**
 * regproc is the type name used in the include/catalog headers, but
 * RegProcedure is the preferred name in C code.
 */
export type regproc = Oid

export type RegProcedure = regproc

export type TransactionId = number

export type LocalTransactionId = number

export type SubTransactionId = number

/** MultiXactId must be equivalent to TransactionId, to fit in t_xmax */
export type MultiXactId = TransactionId

export type MultiXactOffset = number

export type CommandId = number

/**
 * Representation of a Name: effectively just a C string, but null-padded to
 * exactly NAMEDATALEN bytes.  The use of a struct is historical.
 */
export type Name = string

/**
 * A Datum contains either a value of a pass-by-value type or a pointer to a
 * value of a pass-by-reference type.  Therefore, we require:
 *
 * sizeof(Datum) == sizeof(void *) == 4 or 8
 *
 * The functions below and the analogous functions for other types should be used to
 * convert between a Datum and the appropriate C type.
 */
export type Datum = any

/**
 * Object ID is a fundamental type in Postgres.
 */
export type Oid = number

export enum OverridingKind {
  OVERRIDING_NOT_SET = "OVERRIDING_NOT_SET",
  OVERRIDING_USER_VALUE = "OVERRIDING_USER_VALUE",
  OVERRIDING_SYSTEM_VALUE = "OVERRIDING_SYSTEM_VALUE",
}

/** Sort ordering options for ORDER BY and CREATE INDEX */
export enum SortByDir {
  SORTBY_DEFAULT = "SORTBY_DEFAULT",
  SORTBY_ASC = "SORTBY_ASC",
  SORTBY_DESC = "SORTBY_DESC",
  /** not allowed in CREATE INDEX ... */
  SORTBY_USING = "SORTBY_USING",
}

export enum SortByNulls {
  SORTBY_NULLS_DEFAULT = "SORTBY_NULLS_DEFAULT",
  SORTBY_NULLS_FIRST = "SORTBY_NULLS_FIRST",
  SORTBY_NULLS_LAST = "SORTBY_NULLS_LAST",
}

/** Options for [ ALL | DISTINCT ] */
export enum SetQuantifier {
  SET_QUANTIFIER_DEFAULT = "SET_QUANTIFIER_DEFAULT",
  SET_QUANTIFIER_ALL = "SET_QUANTIFIER_ALL",
  SET_QUANTIFIER_DISTINCT = "SET_QUANTIFIER_DISTINCT",
}

/**
 * A_Expr - infix, prefix, and postfix expressions
 */
export enum A_Expr_Kind {
  /** normal operator */
  AEXPR_OP = "AEXPR_OP",
  /** scalar op ANY (array) */
  AEXPR_OP_ANY = "AEXPR_OP_ANY",
  /** scalar op ALL (array) */
  AEXPR_OP_ALL = "AEXPR_OP_ALL",
  /** IS DISTINCT FROM - name must be "=" */
  AEXPR_DISTINCT = "AEXPR_DISTINCT",
  /** IS NOT DISTINCT FROM - name must be "=" */
  AEXPR_NOT_DISTINCT = "AEXPR_NOT_DISTINCT",
  /** NULLIF - name must be "=" */
  AEXPR_NULLIF = "AEXPR_NULLIF",
  /** [NOT] IN - name must be "=" or "<>" */
  AEXPR_IN = "AEXPR_IN",
  /** [NOT] LIKE - name must be "~~" or "!~~" */
  AEXPR_LIKE = "AEXPR_LIKE",
  /** [NOT] ILIKE - name must be "~~*" or "!~~*" */
  AEXPR_ILIKE = "AEXPR_ILIKE",
  /** [NOT] SIMILAR - name must be "~" or "!~" */
  AEXPR_SIMILAR = "AEXPR_SIMILAR",
  /** name must be "BETWEEN" */
  AEXPR_BETWEEN = "AEXPR_BETWEEN",
  /** name must be "NOT BETWEEN" */
  AEXPR_NOT_BETWEEN = "AEXPR_NOT_BETWEEN",
  /** name must be "BETWEEN SYMMETRIC" */
  AEXPR_BETWEEN_SYM = "AEXPR_BETWEEN_SYM",
  /** name must be "NOT BETWEEN SYMMETRIC" */
  AEXPR_NOT_BETWEEN_SYM = "AEXPR_NOT_BETWEEN_SYM",
}

/**
 * RoleSpec - a role name or one of a few special values.
 */
export enum RoleSpecType {
  /** role name is stored as a C string */
  ROLESPEC_CSTRING = "ROLESPEC_CSTRING",
  /** role spec is CURRENT_ROLE */
  ROLESPEC_CURRENT_ROLE = "ROLESPEC_CURRENT_ROLE",
  /** role spec is CURRENT_USER */
  ROLESPEC_CURRENT_USER = "ROLESPEC_CURRENT_USER",
  /** role spec is SESSION_USER */
  ROLESPEC_SESSION_USER = "ROLESPEC_SESSION_USER",
  /** role name is "public" */
  ROLESPEC_PUBLIC = "ROLESPEC_PUBLIC",
}

export enum TableLikeOption {
  CREATE_TABLE_LIKE_COMMENTS = "CREATE_TABLE_LIKE_COMMENTS",
  CREATE_TABLE_LIKE_COMPRESSION = "CREATE_TABLE_LIKE_COMPRESSION",
  CREATE_TABLE_LIKE_CONSTRAINTS = "CREATE_TABLE_LIKE_CONSTRAINTS",
  CREATE_TABLE_LIKE_DEFAULTS = "CREATE_TABLE_LIKE_DEFAULTS",
  CREATE_TABLE_LIKE_GENERATED = "CREATE_TABLE_LIKE_GENERATED",
  CREATE_TABLE_LIKE_IDENTITY = "CREATE_TABLE_LIKE_IDENTITY",
  CREATE_TABLE_LIKE_INDEXES = "CREATE_TABLE_LIKE_INDEXES",
  CREATE_TABLE_LIKE_STATISTICS = "CREATE_TABLE_LIKE_STATISTICS",
  CREATE_TABLE_LIKE_STORAGE = "CREATE_TABLE_LIKE_STORAGE",
  CREATE_TABLE_LIKE_ALL = "CREATE_TABLE_LIKE_ALL",
}

/**
 * DefElem - a generic "name = value" option definition
 *
 * In some contexts the name can be qualified.  Also, certain SQL commands
 * allow a SET/ADD/DROP action to be attached to option settings, so it's
 * convenient to carry a field for that too.  (Note: currently, it is our
 * practice that the grammar allows namespace and action only in statements
 * where they are relevant; C code can just ignore those fields in other
 * statements.)
 */
export enum DefElemAction {
  /** no action given */
  DEFELEM_UNSPEC = "DEFELEM_UNSPEC",
  DEFELEM_SET = "DEFELEM_SET",
  DEFELEM_ADD = "DEFELEM_ADD",
  DEFELEM_DROP = "DEFELEM_DROP",
}

export enum PartitionStrategy {
  PARTITION_STRATEGY_LIST = "PARTITION_STRATEGY_LIST",
  PARTITION_STRATEGY_RANGE = "PARTITION_STRATEGY_RANGE",
  PARTITION_STRATEGY_HASH = "PARTITION_STRATEGY_HASH",
}

/**
 * PartitionRangeDatum - one of the values in a range partition bound
 *
 * This can be MINVALUE, MAXVALUE or a specific bounded value.
 */
export enum PartitionRangeDatumKind {
  PARTITION_RANGE_DATUM_MINVALUE = "PARTITION_RANGE_DATUM_MINVALUE",
  /** a specific (bounded) value */
  PARTITION_RANGE_DATUM_VALUE = "PARTITION_RANGE_DATUM_VALUE",
  /** greater than any other value */
  PARTITION_RANGE_DATUM_MAXVALUE = "PARTITION_RANGE_DATUM_MAXVALUE",
}

/**--------------------
 * RangeTblEntry -
 *	  A range table is a List of RangeTblEntry nodes.
 *
 *	  A range table entry may represent a plain relation, a sub-select in
 *	  FROM, or the result of a JOIN clause.  (Only explicit JOIN syntax
 *	  produces an RTE, not the implicit join resulting from multiple FROM
 *	  items.  This is because we only need the RTE to deal with SQL features
 *	  like outer joins and join-output-column aliasing.)  Other special
 *	  RTE types also exist, as indicated by RTEKind.
 *
 *	  Note that we consider RTE_RELATION to cover anything that has a pg_class
 *	  entry.  relkind distinguishes the sub-cases.
 *
 *	  alias is an Alias node representing the AS alias-clause attached to the
 *	  FROM expression, or NULL if no clause.
 *
 *	  eref is the table reference name and column reference names (either
 *	  real or aliases).  Note that system columns (OID etc) are not included
 *	  in the column list.
 *	  eref->aliasname is required to be present, and should generally be used
 *	  to identify the RTE for error messages etc.
 *
 *	  In RELATION RTEs, the colnames in both alias and eref are indexed by
 *	  physical attribute number; this means there must be colname entries for
 *	  dropped columns.  When building an RTE we insert empty strings ("") for
 *	  dropped columns.  Note however that a stored rule may have nonempty
 *	  colnames for columns dropped since the rule was created (and for that
 *	  matter the colnames might be out of date due to column renamings).
 *	  The same comments apply to FUNCTION RTEs when a function's return type
 *	  is a named composite type.
 *
 *	  In JOIN RTEs, the colnames in both alias and eref are one-to-one with
 *	  joinaliasvars entries.  A JOIN RTE will omit columns of its inputs when
 *	  those columns are known to be dropped at parse time.  Again, however,
 *	  a stored rule might contain entries for columns dropped since the rule
 *	  was created.  (This is only possible for columns not actually referenced
 *	  in the rule.)  When loading a stored rule, we replace the joinaliasvars
 *	  items for any such columns with null pointers.  (We can't simply delete
 *	  them from the joinaliasvars list, because that would affect the attnums
 *	  of Vars referencing the rest of the list.)
 *
 *	  inh is true for relation references that should be expanded to include
 *	  inheritance children, if the rel has any.  This *must* be false for
 *	  RTEs other than RTE_RELATION entries.
 *
 *	  inFromCl marks those range variables that are listed in the FROM clause.
 *	  It's false for RTEs that are added to a query behind the scenes, such
 *	  as the NEW and OLD variables for a rule, or the subqueries of a UNION.
 *	  This flag is not used during parsing (except in transformLockingClause,
 *	  q.v.); the parser now uses a separate "namespace" data structure to
 *	  control visibility.  But it is needed by ruleutils.c to determine
 *	  whether RTEs should be shown in decompiled queries.
 *
 *	  securityQuals is a list of security barrier quals (boolean expressions),
 *	  to be tested in the listed order before returning a row from the
 *	  relation.  It is always NIL in parser output.  Entries are added by the
 *	  rewriter to implement security-barrier views and/or row-level security.
 *	  Note that the planner turns each boolean expression into an implicitly
 *	  AND'ed sublist, as is its usual habit with qualification expressions.
 *--------------------
 */
export enum RTEKind {
  /** ordinary relation reference */
  RTE_RELATION = "RTE_RELATION",
  /** subquery in FROM */
  RTE_SUBQUERY = "RTE_SUBQUERY",
  /** join */
  RTE_JOIN = "RTE_JOIN",
  /** function in FROM */
  RTE_FUNCTION = "RTE_FUNCTION",
  /** TableFunc(.., column list) */
  RTE_TABLEFUNC = "RTE_TABLEFUNC",
  /** VALUES (<exprlist>), (<exprlist>), ... */
  RTE_VALUES = "RTE_VALUES",
  /** common table expr (WITH list element) */
  RTE_CTE = "RTE_CTE",
  /** tuplestore, e.g. for AFTER triggers */
  RTE_NAMEDTUPLESTORE = "RTE_NAMEDTUPLESTORE",
  /** RTE represents an empty FROM clause; such
								 * RTEs are added by the planner, they're not
								 * present during parsing or rewriting */
  RTE_RESULT = "RTE_RESULT",
}

/**
 * WithCheckOption -
 *		representation of WITH CHECK OPTION checks to be applied to new tuples
 *		when inserting/updating an auto-updatable view, or RLS WITH CHECK
 *		policies to be applied when inserting/updating a relation with RLS.
 */
export enum WCOKind {
  /** WCO on an auto-updatable view */
  WCO_VIEW_CHECK = "WCO_VIEW_CHECK",
  /** RLS INSERT WITH CHECK policy */
  WCO_RLS_INSERT_CHECK = "WCO_RLS_INSERT_CHECK",
  /** RLS UPDATE WITH CHECK policy */
  WCO_RLS_UPDATE_CHECK = "WCO_RLS_UPDATE_CHECK",
  /** RLS ON CONFLICT DO UPDATE USING policy */
  WCO_RLS_CONFLICT_CHECK = "WCO_RLS_CONFLICT_CHECK",
  /** RLS MERGE UPDATE USING policy */
  WCO_RLS_MERGE_UPDATE_CHECK = "WCO_RLS_MERGE_UPDATE_CHECK",
  /** RLS MERGE DELETE USING policy */
  WCO_RLS_MERGE_DELETE_CHECK = "WCO_RLS_MERGE_DELETE_CHECK",
}

/**
 * GroupingSet -
 *		representation of CUBE, ROLLUP and GROUPING SETS clauses
 *
 * In a Query with grouping sets, the groupClause contains a flat list of
 * SortGroupClause nodes for each distinct expression used.  The actual
 * structure of the GROUP BY clause is given by the groupingSets tree.
 *
 * In the raw parser output, GroupingSet nodes (of all types except SIMPLE
 * which is not used) are potentially mixed in with the expressions in the
 * groupClause of the SelectStmt.  (An expression can't contain a GroupingSet,
 * but a list may mix GroupingSet and expression nodes.)  At this stage, the
 * content of each node is a list of expressions, some of which may be RowExprs
 * which represent sublists rather than actual row constructors, and nested
 * GroupingSet nodes where legal in the grammar.  The structure directly
 * reflects the query syntax.
 *
 * In parse analysis, the transformed expressions are used to build the tlist
 * and groupClause list (of SortGroupClause nodes), and the groupingSets tree
 * is eventually reduced to a fixed format:
 *
 * EMPTY nodes represent (), and obviously have no content
 *
 * SIMPLE nodes represent a list of one or more expressions to be treated as an
 * atom by the enclosing structure; the content is an integer list of
 * ressortgroupref values (see SortGroupClause)
 *
 * CUBE and ROLLUP nodes contain a list of one or more SIMPLE nodes.
 *
 * SETS nodes contain a list of EMPTY, SIMPLE, CUBE or ROLLUP nodes, but after
 * parse analysis they cannot contain more SETS nodes; enough of the syntactic
 * transforms of the spec have been applied that we no longer have arbitrarily
 * deep nesting (though we still preserve the use of cube/rollup).
 *
 * Note that if the groupingSets tree contains no SIMPLE nodes (only EMPTY
 * nodes at the leaves), then the groupClause will be empty, but this is still
 * an aggregation query (similar to using aggs or HAVING without GROUP BY).
 *
 * As an example, the following clause:
 *
 * GROUP BY GROUPING SETS ((a,b), CUBE(c,(d,e)))
 *
 * looks like this after raw parsing:
 *
 * SETS( RowExpr(a,b) , CUBE( c, RowExpr(d,e) ) )
 *
 * and parse analysis converts it to:
 *
 * SETS( SIMPLE(1,2), CUBE( SIMPLE(3), SIMPLE(4,5) ) )
 */
export enum GroupingSetKind {
  GROUPING_SET_EMPTY = "GROUPING_SET_EMPTY",
  GROUPING_SET_SIMPLE = "GROUPING_SET_SIMPLE",
  GROUPING_SET_ROLLUP = "GROUPING_SET_ROLLUP",
  GROUPING_SET_CUBE = "GROUPING_SET_CUBE",
  GROUPING_SET_SETS = "GROUPING_SET_SETS",
}

/**
 * CommonTableExpr -
 *	   representation of WITH list element
 */
export enum CTEMaterialize {
  /** no option specified */
  CTEMaterializeDefault = "CTEMaterializeDefault",
  /** MATERIALIZED */
  CTEMaterializeAlways = "CTEMaterializeAlways",
  /** NOT MATERIALIZED */
  CTEMaterializeNever = "CTEMaterializeNever",
}

/** ----------------------
 *		Select Statement
 *
 * A "simple" SELECT is represented in the output of gram.y by a single
 * SelectStmt node; so is a VALUES construct.  A query containing set
 * operators (UNION, INTERSECT, EXCEPT) is represented by a tree of SelectStmt
 * nodes, in which the leaf nodes are component SELECTs and the internal nodes
 * represent UNION, INTERSECT, or EXCEPT operators.  Using the same node
 * type for both leaf and internal nodes allows gram.y to stick ORDER BY,
 * LIMIT, etc, clause values into a SELECT statement without worrying
 * whether it is a simple or compound SELECT.
 * ----------------------
 */
export enum SetOperation {
  SETOP_NONE = "SETOP_NONE",
  SETOP_UNION = "SETOP_UNION",
  SETOP_INTERSECT = "SETOP_INTERSECT",
  SETOP_EXCEPT = "SETOP_EXCEPT",
}

/**
 * When a command can act on several kinds of objects with only one
 * parse structure required, use these constants to designate the
 * object type.  Note that commands typically don't support all the types.
 */
export enum ObjectType {
  OBJECT_ACCESS_METHOD = "OBJECT_ACCESS_METHOD",
  OBJECT_AGGREGATE = "OBJECT_AGGREGATE",
  OBJECT_AMOP = "OBJECT_AMOP",
  OBJECT_AMPROC = "OBJECT_AMPROC",
  /** type's attribute, when distinct from column */
  OBJECT_ATTRIBUTE = "OBJECT_ATTRIBUTE",
  OBJECT_CAST = "OBJECT_CAST",
  OBJECT_COLUMN = "OBJECT_COLUMN",
  OBJECT_COLLATION = "OBJECT_COLLATION",
  OBJECT_CONVERSION = "OBJECT_CONVERSION",
  OBJECT_DATABASE = "OBJECT_DATABASE",
  OBJECT_DEFAULT = "OBJECT_DEFAULT",
  OBJECT_DEFACL = "OBJECT_DEFACL",
  OBJECT_DOMAIN = "OBJECT_DOMAIN",
  OBJECT_DOMCONSTRAINT = "OBJECT_DOMCONSTRAINT",
  OBJECT_EVENT_TRIGGER = "OBJECT_EVENT_TRIGGER",
  OBJECT_EXTENSION = "OBJECT_EXTENSION",
  OBJECT_FDW = "OBJECT_FDW",
  OBJECT_FOREIGN_SERVER = "OBJECT_FOREIGN_SERVER",
  OBJECT_FOREIGN_TABLE = "OBJECT_FOREIGN_TABLE",
  OBJECT_FUNCTION = "OBJECT_FUNCTION",
  OBJECT_INDEX = "OBJECT_INDEX",
  OBJECT_LANGUAGE = "OBJECT_LANGUAGE",
  OBJECT_LARGEOBJECT = "OBJECT_LARGEOBJECT",
  OBJECT_MATVIEW = "OBJECT_MATVIEW",
  OBJECT_OPCLASS = "OBJECT_OPCLASS",
  OBJECT_OPERATOR = "OBJECT_OPERATOR",
  OBJECT_OPFAMILY = "OBJECT_OPFAMILY",
  OBJECT_PARAMETER_ACL = "OBJECT_PARAMETER_ACL",
  OBJECT_POLICY = "OBJECT_POLICY",
  OBJECT_PROCEDURE = "OBJECT_PROCEDURE",
  OBJECT_PUBLICATION = "OBJECT_PUBLICATION",
  OBJECT_PUBLICATION_NAMESPACE = "OBJECT_PUBLICATION_NAMESPACE",
  OBJECT_PUBLICATION_REL = "OBJECT_PUBLICATION_REL",
  OBJECT_ROLE = "OBJECT_ROLE",
  OBJECT_ROUTINE = "OBJECT_ROUTINE",
  OBJECT_RULE = "OBJECT_RULE",
  OBJECT_SCHEMA = "OBJECT_SCHEMA",
  OBJECT_SEQUENCE = "OBJECT_SEQUENCE",
  OBJECT_SUBSCRIPTION = "OBJECT_SUBSCRIPTION",
  OBJECT_STATISTIC_EXT = "OBJECT_STATISTIC_EXT",
  OBJECT_TABCONSTRAINT = "OBJECT_TABCONSTRAINT",
  OBJECT_TABLE = "OBJECT_TABLE",
  OBJECT_TABLESPACE = "OBJECT_TABLESPACE",
  OBJECT_TRANSFORM = "OBJECT_TRANSFORM",
  OBJECT_TRIGGER = "OBJECT_TRIGGER",
  OBJECT_TSCONFIGURATION = "OBJECT_TSCONFIGURATION",
  OBJECT_TSDICTIONARY = "OBJECT_TSDICTIONARY",
  OBJECT_TSPARSER = "OBJECT_TSPARSER",
  OBJECT_TSTEMPLATE = "OBJECT_TSTEMPLATE",
  OBJECT_TYPE = "OBJECT_TYPE",
  OBJECT_USER_MAPPING = "OBJECT_USER_MAPPING",
  OBJECT_VIEW = "OBJECT_VIEW",
}

export enum DropBehavior {
  /** drop fails if any dependent objects */
  DROP_RESTRICT = "DROP_RESTRICT",
  /** remove dependent objects too */
  DROP_CASCADE = "DROP_CASCADE",
}

export enum AlterTableType {
  /** add column */
  AT_AddColumn = "AT_AddColumn",
  /** implicitly via CREATE OR REPLACE VIEW */
  AT_AddColumnToView = "AT_AddColumnToView",
  /** alter column default */
  AT_ColumnDefault = "AT_ColumnDefault",
  /** add a pre-cooked column default */
  AT_CookedColumnDefault = "AT_CookedColumnDefault",
  /** alter column drop not null */
  AT_DropNotNull = "AT_DropNotNull",
  /** alter column set not null */
  AT_SetNotNull = "AT_SetNotNull",
  /** alter column drop expression */
  AT_DropExpression = "AT_DropExpression",
  /** check column is already marked not null */
  AT_CheckNotNull = "AT_CheckNotNull",
  /** alter column set statistics */
  AT_SetStatistics = "AT_SetStatistics",
  /** alter column set ( options ) */
  AT_SetOptions = "AT_SetOptions",
  /** alter column reset ( options ) */
  AT_ResetOptions = "AT_ResetOptions",
  /** alter column set storage */
  AT_SetStorage = "AT_SetStorage",
  /** alter column set compression */
  AT_SetCompression = "AT_SetCompression",
  /** drop column */
  AT_DropColumn = "AT_DropColumn",
  /** add index */
  AT_AddIndex = "AT_AddIndex",
  /** internal to commands/tablecmds.c */
  AT_ReAddIndex = "AT_ReAddIndex",
  /** add constraint */
  AT_AddConstraint = "AT_AddConstraint",
  /** internal to commands/tablecmds.c */
  AT_ReAddConstraint = "AT_ReAddConstraint",
  /** internal to commands/tablecmds.c */
  AT_ReAddDomainConstraint = "AT_ReAddDomainConstraint",
  /** alter constraint */
  AT_AlterConstraint = "AT_AlterConstraint",
  /** validate constraint */
  AT_ValidateConstraint = "AT_ValidateConstraint",
  /** add constraint using existing index */
  AT_AddIndexConstraint = "AT_AddIndexConstraint",
  /** drop constraint */
  AT_DropConstraint = "AT_DropConstraint",
  /** internal to commands/tablecmds.c */
  AT_ReAddComment = "AT_ReAddComment",
  /** alter column type */
  AT_AlterColumnType = "AT_AlterColumnType",
  /** alter column OPTIONS (...) */
  AT_AlterColumnGenericOptions = "AT_AlterColumnGenericOptions",
  /** change owner */
  AT_ChangeOwner = "AT_ChangeOwner",
  /** CLUSTER ON */
  AT_ClusterOn = "AT_ClusterOn",
  /** SET WITHOUT CLUSTER */
  AT_DropCluster = "AT_DropCluster",
  /** SET LOGGED */
  AT_SetLogged = "AT_SetLogged",
  /** SET UNLOGGED */
  AT_SetUnLogged = "AT_SetUnLogged",
  /** SET WITHOUT OIDS */
  AT_DropOids = "AT_DropOids",
  /** SET ACCESS METHOD */
  AT_SetAccessMethod = "AT_SetAccessMethod",
  /** SET TABLESPACE */
  AT_SetTableSpace = "AT_SetTableSpace",
  /** SET (...) -- AM specific parameters */
  AT_SetRelOptions = "AT_SetRelOptions",
  /** RESET (...) -- AM specific parameters */
  AT_ResetRelOptions = "AT_ResetRelOptions",
  /** replace reloption list in its entirety */
  AT_ReplaceRelOptions = "AT_ReplaceRelOptions",
  /** ENABLE TRIGGER name */
  AT_EnableTrig = "AT_EnableTrig",
  /** ENABLE ALWAYS TRIGGER name */
  AT_EnableAlwaysTrig = "AT_EnableAlwaysTrig",
  /** ENABLE REPLICA TRIGGER name */
  AT_EnableReplicaTrig = "AT_EnableReplicaTrig",
  /** DISABLE TRIGGER name */
  AT_DisableTrig = "AT_DisableTrig",
  /** ENABLE TRIGGER ALL */
  AT_EnableTrigAll = "AT_EnableTrigAll",
  /** DISABLE TRIGGER ALL */
  AT_DisableTrigAll = "AT_DisableTrigAll",
  /** ENABLE TRIGGER USER */
  AT_EnableTrigUser = "AT_EnableTrigUser",
  /** DISABLE TRIGGER USER */
  AT_DisableTrigUser = "AT_DisableTrigUser",
  /** ENABLE RULE name */
  AT_EnableRule = "AT_EnableRule",
  /** ENABLE ALWAYS RULE name */
  AT_EnableAlwaysRule = "AT_EnableAlwaysRule",
  /** ENABLE REPLICA RULE name */
  AT_EnableReplicaRule = "AT_EnableReplicaRule",
  /** DISABLE RULE name */
  AT_DisableRule = "AT_DisableRule",
  /** INHERIT parent */
  AT_AddInherit = "AT_AddInherit",
  /** NO INHERIT parent */
  AT_DropInherit = "AT_DropInherit",
  /** OF <type_name> */
  AT_AddOf = "AT_AddOf",
  /** NOT OF */
  AT_DropOf = "AT_DropOf",
  /** REPLICA IDENTITY */
  AT_ReplicaIdentity = "AT_ReplicaIdentity",
  /** ENABLE ROW SECURITY */
  AT_EnableRowSecurity = "AT_EnableRowSecurity",
  /** DISABLE ROW SECURITY */
  AT_DisableRowSecurity = "AT_DisableRowSecurity",
  /** FORCE ROW SECURITY */
  AT_ForceRowSecurity = "AT_ForceRowSecurity",
  /** NO FORCE ROW SECURITY */
  AT_NoForceRowSecurity = "AT_NoForceRowSecurity",
  /** OPTIONS (...) */
  AT_GenericOptions = "AT_GenericOptions",
  /** ATTACH PARTITION */
  AT_AttachPartition = "AT_AttachPartition",
  /** DETACH PARTITION */
  AT_DetachPartition = "AT_DetachPartition",
  /** DETACH PARTITION FINALIZE */
  AT_DetachPartitionFinalize = "AT_DetachPartitionFinalize",
  /** ADD IDENTITY */
  AT_AddIdentity = "AT_AddIdentity",
  /** SET identity column options */
  AT_SetIdentity = "AT_SetIdentity",
  /** DROP IDENTITY */
  AT_DropIdentity = "AT_DropIdentity",
  /** internal to commands/tablecmds.c */
  AT_ReAddStatistics = "AT_ReAddStatistics",
}

/** ----------------------
 *		Grant|Revoke Statement
 * ----------------------
 */
export enum GrantTargetType {
  /** grant on specific named object(s) */
  ACL_TARGET_OBJECT = "ACL_TARGET_OBJECT",
  /** grant on all objects in given schema(s) */
  ACL_TARGET_ALL_IN_SCHEMA = "ACL_TARGET_ALL_IN_SCHEMA",
  /** ALTER DEFAULT PRIVILEGES */
  ACL_TARGET_DEFAULTS = "ACL_TARGET_DEFAULTS",
}

/** ----------------------
 * SET Statement (includes RESET)
 *
 * "SET var TO DEFAULT" and "RESET var" are semantically equivalent, but we
 * preserve the distinction in VariableSetKind for CreateCommandTag().
 * ----------------------
 */
export enum VariableSetKind {
  /** SET var = value */
  VAR_SET_VALUE = "VAR_SET_VALUE",
  /** SET var TO DEFAULT */
  VAR_SET_DEFAULT = "VAR_SET_DEFAULT",
  /** SET var FROM CURRENT */
  VAR_SET_CURRENT = "VAR_SET_CURRENT",
  /** special case for SET TRANSACTION ... */
  VAR_SET_MULTI = "VAR_SET_MULTI",
  /** RESET var */
  VAR_RESET = "VAR_RESET",
  /** RESET ALL */
  VAR_RESET_ALL = "VAR_RESET_ALL",
}

/** ----------
 * Definitions for constraints in CreateStmt
 *
 * Note that column defaults are treated as a type of constraint,
 * even though that's a bit odd semantically.
 *
 * For constraints that use expressions (CONSTR_CHECK, CONSTR_DEFAULT)
 * we may have the expression in either "raw" form (an untransformed
 * parse tree) or "cooked" form (the nodeToString representation of
 * an executable expression tree), depending on how this Constraint
 * node was created (by parsing, or by inheritance from an existing
 * relation).  We should never have both in the same node!
 *
 * FKCONSTR_ACTION_xxx values are stored into pg_constraint.confupdtype
 * and pg_constraint.confdeltype columns; FKCONSTR_MATCH_xxx values are
 * stored into pg_constraint.confmatchtype.  Changing the code values may
 * require an initdb!
 *
 * If skip_validation is true then we skip checking that the existing rows
 * in the table satisfy the constraint, and just install the catalog entries
 * for the constraint.  A new FK constraint is marked as valid iff
 * initially_valid is true.  (Usually skip_validation and initially_valid
 * are inverses, but we can set both true if the table is known empty.)
 *
 * Constraint attributes (DEFERRABLE etc) are initially represented as
 * separate Constraint nodes for simplicity of parsing.  parse_utilcmd.c makes
 * a pass through the constraints list to insert the info into the appropriate
 * Constraint node.
 * ----------
 */
export enum ConstrType {
  /** not standard SQL, but a lot of people
								 * expect it */
  CONSTR_NULL = "CONSTR_NULL",
  CONSTR_NOTNULL = "CONSTR_NOTNULL",
  CONSTR_DEFAULT = "CONSTR_DEFAULT",
  CONSTR_IDENTITY = "CONSTR_IDENTITY",
  CONSTR_GENERATED = "CONSTR_GENERATED",
  CONSTR_CHECK = "CONSTR_CHECK",
  CONSTR_PRIMARY = "CONSTR_PRIMARY",
  CONSTR_UNIQUE = "CONSTR_UNIQUE",
  CONSTR_EXCLUSION = "CONSTR_EXCLUSION",
  CONSTR_FOREIGN = "CONSTR_FOREIGN",
  /** attributes for previous constraint node */
  CONSTR_ATTR_DEFERRABLE = "CONSTR_ATTR_DEFERRABLE",
  CONSTR_ATTR_NOT_DEFERRABLE = "CONSTR_ATTR_NOT_DEFERRABLE",
  CONSTR_ATTR_DEFERRED = "CONSTR_ATTR_DEFERRED",
  CONSTR_ATTR_IMMEDIATE = "CONSTR_ATTR_IMMEDIATE",
}

/** ----------------------
 *		Import Foreign Schema Statement
 * ----------------------
 */
export enum ImportForeignSchemaType {
  /** all relations wanted */
  FDW_IMPORT_SCHEMA_ALL = "FDW_IMPORT_SCHEMA_ALL",
  /** include only listed tables in import */
  FDW_IMPORT_SCHEMA_LIMIT_TO = "FDW_IMPORT_SCHEMA_LIMIT_TO",
  /** exclude listed tables from import */
  FDW_IMPORT_SCHEMA_EXCEPT = "FDW_IMPORT_SCHEMA_EXCEPT",
}

/** ----------------------
 *	Create/Alter/Drop Role Statements
 *
 * Note: these node types are also used for the backwards-compatible
 * Create/Alter/Drop User/Group statements.  In the ALTER and DROP cases
 * there's really no need to distinguish what the original spelling was,
 * but for CREATE we mark the type because the defaults vary.
 * ----------------------
 */
export enum RoleStmtType {
  ROLESTMT_ROLE = "ROLESTMT_ROLE",
  ROLESTMT_USER = "ROLESTMT_USER",
  ROLESTMT_GROUP = "ROLESTMT_GROUP",
}

/** ----------------------
 *		Fetch Statement (also Move)
 * ----------------------
 */
export enum FetchDirection {
  /** for these, howMany is how many rows to fetch; FETCH_ALL means ALL */
  FETCH_FORWARD = "FETCH_FORWARD",
  FETCH_BACKWARD = "FETCH_BACKWARD",
  /** for these, howMany indicates a position; only one row is fetched */
  FETCH_ABSOLUTE = "FETCH_ABSOLUTE",
  FETCH_RELATIVE = "FETCH_RELATIVE",
}

export enum FunctionParameterMode {
  /** the assigned enum values appear in pg_proc, don't change 'em! */
  /** input only */
  FUNC_PARAM_IN = "FUNC_PARAM_IN",
  /** output only */
  FUNC_PARAM_OUT = "FUNC_PARAM_OUT",
  /** both */
  FUNC_PARAM_INOUT = "FUNC_PARAM_INOUT",
  /** variadic (always input) */
  FUNC_PARAM_VARIADIC = "FUNC_PARAM_VARIADIC",
  /** table function output column */
  FUNC_PARAM_TABLE = "FUNC_PARAM_TABLE",
  /** this is not used in pg_proc: */
  /** default; effectively same as IN */
  FUNC_PARAM_DEFAULT = "FUNC_PARAM_DEFAULT",
}

/** ----------------------
 *		{Begin|Commit|Rollback} Transaction Statement
 * ----------------------
 */
export enum TransactionStmtKind {
  TRANS_STMT_BEGIN = "TRANS_STMT_BEGIN",
  /** semantically identical to BEGIN */
  TRANS_STMT_START = "TRANS_STMT_START",
  TRANS_STMT_COMMIT = "TRANS_STMT_COMMIT",
  TRANS_STMT_ROLLBACK = "TRANS_STMT_ROLLBACK",
  TRANS_STMT_SAVEPOINT = "TRANS_STMT_SAVEPOINT",
  TRANS_STMT_RELEASE = "TRANS_STMT_RELEASE",
  TRANS_STMT_ROLLBACK_TO = "TRANS_STMT_ROLLBACK_TO",
  TRANS_STMT_PREPARE = "TRANS_STMT_PREPARE",
  TRANS_STMT_COMMIT_PREPARED = "TRANS_STMT_COMMIT_PREPARED",
  TRANS_STMT_ROLLBACK_PREPARED = "TRANS_STMT_ROLLBACK_PREPARED",
}

/** ----------------------
 *		Create View Statement
 * ----------------------
 */
export enum ViewCheckOption {
  NO_CHECK_OPTION = "NO_CHECK_OPTION",
  LOCAL_CHECK_OPTION = "LOCAL_CHECK_OPTION",
  CASCADED_CHECK_OPTION = "CASCADED_CHECK_OPTION",
}

/** ----------------------
 * Discard Statement
 * ----------------------
 */
export enum DiscardMode {
  DISCARD_ALL = "DISCARD_ALL",
  DISCARD_PLANS = "DISCARD_PLANS",
  DISCARD_SEQUENCES = "DISCARD_SEQUENCES",
  DISCARD_TEMP = "DISCARD_TEMP",
}

/** ----------------------
 *		REINDEX Statement
 * ----------------------
 */
export enum ReindexObjectType {
  /** index */
  REINDEX_OBJECT_INDEX = "REINDEX_OBJECT_INDEX",
  /** table or materialized view */
  REINDEX_OBJECT_TABLE = "REINDEX_OBJECT_TABLE",
  /** schema */
  REINDEX_OBJECT_SCHEMA = "REINDEX_OBJECT_SCHEMA",
  /** system catalogs */
  REINDEX_OBJECT_SYSTEM = "REINDEX_OBJECT_SYSTEM",
  /** database */
  REINDEX_OBJECT_DATABASE = "REINDEX_OBJECT_DATABASE",
}

/**
 * TS Configuration stmts: DefineStmt, RenameStmt and DropStmt are default
 */
export enum AlterTSConfigType {
  ALTER_TSCONFIG_ADD_MAPPING = "ALTER_TSCONFIG_ADD_MAPPING",
  ALTER_TSCONFIG_ALTER_MAPPING_FOR_TOKEN = "ALTER_TSCONFIG_ALTER_MAPPING_FOR_TOKEN",
  ALTER_TSCONFIG_REPLACE_DICT = "ALTER_TSCONFIG_REPLACE_DICT",
  ALTER_TSCONFIG_REPLACE_DICT_FOR_TOKEN = "ALTER_TSCONFIG_REPLACE_DICT_FOR_TOKEN",
  ALTER_TSCONFIG_DROP_MAPPING = "ALTER_TSCONFIG_DROP_MAPPING",
}

/**
 * Publication object type
 */
export enum PublicationObjSpecType {
  /** A table */
  PUBLICATIONOBJ_TABLE = "PUBLICATIONOBJ_TABLE",
  /** All tables in schema */
  PUBLICATIONOBJ_TABLES_IN_SCHEMA = "PUBLICATIONOBJ_TABLES_IN_SCHEMA",
  /** All tables in first element of
											 * search_path */
  PUBLICATIONOBJ_TABLES_IN_CUR_SCHEMA = "PUBLICATIONOBJ_TABLES_IN_CUR_SCHEMA",
  /** Continuation of previous type */
  PUBLICATIONOBJ_CONTINUATION = "PUBLICATIONOBJ_CONTINUATION",
}

export enum AlterPublicationAction {
  /** add objects to publication */
  AP_AddObjects = "AP_AddObjects",
  /** remove objects from publication */
  AP_DropObjects = "AP_DropObjects",
  /** set list of objects */
  AP_SetObjects = "AP_SetObjects",
}

export enum AlterSubscriptionType {
  ALTER_SUBSCRIPTION_OPTIONS = "ALTER_SUBSCRIPTION_OPTIONS",
  ALTER_SUBSCRIPTION_CONNECTION = "ALTER_SUBSCRIPTION_CONNECTION",
  ALTER_SUBSCRIPTION_SET_PUBLICATION = "ALTER_SUBSCRIPTION_SET_PUBLICATION",
  ALTER_SUBSCRIPTION_ADD_PUBLICATION = "ALTER_SUBSCRIPTION_ADD_PUBLICATION",
  ALTER_SUBSCRIPTION_DROP_PUBLICATION = "ALTER_SUBSCRIPTION_DROP_PUBLICATION",
  ALTER_SUBSCRIPTION_REFRESH = "ALTER_SUBSCRIPTION_REFRESH",
  ALTER_SUBSCRIPTION_ENABLED = "ALTER_SUBSCRIPTION_ENABLED",
  ALTER_SUBSCRIPTION_SKIP = "ALTER_SUBSCRIPTION_SKIP",
}

export enum OnCommitAction {
  /** No ON COMMIT clause (do nothing) */
  ONCOMMIT_NOOP = "ONCOMMIT_NOOP",
  /** ON COMMIT PRESERVE ROWS (do nothing) */
  ONCOMMIT_PRESERVE_ROWS = "ONCOMMIT_PRESERVE_ROWS",
  /** ON COMMIT DELETE ROWS */
  ONCOMMIT_DELETE_ROWS = "ONCOMMIT_DELETE_ROWS",
  /** ON COMMIT DROP */
  ONCOMMIT_DROP = "ONCOMMIT_DROP",
}

/**
 * Param
 *
 *		paramkind specifies the kind of parameter. The possible values
 *		for this field are:
 *
 *		PARAM_EXTERN:  The parameter value is supplied from outside the plan.
 *				Such parameters are numbered from 1 to n.
 *
 *		PARAM_EXEC:  The parameter is an internal executor parameter, used
 *				for passing values into and out of sub-queries or from
 *				nestloop joins to their inner scans.
 *				For historical reasons, such parameters are numbered from 0.
 *				These numbers are independent of PARAM_EXTERN numbers.
 *
 *		PARAM_SUBLINK:	The parameter represents an output column of a SubLink
 *				node's sub-select.  The column number is contained in the
 *				`paramid' field.  (This type of Param is converted to
 *				PARAM_EXEC during planning.)
 *
 *		PARAM_MULTIEXPR:  Like PARAM_SUBLINK, the parameter represents an
 *				output column of a SubLink node's sub-select, but here, the
 *				SubLink is always a MULTIEXPR SubLink.  The high-order 16 bits
 *				of the `paramid' field contain the SubLink's subLinkId, and
 *				the low-order 16 bits contain the column number.  (This type
 *				of Param is also converted to PARAM_EXEC during planning.)
 */
export enum ParamKind {
  PARAM_EXTERN = "PARAM_EXTERN",
  PARAM_EXEC = "PARAM_EXEC",
  PARAM_SUBLINK = "PARAM_SUBLINK",
  PARAM_MULTIEXPR = "PARAM_MULTIEXPR",
}

/**
 * CoercionContext - distinguishes the allowed set of type casts
 *
 * NB: ordering of the alternatives is significant; later (larger) values
 * allow more casts than earlier ones.
 */
export enum CoercionContext {
  /** coercion in context of expression */
  COERCION_IMPLICIT = "COERCION_IMPLICIT",
  /** coercion in context of assignment */
  COERCION_ASSIGNMENT = "COERCION_ASSIGNMENT",
  /** if no assignment cast, use CoerceViaIO */
  COERCION_PLPGSQL = "COERCION_PLPGSQL",
  /** explicit cast operation */
  COERCION_EXPLICIT = "COERCION_EXPLICIT",
}

/**
 * CoercionForm - how to display a FuncExpr or related node
 *
 * "Coercion" is a bit of a misnomer, since this value records other
 * special syntaxes besides casts, but for now we'll keep this naming.
 *
 * NB: equal() ignores CoercionForm fields, therefore this *must* not carry
 * any semantically significant information.  We need that behavior so that
 * the planner will consider equivalent implicit and explicit casts to be
 * equivalent.  In cases where those actually behave differently, the coercion
 * function's arguments will be different.
 */
export enum CoercionForm {
  /** display as a function call */
  COERCE_EXPLICIT_CALL = "COERCE_EXPLICIT_CALL",
  /** display as an explicit cast */
  COERCE_EXPLICIT_CAST = "COERCE_EXPLICIT_CAST",
  /** implicit cast, so hide it */
  COERCE_IMPLICIT_CAST = "COERCE_IMPLICIT_CAST",
  /** display with SQL-mandated special syntax */
  COERCE_SQL_SYNTAX = "COERCE_SQL_SYNTAX",
}

/**
 * BoolExpr - expression node for the basic Boolean operators AND, OR, NOT
 *
 * Notice the arguments are given as a List.  For NOT, of course the list
 * must always have exactly one element.  For AND and OR, there can be two
 * or more arguments.
 */
export enum BoolExprType {
  AND_EXPR = "AND_EXPR",
  OR_EXPR = "OR_EXPR",
  NOT_EXPR = "NOT_EXPR",
}

/**
 * SubLink
 *
 * A SubLink represents a subselect appearing in an expression, and in some
 * cases also the combining operator(s) just above it.  The subLinkType
 * indicates the form of the expression represented:
 *	EXISTS_SUBLINK		EXISTS(SELECT ...)
 *	ALL_SUBLINK			(lefthand) op ALL (SELECT ...)
 *	ANY_SUBLINK			(lefthand) op ANY (SELECT ...)
 *	ROWCOMPARE_SUBLINK	(lefthand) op (SELECT ...)
 *	EXPR_SUBLINK		(SELECT with single targetlist item ...)
 *	MULTIEXPR_SUBLINK	(SELECT with multiple targetlist items ...)
 *	ARRAY_SUBLINK		ARRAY(SELECT with single targetlist item ...)
 *	CTE_SUBLINK			WITH query (never actually part of an expression)
 * For ALL, ANY, and ROWCOMPARE, the lefthand is a list of expressions of the
 * same length as the subselect's targetlist.  ROWCOMPARE will *always* have
 * a list with more than one entry; if the subselect has just one target
 * then the parser will create an EXPR_SUBLINK instead (and any operator
 * above the subselect will be represented separately).
 * ROWCOMPARE, EXPR, and MULTIEXPR require the subselect to deliver at most
 * one row (if it returns no rows, the result is NULL).
 * ALL, ANY, and ROWCOMPARE require the combining operators to deliver boolean
 * results.  ALL and ANY combine the per-row results using AND and OR
 * semantics respectively.
 * ARRAY requires just one target column, and creates an array of the target
 * column's type using any number of rows resulting from the subselect.
 *
 * SubLink is classed as an Expr node, but it is not actually executable;
 * it must be replaced in the expression tree by a SubPlan node during
 * planning.
 *
 * NOTE: in the raw output of gram.y, testexpr contains just the raw form
 * of the lefthand expression (if any), and operName is the String name of
 * the combining operator.  Also, subselect is a raw parsetree.  During parse
 * analysis, the parser transforms testexpr into a complete boolean expression
 * that compares the lefthand value(s) to PARAM_SUBLINK nodes representing the
 * output columns of the subselect.  And subselect is transformed to a Query.
 * This is the representation seen in saved rules and in the rewriter.
 *
 * In EXISTS, EXPR, MULTIEXPR, and ARRAY SubLinks, testexpr and operName
 * are unused and are always null.
 *
 * subLinkId is currently used only for MULTIEXPR SubLinks, and is zero in
 * other SubLinks.  This number identifies different multiple-assignment
 * subqueries within an UPDATE statement's SET list.  It is unique only
 * within a particular targetlist.  The output column(s) of the MULTIEXPR
 * are referenced by PARAM_MULTIEXPR Params appearing elsewhere in the tlist.
 *
 * The CTE_SUBLINK case never occurs in actual SubLink nodes, but it is used
 * in SubPlans generated for WITH subqueries.
 */
export enum SubLinkType {
  EXISTS_SUBLINK = "EXISTS_SUBLINK",
  ALL_SUBLINK = "ALL_SUBLINK",
  ANY_SUBLINK = "ANY_SUBLINK",
  ROWCOMPARE_SUBLINK = "ROWCOMPARE_SUBLINK",
  EXPR_SUBLINK = "EXPR_SUBLINK",
  MULTIEXPR_SUBLINK = "MULTIEXPR_SUBLINK",
  ARRAY_SUBLINK = "ARRAY_SUBLINK",
  /** for SubPlans only */
  CTE_SUBLINK = "CTE_SUBLINK",
}

/**
 * RowCompareExpr - row-wise comparison, such as (a, b) <= (1, 2)
 *
 * We support row comparison for any operator that can be determined to
 * act like =, <>, <, <=, >, or >= (we determine this by looking for the
 * operator in btree opfamilies).  Note that the same operator name might
 * map to a different operator for each pair of row elements, since the
 * element datatypes can vary.
 *
 * A RowCompareExpr node is only generated for the < <= > >= cases;
 * the = and <> cases are translated to simple AND or OR combinations
 * of the pairwise comparisons.  However, we include = and <> in the
 * RowCompareType enum for the convenience of parser logic.
 */
export enum RowCompareType {
  /** Values of this enum are chosen to match btree strategy numbers */
  /** BTLessStrategyNumber */
  ROWCOMPARE_LT = "ROWCOMPARE_LT",
  /** BTLessEqualStrategyNumber */
  ROWCOMPARE_LE = "ROWCOMPARE_LE",
  /** BTEqualStrategyNumber */
  ROWCOMPARE_EQ = "ROWCOMPARE_EQ",
  /** BTGreaterEqualStrategyNumber */
  ROWCOMPARE_GE = "ROWCOMPARE_GE",
  /** BTGreaterStrategyNumber */
  ROWCOMPARE_GT = "ROWCOMPARE_GT",
  /** no such btree strategy */
  ROWCOMPARE_NE = "ROWCOMPARE_NE",
}

/**
 * MinMaxExpr - a GREATEST or LEAST function
 */
export enum MinMaxOp {
  IS_GREATEST = "IS_GREATEST",
  IS_LEAST = "IS_LEAST",
}

/**
 * SQLValueFunction - parameterless functions with special grammar productions
 *
 * The SQL standard categorizes some of these as <datetime value function>
 * and others as <general value specification>.  We call 'em SQLValueFunctions
 * for lack of a better term.  We store type and typmod of the result so that
 * some code doesn't need to know each function individually, and because
 * we would need to store typmod anyway for some of the datetime functions.
 * Note that currently, all variants return non-collating datatypes, so we do
 * not need a collation field; also, all these functions are stable.
 */
export enum SQLValueFunctionOp {
  SVFOP_CURRENT_DATE = "SVFOP_CURRENT_DATE",
  SVFOP_CURRENT_TIME = "SVFOP_CURRENT_TIME",
  SVFOP_CURRENT_TIME_N = "SVFOP_CURRENT_TIME_N",
  SVFOP_CURRENT_TIMESTAMP = "SVFOP_CURRENT_TIMESTAMP",
  SVFOP_CURRENT_TIMESTAMP_N = "SVFOP_CURRENT_TIMESTAMP_N",
  SVFOP_LOCALTIME = "SVFOP_LOCALTIME",
  SVFOP_LOCALTIME_N = "SVFOP_LOCALTIME_N",
  SVFOP_LOCALTIMESTAMP = "SVFOP_LOCALTIMESTAMP",
  SVFOP_LOCALTIMESTAMP_N = "SVFOP_LOCALTIMESTAMP_N",
  SVFOP_CURRENT_ROLE = "SVFOP_CURRENT_ROLE",
  SVFOP_CURRENT_USER = "SVFOP_CURRENT_USER",
  SVFOP_USER = "SVFOP_USER",
  SVFOP_SESSION_USER = "SVFOP_SESSION_USER",
  SVFOP_CURRENT_CATALOG = "SVFOP_CURRENT_CATALOG",
  SVFOP_CURRENT_SCHEMA = "SVFOP_CURRENT_SCHEMA",
}

/**
 * XmlExpr - various SQL/XML functions requiring special grammar productions
 *
 * 'name' carries the "NAME foo" argument (already XML-escaped).
 * 'named_args' and 'arg_names' represent an xml_attribute list.
 * 'args' carries all other arguments.
 *
 * Note: result type/typmod/collation are not stored, but can be deduced
 * from the XmlExprOp.  The type/typmod fields are just used for display
 * purposes, and are NOT necessarily the true result type of the node.
 */
export enum XmlExprOp {
  /** XMLCONCAT(args) */
  IS_XMLCONCAT = "IS_XMLCONCAT",
  /** XMLELEMENT(name, xml_attributes, args) */
  IS_XMLELEMENT = "IS_XMLELEMENT",
  /** XMLFOREST(xml_attributes) */
  IS_XMLFOREST = "IS_XMLFOREST",
  /** XMLPARSE(text, is_doc, preserve_ws) */
  IS_XMLPARSE = "IS_XMLPARSE",
  /** XMLPI(name [, args]) */
  IS_XMLPI = "IS_XMLPI",
  /** XMLROOT(xml, version, standalone) */
  IS_XMLROOT = "IS_XMLROOT",
  /** XMLSERIALIZE(is_document, xmlval, indent) */
  IS_XMLSERIALIZE = "IS_XMLSERIALIZE",
  /** xmlval IS DOCUMENT */
  IS_DOCUMENT = "IS_DOCUMENT",
}

export enum XmlOptionType {
  XMLOPTION_DOCUMENT = "XMLOPTION_DOCUMENT",
  XMLOPTION_CONTENT = "XMLOPTION_CONTENT",
}

/**
 * JsonEncoding -
 *		representation of JSON ENCODING clause
 */
export enum JsonEncoding {
  /** unspecified */
  JS_ENC_DEFAULT = "JS_ENC_DEFAULT",
  JS_ENC_UTF8 = "JS_ENC_UTF8",
  JS_ENC_UTF16 = "JS_ENC_UTF16",
  JS_ENC_UTF32 = "JS_ENC_UTF32",
}

/**
 * JsonFormatType -
 *		enumeration of JSON formats used in JSON FORMAT clause
 */
export enum JsonFormatType {
  /** unspecified */
  JS_FORMAT_DEFAULT = "JS_FORMAT_DEFAULT",
  /** FORMAT JSON [ENCODING ...] */
  JS_FORMAT_JSON = "JS_FORMAT_JSON",
  /** implicit internal format for RETURNING
								 * jsonb */
  JS_FORMAT_JSONB = "JS_FORMAT_JSONB",
}

export enum JsonConstructorType {
  JSCTOR_JSON_OBJECT = "JSCTOR_JSON_OBJECT",
  JSCTOR_JSON_ARRAY = "JSCTOR_JSON_ARRAY",
  JSCTOR_JSON_OBJECTAGG = "JSCTOR_JSON_OBJECTAGG",
  JSCTOR_JSON_ARRAYAGG = "JSCTOR_JSON_ARRAYAGG",
}

/**
 * JsonValueType -
 *		representation of JSON item type in IS JSON predicate
 */
export enum JsonValueType {
  /** IS JSON [VALUE] */
  JS_TYPE_ANY = "JS_TYPE_ANY",
  /** IS JSON OBJECT */
  JS_TYPE_OBJECT = "JS_TYPE_OBJECT",
  /** IS JSON ARRAY */
  JS_TYPE_ARRAY = "JS_TYPE_ARRAY",
  /** IS JSON SCALAR */
  JS_TYPE_SCALAR = "JS_TYPE_SCALAR",
}

/** ----------------
 * NullTest
 *
 * NullTest represents the operation of testing a value for NULLness.
 * The appropriate test is performed and returned as a boolean Datum.
 *
 * When argisrow is false, this simply represents a test for the null value.
 *
 * When argisrow is true, the input expression must yield a rowtype, and
 * the node implements "row IS [NOT] NULL" per the SQL standard.  This
 * includes checking individual fields for NULLness when the row datum
 * itself isn't NULL.
 *
 * NOTE: the combination of a rowtype input and argisrow==false does NOT
 * correspond to the SQL notation "row IS [NOT] NULL"; instead, this case
 * represents the SQL notation "row IS [NOT] DISTINCT FROM NULL".
 * ----------------
 */
export enum NullTestType {
  IS_NULL = "IS_NULL",
  IS_NOT_NULL = "IS_NOT_NULL",
}

/**
 * BooleanTest
 *
 * BooleanTest represents the operation of determining whether a boolean
 * is TRUE, FALSE, or UNKNOWN (ie, NULL).  All six meaningful combinations
 * are supported.  Note that a NULL input does *not* cause a NULL result.
 * The appropriate test is performed and returned as a boolean Datum.
 */
export enum BoolTestType {
  IS_TRUE = "IS_TRUE",
  IS_NOT_TRUE = "IS_NOT_TRUE",
  IS_FALSE = "IS_FALSE",
  IS_NOT_FALSE = "IS_NOT_FALSE",
  IS_UNKNOWN = "IS_UNKNOWN",
  IS_NOT_UNKNOWN = "IS_NOT_UNKNOWN",
}

export enum LockClauseStrength {
  /** no such clause - only used in PlanRowMark */
  LCS_NONE = "LCS_NONE",
  /** FOR KEY SHARE */
  LCS_FORKEYSHARE = "LCS_FORKEYSHARE",
  /** FOR SHARE */
  LCS_FORSHARE = "LCS_FORSHARE",
  /** FOR NO KEY UPDATE */
  LCS_FORNOKEYUPDATE = "LCS_FORNOKEYUPDATE",
  /** FOR UPDATE */
  LCS_FORUPDATE = "LCS_FORUPDATE",
}

/**
 * This enum controls how to deal with rows being locked by FOR UPDATE/SHARE
 * clauses (i.e., it represents the NOWAIT and SKIP LOCKED options).
 * The ordering here is important, because the highest numerical value takes
 * precedence when a RTE is specified multiple ways.  See applyLockingClause.
 */
export enum LockWaitPolicy {
  /** Wait for the lock to become available (default behavior) */
  LockWaitBlock = "LockWaitBlock",
  /** Skip rows that can't be locked (SKIP LOCKED) */
  LockWaitSkip = "LockWaitSkip",
  /** Raise an error if a row cannot be locked (NOWAIT) */
  LockWaitError = "LockWaitError",
}

/**
 * Possible lock modes for a tuple.
 */
export enum LockTupleMode {
  /** SELECT FOR KEY SHARE */
  LockTupleKeyShare = "LockTupleKeyShare",
  /** SELECT FOR SHARE */
  LockTupleShare = "LockTupleShare",
  /** SELECT FOR NO KEY UPDATE, and UPDATEs that don't modify key columns */
  LockTupleNoKeyExclusive = "LockTupleNoKeyExclusive",
  /** SELECT FOR UPDATE, UPDATEs that modify key columns, and DELETE */
  LockTupleExclusive = "LockTupleExclusive",
}

/**
 * CmdType -
 *	  enums for type of operation represented by a Query or PlannedStmt
 *
 * This is needed in both parsenodes.h and plannodes.h, so put it here...
 */
export enum CmdType {
  CMD_UNKNOWN = "CMD_UNKNOWN",
  /** select stmt */
  CMD_SELECT = "CMD_SELECT",
  /** update stmt */
  CMD_UPDATE = "CMD_UPDATE",
  /** insert stmt */
  CMD_INSERT = "CMD_INSERT",
  /** delete stmt */
  CMD_DELETE = "CMD_DELETE",
  /** merge stmt */
  CMD_MERGE = "CMD_MERGE",
  /** cmds like create, destroy, copy, vacuum,
								 * etc. */
  CMD_UTILITY = "CMD_UTILITY",
  /** dummy command for instead nothing rules
								 * with qual */
  CMD_NOTHING = "CMD_NOTHING",
}

/**
 * JoinType -
 *	  enums for types of relation joins
 *
 * JoinType determines the exact semantics of joining two relations using
 * a matching qualification.  For example, it tells what to do with a tuple
 * that has no match in the other relation.
 *
 * This is needed in both parsenodes.h and plannodes.h, so put it here...
 */
export enum JoinType {
  /**
	 * The canonical kinds of joins according to the SQL JOIN syntax. Only
	 * these codes can appear in parser output (e.g., JoinExpr nodes).
	 */
  /** matching tuple pairs only */
  JOIN_INNER = "JOIN_INNER",
  /** pairs + unmatched LHS tuples */
  JOIN_LEFT = "JOIN_LEFT",
  /** pairs + unmatched LHS + unmatched RHS */
  JOIN_FULL = "JOIN_FULL",
  /** pairs + unmatched RHS tuples */
  JOIN_RIGHT = "JOIN_RIGHT",
  /**
	 * Semijoins and anti-semijoins (as defined in relational theory) do not
	 * appear in the SQL JOIN syntax, but there are standard idioms for
	 * representing them (e.g., using EXISTS).  The planner recognizes these
	 * cases and converts them to joins.  So the planner and executor must
	 * support these codes.  NOTE: in JOIN_SEMI output, it is unspecified
	 * which matching RHS row is joined to.  In JOIN_ANTI output, the row is
	 * guaranteed to be null-extended.
	 */
  /** 1 copy of each LHS row that has match(es) */
  JOIN_SEMI = "JOIN_SEMI",
  /** 1 copy of each LHS row that has no match */
  JOIN_ANTI = "JOIN_ANTI",
  /** 1 copy of each RHS row that has no match */
  JOIN_RIGHT_ANTI = "JOIN_RIGHT_ANTI",
  /**
	 * These codes are used internally in the planner, but are not supported
	 * by the executor (nor, indeed, by most of the planner).
	 */
  /** LHS path must be made unique */
  JOIN_UNIQUE_OUTER = "JOIN_UNIQUE_OUTER",
  /** RHS path must be made unique */
  JOIN_UNIQUE_INNER = "JOIN_UNIQUE_INNER",
  /**
	 * We might need additional join types someday.
	 */
}

/**
 * AggStrategy -
 *	  overall execution strategies for Agg plan nodes
 *
 * This is needed in both pathnodes.h and plannodes.h, so put it here...
 */
export enum AggStrategy {
  /** simple agg across all input rows */
  AGG_PLAIN = "AGG_PLAIN",
  /** grouped agg, input must be sorted */
  AGG_SORTED = "AGG_SORTED",
  /** grouped agg, use internal hashtable */
  AGG_HASHED = "AGG_HASHED",
  /** grouped agg, hash and sort both used */
  AGG_MIXED = "AGG_MIXED",
}

/** Supported operating modes (i.e., useful combinations of these options): */
export enum AggSplit {
  /** Basic, non-split aggregation: */
  AGGSPLIT_SIMPLE = "AGGSPLIT_SIMPLE",
  /** Initial phase of partial aggregation, with serialization: */
  AGGSPLIT_INITIAL_SERIAL = "AGGSPLIT_INITIAL_SERIAL",
  /** Final phase of partial aggregation, with deserialization: */
  AGGSPLIT_FINAL_DESERIAL = "AGGSPLIT_FINAL_DESERIAL",
}

/**
 * SetOpCmd and SetOpStrategy -
 *	  overall semantics and execution strategies for SetOp plan nodes
 *
 * This is needed in both pathnodes.h and plannodes.h, so put it here...
 */
export enum SetOpCmd {
  SETOPCMD_INTERSECT = "SETOPCMD_INTERSECT",
  SETOPCMD_INTERSECT_ALL = "SETOPCMD_INTERSECT_ALL",
  SETOPCMD_EXCEPT = "SETOPCMD_EXCEPT",
  SETOPCMD_EXCEPT_ALL = "SETOPCMD_EXCEPT_ALL",
}

export enum SetOpStrategy {
  /** input must be sorted */
  SETOP_SORTED = "SETOP_SORTED",
  /** use internal hashtable */
  SETOP_HASHED = "SETOP_HASHED",
}

/**
 * OnConflictAction -
 *	  "ON CONFLICT" clause type of query
 *
 * This is needed in both parsenodes.h and plannodes.h, so put it here...
 */
export enum OnConflictAction {
  /** No "ON CONFLICT" clause */
  ONCONFLICT_NONE = "ONCONFLICT_NONE",
  /** ON CONFLICT ... DO NOTHING */
  ONCONFLICT_NOTHING = "ONCONFLICT_NOTHING",
  /** ON CONFLICT ... DO UPDATE */
  ONCONFLICT_UPDATE = "ONCONFLICT_UPDATE",
}

/**
 * LimitOption -
 *	LIMIT option of query
 *
 * This is needed in both parsenodes.h and plannodes.h, so put it here...
 */
export enum LimitOption {
  /** No limit present */
  LIMIT_OPTION_DEFAULT = "LIMIT_OPTION_DEFAULT",
  /** FETCH FIRST... ONLY */
  LIMIT_OPTION_COUNT = "LIMIT_OPTION_COUNT",
  /** FETCH FIRST... WITH TIES */
  LIMIT_OPTION_WITH_TIES = "LIMIT_OPTION_WITH_TIES",
}

export enum VacOptValue {
  VACOPTVALUE_UNSPECIFIED = "VACOPTVALUE_UNSPECIFIED",
  VACOPTVALUE_AUTO = "VACOPTVALUE_AUTO",
  VACOPTVALUE_DISABLED = "VACOPTVALUE_DISABLED",
  VACOPTVALUE_ENABLED = "VACOPTVALUE_ENABLED",
}

export enum ScanDirection {
  BackwardScanDirection = "BackwardScanDirection",
  NoMovementScanDirection = "NoMovementScanDirection",
  ForwardScanDirection = "ForwardScanDirection",
}

export enum pg_enc {
  /** SQL/ASCII */
  PG_SQL_ASCII = "PG_SQL_ASCII",
  /** EUC for Japanese */
  PG_EUC_JP = "PG_EUC_JP",
  /** EUC for Chinese */
  PG_EUC_CN = "PG_EUC_CN",
  /** EUC for Korean */
  PG_EUC_KR = "PG_EUC_KR",
  /** EUC for Taiwan */
  PG_EUC_TW = "PG_EUC_TW",
  /** EUC-JIS-2004 */
  PG_EUC_JIS_2004 = "PG_EUC_JIS_2004",
  /** Unicode UTF8 */
  PG_UTF8 = "PG_UTF8",
  /** Mule internal code */
  PG_MULE_INTERNAL = "PG_MULE_INTERNAL",
  /** ISO-8859-1 Latin 1 */
  PG_LATIN1 = "PG_LATIN1",
  /** ISO-8859-2 Latin 2 */
  PG_LATIN2 = "PG_LATIN2",
  /** ISO-8859-3 Latin 3 */
  PG_LATIN3 = "PG_LATIN3",
  /** ISO-8859-4 Latin 4 */
  PG_LATIN4 = "PG_LATIN4",
  /** ISO-8859-9 Latin 5 */
  PG_LATIN5 = "PG_LATIN5",
  /** ISO-8859-10 Latin6 */
  PG_LATIN6 = "PG_LATIN6",
  /** ISO-8859-13 Latin7 */
  PG_LATIN7 = "PG_LATIN7",
  /** ISO-8859-14 Latin8 */
  PG_LATIN8 = "PG_LATIN8",
  /** ISO-8859-15 Latin9 */
  PG_LATIN9 = "PG_LATIN9",
  /** ISO-8859-16 Latin10 */
  PG_LATIN10 = "PG_LATIN10",
  /** windows-1256 */
  PG_WIN1256 = "PG_WIN1256",
  /** Windows-1258 */
  PG_WIN1258 = "PG_WIN1258",
  /** (MS-DOS CP866) */
  PG_WIN866 = "PG_WIN866",
  /** windows-874 */
  PG_WIN874 = "PG_WIN874",
  /** KOI8-R */
  PG_KOI8R = "PG_KOI8R",
  /** windows-1251 */
  PG_WIN1251 = "PG_WIN1251",
  /** windows-1252 */
  PG_WIN1252 = "PG_WIN1252",
  /** ISO-8859-5 */
  PG_ISO_8859_5 = "PG_ISO_8859_5",
  /** ISO-8859-6 */
  PG_ISO_8859_6 = "PG_ISO_8859_6",
  /** ISO-8859-7 */
  PG_ISO_8859_7 = "PG_ISO_8859_7",
  /** ISO-8859-8 */
  PG_ISO_8859_8 = "PG_ISO_8859_8",
  /** windows-1250 */
  PG_WIN1250 = "PG_WIN1250",
  /** windows-1253 */
  PG_WIN1253 = "PG_WIN1253",
  /** windows-1254 */
  PG_WIN1254 = "PG_WIN1254",
  /** windows-1255 */
  PG_WIN1255 = "PG_WIN1255",
  /** windows-1257 */
  PG_WIN1257 = "PG_WIN1257",
  /** KOI8-U */
  PG_KOI8U = "PG_KOI8U",
  /** PG_ENCODING_BE_LAST points to the above entry */
  /** followings are for client encoding only */
  /** Shift JIS (Windows-932) */
  PG_SJIS = "PG_SJIS",
  /** Big5 (Windows-950) */
  PG_BIG5 = "PG_BIG5",
  /** GBK (Windows-936) */
  PG_GBK = "PG_GBK",
  /** UHC (Windows-949) */
  PG_UHC = "PG_UHC",
  /** GB18030 */
  PG_GB18030 = "PG_GB18030",
  /** EUC for Korean JOHAB */
  PG_JOHAB = "PG_JOHAB",
  /** Shift-JIS-2004 */
  PG_SHIFT_JIS_2004 = "PG_SHIFT_JIS_2004",
  /** mark only */
  _PG_LAST_ENCODING_ = "_PG_LAST_ENCODING_",
}

export enum yytokentype {
  IDENT = "IDENT",
  UIDENT = "UIDENT",
  FCONST = "FCONST",
  SCONST = "SCONST",
  USCONST = "USCONST",
  BCONST = "BCONST",
  XCONST = "XCONST",
  Op = "Op",
  ICONST = "ICONST",
  PARAM = "PARAM",
  TYPECAST = "TYPECAST",
  DOT_DOT = "DOT_DOT",
  COLON_EQUALS = "COLON_EQUALS",
  EQUALS_GREATER = "EQUALS_GREATER",
  LESS_EQUALS = "LESS_EQUALS",
  GREATER_EQUALS = "GREATER_EQUALS",
  NOT_EQUALS = "NOT_EQUALS",
  SQL_COMMENT = "SQL_COMMENT",
  C_COMMENT = "C_COMMENT",
  ABORT_P = "ABORT_P",
  ABSENT = "ABSENT",
  ABSOLUTE_P = "ABSOLUTE_P",
  ACCESS = "ACCESS",
  ACTION = "ACTION",
  ADD_P = "ADD_P",
  ADMIN = "ADMIN",
  AFTER = "AFTER",
  AGGREGATE = "AGGREGATE",
  ALL = "ALL",
  ALSO = "ALSO",
  ALTER = "ALTER",
  ALWAYS = "ALWAYS",
  ANALYSE = "ANALYSE",
  ANALYZE = "ANALYZE",
  AND = "AND",
  ANY = "ANY",
  ARRAY = "ARRAY",
  AS = "AS",
  ASC = "ASC",
  ASENSITIVE = "ASENSITIVE",
  ASSERTION = "ASSERTION",
  ASSIGNMENT = "ASSIGNMENT",
  ASYMMETRIC = "ASYMMETRIC",
  ATOMIC = "ATOMIC",
  AT = "AT",
  ATTACH = "ATTACH",
  ATTRIBUTE = "ATTRIBUTE",
  AUTHORIZATION = "AUTHORIZATION",
  BACKWARD = "BACKWARD",
  BEFORE = "BEFORE",
  BEGIN_P = "BEGIN_P",
  BETWEEN = "BETWEEN",
  BIGINT = "BIGINT",
  BINARY = "BINARY",
  BIT = "BIT",
  BOOLEAN_P = "BOOLEAN_P",
  BOTH = "BOTH",
  BREADTH = "BREADTH",
  BY = "BY",
  CACHE = "CACHE",
  CALL = "CALL",
  CALLED = "CALLED",
  CASCADE = "CASCADE",
  CASCADED = "CASCADED",
  CASE = "CASE",
  CAST = "CAST",
  CATALOG_P = "CATALOG_P",
  CHAIN = "CHAIN",
  CHAR_P = "CHAR_P",
  CHARACTER = "CHARACTER",
  CHARACTERISTICS = "CHARACTERISTICS",
  CHECK = "CHECK",
  CHECKPOINT = "CHECKPOINT",
  CLASS = "CLASS",
  CLOSE = "CLOSE",
  CLUSTER = "CLUSTER",
  COALESCE = "COALESCE",
  COLLATE = "COLLATE",
  COLLATION = "COLLATION",
  COLUMN = "COLUMN",
  COLUMNS = "COLUMNS",
  COMMENT = "COMMENT",
  COMMENTS = "COMMENTS",
  COMMIT = "COMMIT",
  COMMITTED = "COMMITTED",
  COMPRESSION = "COMPRESSION",
  CONCURRENTLY = "CONCURRENTLY",
  CONFIGURATION = "CONFIGURATION",
  CONFLICT = "CONFLICT",
  CONNECTION = "CONNECTION",
  CONSTRAINT = "CONSTRAINT",
  CONSTRAINTS = "CONSTRAINTS",
  CONTENT_P = "CONTENT_P",
  CONTINUE_P = "CONTINUE_P",
  CONVERSION_P = "CONVERSION_P",
  COPY = "COPY",
  COST = "COST",
  CREATE = "CREATE",
  CROSS = "CROSS",
  CSV = "CSV",
  CUBE = "CUBE",
  CURRENT_P = "CURRENT_P",
  CURRENT_CATALOG = "CURRENT_CATALOG",
  CURRENT_DATE = "CURRENT_DATE",
  CURRENT_ROLE = "CURRENT_ROLE",
  CURRENT_SCHEMA = "CURRENT_SCHEMA",
  CURRENT_TIME = "CURRENT_TIME",
  CURRENT_TIMESTAMP = "CURRENT_TIMESTAMP",
  CURRENT_USER = "CURRENT_USER",
  CURSOR = "CURSOR",
  CYCLE = "CYCLE",
  DATA_P = "DATA_P",
  DATABASE = "DATABASE",
  DAY_P = "DAY_P",
  DEALLOCATE = "DEALLOCATE",
  DEC = "DEC",
  DECIMAL_P = "DECIMAL_P",
  DECLARE = "DECLARE",
  DEFAULT = "DEFAULT",
  DEFAULTS = "DEFAULTS",
  DEFERRABLE = "DEFERRABLE",
  DEFERRED = "DEFERRED",
  DEFINER = "DEFINER",
  DELETE_P = "DELETE_P",
  DELIMITER = "DELIMITER",
  DELIMITERS = "DELIMITERS",
  DEPENDS = "DEPENDS",
  DEPTH = "DEPTH",
  DESC = "DESC",
  DETACH = "DETACH",
  DICTIONARY = "DICTIONARY",
  DISABLE_P = "DISABLE_P",
  DISCARD = "DISCARD",
  DISTINCT = "DISTINCT",
  DO = "DO",
  DOCUMENT_P = "DOCUMENT_P",
  DOMAIN_P = "DOMAIN_P",
  DOUBLE_P = "DOUBLE_P",
  DROP = "DROP",
  EACH = "EACH",
  ELSE = "ELSE",
  ENABLE_P = "ENABLE_P",
  ENCODING = "ENCODING",
  ENCRYPTED = "ENCRYPTED",
  END_P = "END_P",
  ENUM_P = "ENUM_P",
  ESCAPE = "ESCAPE",
  EVENT = "EVENT",
  EXCEPT = "EXCEPT",
  EXCLUDE = "EXCLUDE",
  EXCLUDING = "EXCLUDING",
  EXCLUSIVE = "EXCLUSIVE",
  EXECUTE = "EXECUTE",
  EXISTS = "EXISTS",
  EXPLAIN = "EXPLAIN",
  EXPRESSION = "EXPRESSION",
  EXTENSION = "EXTENSION",
  EXTERNAL = "EXTERNAL",
  EXTRACT = "EXTRACT",
  FALSE_P = "FALSE_P",
  FAMILY = "FAMILY",
  FETCH = "FETCH",
  FILTER = "FILTER",
  FINALIZE = "FINALIZE",
  FIRST_P = "FIRST_P",
  FLOAT_P = "FLOAT_P",
  FOLLOWING = "FOLLOWING",
  FOR = "FOR",
  FORCE = "FORCE",
  FOREIGN = "FOREIGN",
  FORMAT = "FORMAT",
  FORWARD = "FORWARD",
  FREEZE = "FREEZE",
  FROM = "FROM",
  FULL = "FULL",
  FUNCTION = "FUNCTION",
  FUNCTIONS = "FUNCTIONS",
  GENERATED = "GENERATED",
  GLOBAL = "GLOBAL",
  GRANT = "GRANT",
  GRANTED = "GRANTED",
  GREATEST = "GREATEST",
  GROUP_P = "GROUP_P",
  GROUPING = "GROUPING",
  GROUPS = "GROUPS",
  HANDLER = "HANDLER",
  HAVING = "HAVING",
  HEADER_P = "HEADER_P",
  HOLD = "HOLD",
  HOUR_P = "HOUR_P",
  IDENTITY_P = "IDENTITY_P",
  IF_P = "IF_P",
  ILIKE = "ILIKE",
  IMMEDIATE = "IMMEDIATE",
  IMMUTABLE = "IMMUTABLE",
  IMPLICIT_P = "IMPLICIT_P",
  IMPORT_P = "IMPORT_P",
  IN_P = "IN_P",
  INCLUDE = "INCLUDE",
  INCLUDING = "INCLUDING",
  INCREMENT = "INCREMENT",
  INDENT = "INDENT",
  INDEX = "INDEX",
  INDEXES = "INDEXES",
  INHERIT = "INHERIT",
  INHERITS = "INHERITS",
  INITIALLY = "INITIALLY",
  INLINE_P = "INLINE_P",
  INNER_P = "INNER_P",
  INOUT = "INOUT",
  INPUT_P = "INPUT_P",
  INSENSITIVE = "INSENSITIVE",
  INSERT = "INSERT",
  INSTEAD = "INSTEAD",
  INT_P = "INT_P",
  INTEGER = "INTEGER",
  INTERSECT = "INTERSECT",
  INTERVAL = "INTERVAL",
  INTO = "INTO",
  INVOKER = "INVOKER",
  IS = "IS",
  ISNULL = "ISNULL",
  ISOLATION = "ISOLATION",
  JOIN = "JOIN",
  JSON = "JSON",
  JSON_ARRAY = "JSON_ARRAY",
  JSON_ARRAYAGG = "JSON_ARRAYAGG",
  JSON_OBJECT = "JSON_OBJECT",
  JSON_OBJECTAGG = "JSON_OBJECTAGG",
  KEY = "KEY",
  KEYS = "KEYS",
  LABEL = "LABEL",
  LANGUAGE = "LANGUAGE",
  LARGE_P = "LARGE_P",
  LAST_P = "LAST_P",
  LATERAL_P = "LATERAL_P",
  LEADING = "LEADING",
  LEAKPROOF = "LEAKPROOF",
  LEAST = "LEAST",
  LEFT = "LEFT",
  LEVEL = "LEVEL",
  LIKE = "LIKE",
  LIMIT = "LIMIT",
  LISTEN = "LISTEN",
  LOAD = "LOAD",
  LOCAL = "LOCAL",
  LOCALTIME = "LOCALTIME",
  LOCALTIMESTAMP = "LOCALTIMESTAMP",
  LOCATION = "LOCATION",
  LOCK_P = "LOCK_P",
  LOCKED = "LOCKED",
  LOGGED = "LOGGED",
  MAPPING = "MAPPING",
  MATCH = "MATCH",
  MATCHED = "MATCHED",
  MATERIALIZED = "MATERIALIZED",
  MAXVALUE = "MAXVALUE",
  MERGE = "MERGE",
  METHOD = "METHOD",
  MINUTE_P = "MINUTE_P",
  MINVALUE = "MINVALUE",
  MODE = "MODE",
  MONTH_P = "MONTH_P",
  MOVE = "MOVE",
  NAME_P = "NAME_P",
  NAMES = "NAMES",
  NATIONAL = "NATIONAL",
  NATURAL = "NATURAL",
  NCHAR = "NCHAR",
  NEW = "NEW",
  NEXT = "NEXT",
  NFC = "NFC",
  NFD = "NFD",
  NFKC = "NFKC",
  NFKD = "NFKD",
  NO = "NO",
  NONE = "NONE",
  NORMALIZE = "NORMALIZE",
  NORMALIZED = "NORMALIZED",
  NOT = "NOT",
  NOTHING = "NOTHING",
  NOTIFY = "NOTIFY",
  NOTNULL = "NOTNULL",
  NOWAIT = "NOWAIT",
  NULL_P = "NULL_P",
  NULLIF = "NULLIF",
  NULLS_P = "NULLS_P",
  NUMERIC = "NUMERIC",
  OBJECT_P = "OBJECT_P",
  OF = "OF",
  OFF = "OFF",
  OFFSET = "OFFSET",
  OIDS = "OIDS",
  OLD = "OLD",
  ON = "ON",
  ONLY = "ONLY",
  OPERATOR = "OPERATOR",
  OPTION = "OPTION",
  OPTIONS = "OPTIONS",
  OR = "OR",
  ORDER = "ORDER",
  ORDINALITY = "ORDINALITY",
  OTHERS = "OTHERS",
  OUT_P = "OUT_P",
  OUTER_P = "OUTER_P",
  OVER = "OVER",
  OVERLAPS = "OVERLAPS",
  OVERLAY = "OVERLAY",
  OVERRIDING = "OVERRIDING",
  OWNED = "OWNED",
  OWNER = "OWNER",
  PARALLEL = "PARALLEL",
  PARAMETER = "PARAMETER",
  PARSER = "PARSER",
  PARTIAL = "PARTIAL",
  PARTITION = "PARTITION",
  PASSING = "PASSING",
  PASSWORD = "PASSWORD",
  PLACING = "PLACING",
  PLANS = "PLANS",
  POLICY = "POLICY",
  POSITION = "POSITION",
  PRECEDING = "PRECEDING",
  PRECISION = "PRECISION",
  PRESERVE = "PRESERVE",
  PREPARE = "PREPARE",
  PREPARED = "PREPARED",
  PRIMARY = "PRIMARY",
  PRIOR = "PRIOR",
  PRIVILEGES = "PRIVILEGES",
  PROCEDURAL = "PROCEDURAL",
  PROCEDURE = "PROCEDURE",
  PROCEDURES = "PROCEDURES",
  PROGRAM = "PROGRAM",
  PUBLICATION = "PUBLICATION",
  QUOTE = "QUOTE",
  RANGE = "RANGE",
  READ = "READ",
  REAL = "REAL",
  REASSIGN = "REASSIGN",
  RECHECK = "RECHECK",
  RECURSIVE = "RECURSIVE",
  REF_P = "REF_P",
  REFERENCES = "REFERENCES",
  REFERENCING = "REFERENCING",
  REFRESH = "REFRESH",
  REINDEX = "REINDEX",
  RELATIVE_P = "RELATIVE_P",
  RELEASE = "RELEASE",
  RENAME = "RENAME",
  REPEATABLE = "REPEATABLE",
  REPLACE = "REPLACE",
  REPLICA = "REPLICA",
  RESET = "RESET",
  RESTART = "RESTART",
  RESTRICT = "RESTRICT",
  RETURN = "RETURN",
  RETURNING = "RETURNING",
  RETURNS = "RETURNS",
  REVOKE = "REVOKE",
  RIGHT = "RIGHT",
  ROLE = "ROLE",
  ROLLBACK = "ROLLBACK",
  ROLLUP = "ROLLUP",
  ROUTINE = "ROUTINE",
  ROUTINES = "ROUTINES",
  ROW = "ROW",
  ROWS = "ROWS",
  RULE = "RULE",
  SAVEPOINT = "SAVEPOINT",
  SCALAR = "SCALAR",
  SCHEMA = "SCHEMA",
  SCHEMAS = "SCHEMAS",
  SCROLL = "SCROLL",
  SEARCH = "SEARCH",
  SECOND_P = "SECOND_P",
  SECURITY = "SECURITY",
  SELECT = "SELECT",
  SEQUENCE = "SEQUENCE",
  SEQUENCES = "SEQUENCES",
  SERIALIZABLE = "SERIALIZABLE",
  SERVER = "SERVER",
  SESSION = "SESSION",
  SESSION_USER = "SESSION_USER",
  SET = "SET",
  SETS = "SETS",
  SETOF = "SETOF",
  SHARE = "SHARE",
  SHOW = "SHOW",
  SIMILAR = "SIMILAR",
  SIMPLE = "SIMPLE",
  SKIP = "SKIP",
  SMALLINT = "SMALLINT",
  SNAPSHOT = "SNAPSHOT",
  SOME = "SOME",
  SQL_P = "SQL_P",
  STABLE = "STABLE",
  STANDALONE_P = "STANDALONE_P",
  START = "START",
  STATEMENT = "STATEMENT",
  STATISTICS = "STATISTICS",
  STDIN = "STDIN",
  STDOUT = "STDOUT",
  STORAGE = "STORAGE",
  STORED = "STORED",
  STRICT_P = "STRICT_P",
  STRIP_P = "STRIP_P",
  SUBSCRIPTION = "SUBSCRIPTION",
  SUBSTRING = "SUBSTRING",
  SUPPORT = "SUPPORT",
  SYMMETRIC = "SYMMETRIC",
  SYSID = "SYSID",
  SYSTEM_P = "SYSTEM_P",
  SYSTEM_USER = "SYSTEM_USER",
  TABLE = "TABLE",
  TABLES = "TABLES",
  TABLESAMPLE = "TABLESAMPLE",
  TABLESPACE = "TABLESPACE",
  TEMP = "TEMP",
  TEMPLATE = "TEMPLATE",
  TEMPORARY = "TEMPORARY",
  TEXT_P = "TEXT_P",
  THEN = "THEN",
  TIES = "TIES",
  TIME = "TIME",
  TIMESTAMP = "TIMESTAMP",
  TO = "TO",
  TRAILING = "TRAILING",
  TRANSACTION = "TRANSACTION",
  TRANSFORM = "TRANSFORM",
  TREAT = "TREAT",
  TRIGGER = "TRIGGER",
  TRIM = "TRIM",
  TRUE_P = "TRUE_P",
  TRUNCATE = "TRUNCATE",
  TRUSTED = "TRUSTED",
  TYPE_P = "TYPE_P",
  TYPES_P = "TYPES_P",
  UESCAPE = "UESCAPE",
  UNBOUNDED = "UNBOUNDED",
  UNCOMMITTED = "UNCOMMITTED",
  UNENCRYPTED = "UNENCRYPTED",
  UNION = "UNION",
  UNIQUE = "UNIQUE",
  UNKNOWN = "UNKNOWN",
  UNLISTEN = "UNLISTEN",
  UNLOGGED = "UNLOGGED",
  UNTIL = "UNTIL",
  UPDATE = "UPDATE",
  USER = "USER",
  USING = "USING",
  VACUUM = "VACUUM",
  VALID = "VALID",
  VALIDATE = "VALIDATE",
  VALIDATOR = "VALIDATOR",
  VALUE_P = "VALUE_P",
  VALUES = "VALUES",
  VARCHAR = "VARCHAR",
  VARIADIC = "VARIADIC",
  VARYING = "VARYING",
  VERBOSE = "VERBOSE",
  VERSION_P = "VERSION_P",
  VIEW = "VIEW",
  VIEWS = "VIEWS",
  VOLATILE = "VOLATILE",
  WHEN = "WHEN",
  WHERE = "WHERE",
  WHITESPACE_P = "WHITESPACE_P",
  WINDOW = "WINDOW",
  WITH = "WITH",
  WITHIN = "WITHIN",
  WITHOUT = "WITHOUT",
  WORK = "WORK",
  WRAPPER = "WRAPPER",
  WRITE = "WRITE",
  XML_P = "XML_P",
  XMLATTRIBUTES = "XMLATTRIBUTES",
  XMLCONCAT = "XMLCONCAT",
  XMLELEMENT = "XMLELEMENT",
  XMLEXISTS = "XMLEXISTS",
  XMLFOREST = "XMLFOREST",
  XMLNAMESPACES = "XMLNAMESPACES",
  XMLPARSE = "XMLPARSE",
  XMLPI = "XMLPI",
  XMLROOT = "XMLROOT",
  XMLSERIALIZE = "XMLSERIALIZE",
  XMLTABLE = "XMLTABLE",
  YEAR_P = "YEAR_P",
  YES_P = "YES_P",
  ZONE = "ZONE",
  FORMAT_LA = "FORMAT_LA",
  NOT_LA = "NOT_LA",
  NULLS_LA = "NULLS_LA",
  WITH_LA = "WITH_LA",
  WITHOUT_LA = "WITHOUT_LA",
  MODE_TYPE_NAME = "MODE_TYPE_NAME",
  MODE_PLPGSQL_EXPR = "MODE_PLPGSQL_EXPR",
  MODE_PLPGSQL_ASSIGN1 = "MODE_PLPGSQL_ASSIGN1",
  MODE_PLPGSQL_ASSIGN2 = "MODE_PLPGSQL_ASSIGN2",
  MODE_PLPGSQL_ASSIGN3 = "MODE_PLPGSQL_ASSIGN3",
  UMINUS = "UMINUS",
}

/**
 * TypeName - specifies a type in definitions
 *
 * For TypeName structures generated internally, it is often easier to
 * specify the type by OID than by name.  If "names" is NIL then the
 * actual type OID is given by typeOid, otherwise typeOid is unused.
 * Similarly, if "typmods" is NIL then the actual typmod is expected to
 * be prespecified in typemod, otherwise typemod is unused.
 *
 * If pct_type is true, then names is actually a field name and we look up
 * the type of that field.  Otherwise (the normal case), names is a type
 * name possibly qualified with schema and database name.
 */
export type TypeName = {
  /** qualified name (list of String nodes) */
  names: QualifiedName
  /** type identified by OID */
  typeOid?: Oid
  /** is a set? */
  setof?: boolean
  /** %TYPE specified? */
  pct_type?: boolean
  /** type modifier expression(s) */
  typmods?: ({ A_Const: A_Const } | { ColumnRef: ColumnRef })[]
  /** prespecified type modifier */
  typemod: number
  /** array bounds */
  arrayBounds?: ({ Integer: Integer })[]
  /** token location, or -1 if unknown */
  location: number
}

/**
 * ColumnRef - specifies a reference to a column, or possibly a whole tuple
 *
 * The "fields" list must be nonempty.  It can contain String nodes
 * (representing names) and A_Star nodes (representing occurrence of a '*').
 * Currently, A_Star must appear only as the last list element --- the grammar
 * is responsible for enforcing this!
 *
 * Note: any container subscripting or selection of fields from composite columns
 * is represented by an A_Indirection node above the ColumnRef.  However,
 * for simplicity in the normal case, initial field selection from a table
 * name is represented within ColumnRef and not by adding A_Indirection.
 */
export type ColumnRef = {
  /** field names (String nodes) or A_Star */
  fields: ({ A_Star: A_Star } | { String: String })[]
  /** token location, or -1 if unknown */
  location: number
}

/**
 * ParamRef - specifies a $n parameter reference
 */
export type ParamRef = {
  /** the number of the parameter */
  number: number
  /** token location, or -1 if unknown */
  location: number
}

/**
 * A_Expr - infix, prefix, and postfix expressions
 */
export type A_Expr = {
  /** see above */
  kind: A_Expr_Kind
  /** possibly-qualified name of operator */
  name: QualifiedName
  /** left argument, or NULL if none */
  lexpr?: Expr
  /** right argument, or NULL if none */
  rexpr: Expr
  /** token location, or -1 if unknown */
  location: number
}

/**
 * TypeCast - a CAST expression
 */
export type TypeCast = {
  /** the expression being casted */
  arg: ({ A_ArrayExpr: A_ArrayExpr } | { A_Const: A_Const } | { A_Expr: A_Expr } | { A_Indirection: A_Indirection } | { CollateClause: CollateClause } | { ColumnRef: ColumnRef } | { FuncCall: FuncCall } | { ParamRef: ParamRef } | { RowExpr: RowExpr } | { SQLValueFunction: SQLValueFunction } | { SubLink: SubLink } | { TypeCast: TypeCast })
  /** the target type */
  typeName: TypeName
  /** token location, or -1 if unknown */
  location: number
}

/**
 * CollateClause - a COLLATE expression
 */
export type CollateClause = {
  /** input expression */
  arg: ({ A_Const: A_Const } | { A_Expr: A_Expr } | { CaseExpr: CaseExpr } | { ColumnRef: ColumnRef } | { TypeCast: TypeCast })
  /** possibly-qualified collation name */
  collname: QualifiedName
  /** token location, or -1 if unknown */
  location: number
}

export type RoleSpec = {
  /** Type of this rolespec */
  roletype: RoleSpecType
  /** filled only for ROLESPEC_CSTRING */
  rolename?: string
  /** token location, or -1 if unknown */
  location: number
}

/**
 * FuncCall - a function or aggregate invocation
 *
 * agg_order (if not NIL) indicates we saw 'foo(... ORDER BY ...)', or if
 * agg_within_group is true, it was 'foo(...) WITHIN GROUP (ORDER BY ...)'.
 * agg_star indicates we saw a 'foo(*)' construct, while agg_distinct
 * indicates we saw 'foo(DISTINCT ...)'.  In any of these cases, the
 * construct *must* be an aggregate call.  Otherwise, it might be either an
 * aggregate or some other kind of function.  However, if FILTER or OVER is
 * present it had better be an aggregate or window function.
 *
 * Normally, you'd initialize this via makeFuncCall() and then only change the
 * parts of the struct its defaults don't match afterwards, as needed.
 */
export type FuncCall = {
  /** qualified name of function */
  funcname: QualifiedName
  /** the arguments (list of exprs) */
  args?: ({ A_ArrayExpr: A_ArrayExpr } | { A_Const: A_Const } | { A_Expr: A_Expr } | { A_Indirection: A_Indirection } | { BoolExpr: BoolExpr } | { CollateClause: CollateClause } | { ColumnRef: ColumnRef } | { FuncCall: FuncCall } | { NamedArgExpr: NamedArgExpr } | { RowExpr: RowExpr } | { SQLValueFunction: SQLValueFunction } | { SubLink: SubLink } | { TypeCast: TypeCast } | { XmlExpr: XmlExpr })[]
  /** ORDER BY (list of SortBy) */
  agg_order?: ({ SortBy: SortBy })[]
  /** FILTER clause, if any */
  agg_filter?: ({ A_Const: A_Const } | { A_Expr: A_Expr } | { ColumnRef: ColumnRef } | { NullTest: NullTest } | { SubLink: SubLink })
  /** OVER clause, if any */
  over?: WindowDef
  /** ORDER BY appeared in WITHIN GROUP */
  agg_within_group?: boolean
  /** argument was really '*' */
  agg_star?: boolean
  /** arguments were labeled DISTINCT */
  agg_distinct?: boolean
  /** last argument was labeled VARIADIC */
  func_variadic?: boolean
  /** how to display this node */
  funcformat: CoercionForm
  /** token location, or -1 if unknown */
  location: number
}

/**
 * A_Star - '*' representing all columns of a table or compound field
 *
 * This can appear within ColumnRef.fields, A_Indirection.indirection, and
 * ResTarget.indirection lists.
 */
export type A_Star = {
}

/**
 * A_Indices - array subscript or slice bounds ([idx] or [lidx:uidx])
 *
 * In slice case, either or both of lidx and uidx can be NULL (omitted).
 * In non-slice case, uidx holds the single subscript and lidx is always NULL.
 */
export type A_Indices = {
  /** true if slice (i.e., colon present) */
  is_slice?: boolean
  /** slice lower bound, if any */
  lidx?: ({ A_Const: A_Const })
  /** subscript, or slice upper bound if any */
  uidx: ({ A_Const: A_Const } | { ColumnRef: ColumnRef })
}

/**
 * A_Indirection - select a field and/or array element from an expression
 *
 * The indirection list can contain A_Indices nodes (representing
 * subscripting), String nodes (representing field selection --- the
 * string value is the name of the field to select), and A_Star nodes
 * (representing selection of all fields of a composite type).
 * For example, a complex selection operation like
 *				(foo).field1[42][7].field2
 * would be represented with a single A_Indirection node having a 4-element
 * indirection list.
 *
 * Currently, A_Star must appear only as the last list element --- the grammar
 * is responsible for enforcing this!
 */
export type A_Indirection = {
  /** the thing being selected from */
  arg: ({ A_Indirection: A_Indirection } | { ColumnRef: ColumnRef } | { FuncCall: FuncCall } | { RowExpr: RowExpr } | { SubLink: SubLink } | { TypeCast: TypeCast })
  /** subscripts and/or field names and/or * */
  indirection: ({ A_Indices: A_Indices } | { A_Star: A_Star } | { String: String })[]
}

/**
 * A_ArrayExpr - an ARRAY[] construct
 */
export type A_ArrayExpr = {
  /** array element expressions */
  elements?: ({ A_ArrayExpr: A_ArrayExpr } | { A_Const: A_Const } | { A_Expr: A_Expr } | { ColumnRef: ColumnRef } | { FuncCall: FuncCall } | { RowExpr: RowExpr } | { SQLValueFunction: SQLValueFunction } | { TypeCast: TypeCast })[]
  /** token location, or -1 if unknown */
  location: number
}

/**
 * ResTarget -
 *	  result target (used in target list of pre-transformed parse trees)
 *
 * In a SELECT target list, 'name' is the column label from an
 * 'AS ColumnLabel' clause, or NULL if there was none, and 'val' is the
 * value expression itself.  The 'indirection' field is not used.
 *
 * INSERT uses ResTarget in its target-column-names list.  Here, 'name' is
 * the name of the destination column, 'indirection' stores any subscripts
 * attached to the destination, and 'val' is not used.
 *
 * In an UPDATE target list, 'name' is the name of the destination column,
 * 'indirection' stores any subscripts attached to the destination, and
 * 'val' is the expression to assign.
 *
 * See A_Indirection for more info about what can appear in 'indirection'.
 */
export type ResTarget = {
  /** column name or NULL */
  name?: string
  /** subscripts, field names, and '*', or NIL */
  indirection?: ({ A_Indices: A_Indices } | { String: String })[]
  /** the value expression to compute or assign */
  val?: ({ A_ArrayExpr: A_ArrayExpr } | { A_Const: A_Const } | { A_Expr: A_Expr } | { A_Indirection: A_Indirection } | { BoolExpr: BoolExpr } | { BooleanTest: BooleanTest } | { CaseExpr: CaseExpr } | { CoalesceExpr: CoalesceExpr } | { CollateClause: CollateClause } | { ColumnRef: ColumnRef } | { FuncCall: FuncCall } | { GroupingFunc: GroupingFunc } | { JsonArrayAgg: JsonArrayAgg } | { JsonArrayConstructor: JsonArrayConstructor } | { JsonArrayQueryConstructor: JsonArrayQueryConstructor } | { JsonIsPredicate: JsonIsPredicate } | { JsonObjectAgg: JsonObjectAgg } | { JsonObjectConstructor: JsonObjectConstructor } | { MinMaxExpr: MinMaxExpr } | { MultiAssignRef: MultiAssignRef } | { NullTest: NullTest } | { ParamRef: ParamRef } | { RowExpr: RowExpr } | { SQLValueFunction: SQLValueFunction } | { SetToDefault: SetToDefault } | { SubLink: SubLink } | { TypeCast: TypeCast } | { XmlExpr: XmlExpr } | { XmlSerialize: XmlSerialize })
  /** token location, or -1 if unknown */
  location: number
}

/**
 * MultiAssignRef - element of a row source expression for UPDATE
 *
 * In an UPDATE target list, when we have SET (a,b,c) = row-valued-expression,
 * we generate separate ResTarget items for each of a,b,c.  Their "val" trees
 * are MultiAssignRef nodes numbered 1..n, linking to a common copy of the
 * row-valued-expression (which parse analysis will process only once, when
 * handling the MultiAssignRef with colno=1).
 */
export type MultiAssignRef = {
  /** the row-valued expression */
  source: ({ ColumnRef: ColumnRef } | { RowExpr: RowExpr } | { SubLink: SubLink })
  /** column number for this target (1..n) */
  colno: number
  /** number of targets in the construct */
  ncolumns: number
}

/**
 * SortBy - for ORDER BY clause
 */
export type SortBy = {
  /** expression to sort on */
  node: ({ A_Const: A_Const } | { A_Expr: A_Expr } | { A_Indirection: A_Indirection } | { CollateClause: CollateClause } | { ColumnRef: ColumnRef } | { FuncCall: FuncCall } | { TypeCast: TypeCast })
  /** ASC/DESC/USING/default */
  sortby_dir: SortByDir
  /** NULLS FIRST/LAST */
  sortby_nulls: SortByNulls
  /** name of op to use, if SORTBY_USING */
  useOp?: QualifiedName
  /** operator location, or -1 if none/unknown */
  location: number
}

/**
 * WindowDef - raw representation of WINDOW and OVER clauses
 *
 * For entries in a WINDOW list, "name" is the window name being defined.
 * For OVER clauses, we use "name" for the "OVER window" syntax, or "refname"
 * for the "OVER (window)" syntax, which is subtly different --- the latter
 * implies overriding the window frame clause.
 */
export type WindowDef = {
  /** window's own name */
  name: string
  /** referenced window name, if any */
  refname?: string
  /** PARTITION BY expression list */
  partitionClause?: ({ ColumnRef: ColumnRef })[]
  /** ORDER BY (list of SortBy) */
  orderClause?: ({ SortBy: SortBy })[]
  /** frame_clause options, see below */
  frameOptions: number
  /** expression for starting bound, if any */
  startOffset?: ({ A_Const: A_Const } | { TypeCast: TypeCast })
  /** expression for ending bound, if any */
  endOffset?: ({ A_Const: A_Const } | { TypeCast: TypeCast })
  /** parse location, or -1 if none/unknown */
  location: number
}

/**
 * RangeSubselect - subquery appearing in a FROM clause
 */
export type RangeSubselect = {
  /** does it have LATERAL prefix? */
  lateral?: boolean
  /** the untransformed sub-select clause */
  subquery: ({ SelectStmt: SelectStmt })
  /** table alias & optional column aliases */
  alias?: Alias
}

/**
 * RangeFunction - function call appearing in a FROM clause
 *
 * functions is a List because we use this to represent the construct
 * ROWS FROM(func1(...), func2(...), ...).  Each element of this list is a
 * two-element sublist, the first element being the untransformed function
 * call tree, and the second element being a possibly-empty list of ColumnDef
 * nodes representing any columndef list attached to that function within the
 * ROWS FROM() syntax.
 *
 * alias and coldeflist represent any alias and/or columndef list attached
 * at the top level.  (We disallow coldeflist appearing both here and
 * per-function, but that's checked in parse analysis, not by the grammar.)
 */
export type RangeFunction = {
  /** does it have LATERAL prefix? */
  lateral?: boolean
  /** does it have WITH ORDINALITY suffix? */
  ordinality?: boolean
  /** is result of ROWS FROM() syntax? */
  is_rowsfrom?: boolean
  /** per-function information, see above */
  functions: List<{ CoalesceExpr: CoalesceExpr } | { FuncCall: FuncCall } | { List: List } | { SQLValueFunction: SQLValueFunction } | { TypeCast: TypeCast }>[]
  /** table alias & optional column aliases */
  alias?: Alias
  /** list of ColumnDef nodes to describe result
								 * of function returning RECORD */
  coldeflist?: ({ ColumnDef: ColumnDef })[]
}

/**
 * RangeTableFunc - raw form of "table functions" such as XMLTABLE
 */
export type RangeTableFunc = {
  /** does it have LATERAL prefix? */
  lateral?: boolean
  /** document expression */
  docexpr: Expr
  /** row generator expression */
  rowexpr: Expr
  /** list of namespaces as ResTarget */
  namespaces?: ({ ResTarget: ResTarget })[]
  /** list of RangeTableFuncCol */
  columns: ({ RangeTableFuncCol: RangeTableFuncCol })[]
  /** table alias & optional column aliases */
  alias?: Alias
  /** token location, or -1 if unknown */
  location: number
}

/**
 * RangeTableFuncCol - one column in a RangeTableFunc->columns
 *
 * If for_ordinality is true (FOR ORDINALITY), then the column is an int4
 * column and the rest of the fields are ignored.
 */
export type RangeTableFuncCol = {
  /** name of generated column */
  colname: string
  /** type of generated column */
  typeName?: TypeName
  /** does it have FOR ORDINALITY? */
  for_ordinality?: boolean
  /** does it have NOT NULL? */
  is_not_null?: boolean
  /** column filter expression */
  colexpr?: Expr
  /** column default value expression */
  coldefexpr?: Expr
  /** token location, or -1 if unknown */
  location: number
}

/**
 * RangeTableSample - TABLESAMPLE appearing in a raw FROM clause
 *
 * This node, appearing only in raw parse trees, represents
 *		<relation> TABLESAMPLE <method> (<params>) REPEATABLE (<num>)
 * Currently, the <relation> can only be a RangeVar, but we might in future
 * allow RangeSubselect and other options.  Note that the RangeTableSample
 * is wrapped around the node representing the <relation>, rather than being
 * a subfield of it.
 */
export type RangeTableSample = {
  /** relation to be sampled */
  relation: ({ RangeVar: RangeVar })
  /** sampling method name (possibly qualified) */
  method: QualifiedName
  /** argument(s) for sampling method */
  args: ({ A_Const: A_Const } | { A_Expr: A_Expr } | { ColumnRef: ColumnRef } | { TypeCast: TypeCast })[]
  /** REPEATABLE expression, or NULL if none */
  repeatable?: ({ A_Const: A_Const })
  /** method name location, or -1 if unknown */
  location: number
}

/**
 * ColumnDef - column definition (used in various creates)
 *
 * If the column has a default value, we may have the value expression
 * in either "raw" form (an untransformed parse tree) or "cooked" form
 * (a post-parse-analysis, executable expression tree), depending on
 * how this ColumnDef node was created (by parsing, or by inheritance
 * from an existing relation).  We should never have both in the same node!
 *
 * Similarly, we may have a COLLATE specification in either raw form
 * (represented as a CollateClause with arg==NULL) or cooked form
 * (the collation's OID).
 *
 * The constraints list may contain a CONSTR_DEFAULT item in a raw
 * parsetree produced by gram.y, but transformCreateStmt will remove
 * the item and set raw_default instead.  CONSTR_DEFAULT items
 * should not appear in any subsequent processing.
 */
export type ColumnDef = {
  /** name of column */
  colname?: string
  /** type of column */
  typeName?: TypeName
  /** compression method for column */
  compression?: string
  /** number of times column is inherited */
  inhcount?: number
  /** column has local (non-inherited) def'n */
  is_local?: boolean
  /** NOT NULL constraint specified? */
  is_not_null?: boolean
  /** column definition came from table type */
  is_from_type?: boolean
  /** attstorage setting, or 0 for default */
  storage?: string
  /** attstorage setting name or NULL for default */
  storage_name?: string
  /** default value (untransformed parse tree) */
  raw_default?: ({ A_Const: A_Const } | { TypeCast: TypeCast })
  /** default value (transformed expr tree) */
  cooked_default?: Node
  /** attidentity setting */
  identity?: string
  /** to store identity sequence name for
									 * ALTER TABLE ... ADD COLUMN */
  identitySequence?: RangeVar
  /** attgenerated setting */
  generated?: string
  /** untransformed COLLATE spec, if any */
  collClause?: CollateClause
  /** collation OID (InvalidOid if not set) */
  collOid?: Oid
  /** other constraints on column */
  constraints?: ({ Constraint: Constraint })[]
  /** per-column FDW options */
  fdwoptions?: ({ DefElem: DefElem })[]
  /** parse location, or -1 if none/unknown */
  location: number
}

/**
 * TableLikeClause - CREATE TABLE ( ... LIKE ... ) clause
 */
export type TableLikeClause = {
  relation: RangeVar
  /** OR of TableLikeOption flags */
  options?: number
  /** If table has been looked up, its OID */
  relationOid?: Oid
}

/**
 * IndexElem - index parameters (used in CREATE INDEX, and in ON CONFLICT)
 *
 * For a plain index attribute, 'name' is the name of the table column to
 * index, and 'expr' is NULL.  For an index expression, 'name' is NULL and
 * 'expr' is the expression tree.
 */
export type IndexElem = {
  /** name of attribute to index, or NULL */
  name?: string
  /** expression to index, or NULL */
  expr?: Expr
  /** name for index column; NULL = default */
  indexcolname?: string
  /** name of collation; NIL = default */
  collation?: QualifiedName
  /** name of desired opclass; NIL = default */
  opclass?: QualifiedName
  /** opclass-specific options, or NIL */
  opclassopts?: ({ DefElem: DefElem })[]
  /** ASC/DESC/default */
  ordering: SortByDir
  /** FIRST/LAST/default */
  nulls_ordering: SortByNulls
}

/**
 * DefElem - a generic "name = value" option definition
 *
 * In some contexts the name can be qualified.  Also, certain SQL commands
 * allow a SET/ADD/DROP action to be attached to option settings, so it's
 * convenient to carry a field for that too.  (Note: currently, it is our
 * practice that the grammar allows namespace and action only in statements
 * where they are relevant; C code can just ignore those fields in other
 * statements.)
 */
export type DefElem = {
  /** NULL if unqualified name */
  defnamespace?: string
  defname: string
  /** typically Integer, Float, String, or
								 * TypeName */
  arg?: ({ A_Const: A_Const } | { Boolean: Boolean } | { Float: Float } | { Integer: Integer } | { List: List } | { String: String } | { TypeName: TypeName } | { VariableSetStmt: VariableSetStmt })
  /** unspecified action, or SET/ADD/DROP */
  defaction: DefElemAction
  /** token location, or -1 if unknown */
  location?: number
}

/**
 * LockingClause - raw representation of FOR [NO KEY] UPDATE/[KEY] SHARE
 *		options
 *
 * Note: lockedRels == NIL means "all relations in query".  Otherwise it
 * is a list of RangeVar nodes.  (We use RangeVar mainly because it carries
 * a location field --- currently, parse analysis insists on unqualified
 * names in LockingClause.)
 */
export type LockingClause = {
  /** FOR [KEY] UPDATE/SHARE relations */
  lockedRels?: ({ RangeVar: RangeVar })[]
  strength: LockClauseStrength
  /** NOWAIT and SKIP LOCKED */
  waitPolicy: LockWaitPolicy
}

/**
 * XMLSERIALIZE (in raw parse tree only)
 */
export type XmlSerialize = {
  /** DOCUMENT or CONTENT */
  xmloption: XmlOptionType
  expr: Expr
  typeName: TypeName
  /** [NO] INDENT */
  indent?: boolean
  /** token location, or -1 if unknown */
  location: number
}

/**
 * PartitionElem - parse-time representation of a single partition key
 *
 * expr can be either a raw expression tree or a parse-analyzed expression.
 * We don't store these on-disk, though.
 */
export type PartitionElem = {
  /** name of column to partition on, or NULL */
  name?: string
  /** expression to partition on, or NULL */
  expr?: Expr
  /** name of collation; NIL = default */
  collation?: QualifiedName
  /** name of desired opclass; NIL = default */
  opclass?: QualifiedName
  /** token location, or -1 if unknown */
  location: number
}

/**
 * PartitionSpec - parse-time representation of a partition key specification
 *
 * This represents the key space we will be partitioning on.
 */
export type PartitionSpec = {
  strategy: PartitionStrategy
  /** List of PartitionElems */
  partParams: any[]
  /** token location, or -1 if unknown */
  location: number
}

/**
 * PartitionBoundSpec - a partition bound specification
 *
 * This represents the portion of the partition key space assigned to a
 * particular partition.  These are stored on disk in pg_class.relpartbound.
 */
export type PartitionBoundSpec = {
  /** see PARTITION_STRATEGY codes above */
  strategy: string
  /** is it a default partition bound? */
  is_default: boolean
  /** Partitioning info for HASH strategy: */
  modulus: number
  remainder: number
  /** Partitioning info for LIST strategy: */
  /** List of Consts (or A_Consts in raw tree) */
  listdatums: any[]
  /** Partitioning info for RANGE strategy: */
  /** List of PartitionRangeDatums */
  lowerdatums: any[]
  /** List of PartitionRangeDatums */
  upperdatums: any[]
  /** token location, or -1 if unknown */
  location: number
}

export type PartitionRangeDatum = Expr
/**
 * PartitionCmd - info for ALTER TABLE/INDEX ATTACH/DETACH PARTITION commands
 */
export type PartitionCmd = {
  /** name of partition to attach/detach */
  name: RangeVar
  /** FOR VALUES, if attaching */
  bound?: PartitionBoundSpec
  concurrent?: boolean
}

/**
 * RTEPermissionInfo
 * 		Per-relation information for permission checking. Added to the Query
 * 		node by the parser when adding the corresponding RTE to the query
 * 		range table and subsequently editorialized on by the rewriter if
 * 		needed after rule expansion.
 *
 * Only the relations directly mentioned in the query are checked for
 * access permissions by the core executor, so only their RTEPermissionInfos
 * are present in the Query.  However, extensions may want to check inheritance
 * children too, depending on the value of rte->inh, so it's copied in 'inh'
 * for their perusal.
 *
 * requiredPerms and checkAsUser specify run-time access permissions checks
 * to be performed at query startup.  The user must have *all* of the
 * permissions that are OR'd together in requiredPerms (never 0!).  If
 * checkAsUser is not zero, then do the permissions checks using the access
 * rights of that user, not the current effective user ID.  (This allows rules
 * to act as setuid gateways.)
 *
 * For SELECT/INSERT/UPDATE permissions, if the user doesn't have table-wide
 * permissions then it is sufficient to have the permissions on all columns
 * identified in selectedCols (for SELECT) and/or insertedCols and/or
 * updatedCols (INSERT with ON CONFLICT DO UPDATE may have all 3).
 * selectedCols, insertedCols and updatedCols are bitmapsets, which cannot have
 * negative integer members, so we subtract FirstLowInvalidHeapAttributeNumber
 * from column numbers before storing them in these fields.  A whole-row Var
 * reference is represented by setting the bit for InvalidAttrNumber.
 *
 * updatedCols is also used in some other places, for example, to determine
 * which triggers to fire and in FDWs to know which changed columns they need
 * to ship off.
 */
export type RTEPermissionInfo = {
  /** relation OID */
  relid: Oid
  /** separately check inheritance children? */
  inh: boolean
  /** bitmask of required access permissions */
  requiredPerms: AclMode
  /** if valid, check access as this role */
  checkAsUser: Oid
  /** columns needing SELECT permission */
  selectedCols: any
  /** columns needing INSERT permission */
  insertedCols: any
  /** columns needing UPDATE permission */
  updatedCols: any
}

/**
 * TableSampleClause - TABLESAMPLE appearing in a transformed FROM clause
 *
 * Unlike RangeTableSample, this is a subnode of the relevant RangeTblEntry.
 */
export type TableSampleClause = {
  /** OID of the tablesample handler function */
  tsmhandler: Oid
  /** tablesample argument expression(s) */
  args: any[]
  /** REPEATABLE expression, or NULL if none */
  repeatable?: Expr
}

export type WithCheckOption = {
  /** kind of WCO */
  kind: WCOKind
  /** name of relation that specified the WCO */
  relname: string
  /** name of RLS policy being checked */
  polname: string
  /** constraint qual to check */
  qual: Node
  /** true for a cascaded WCO on a view */
  cascaded: boolean
}

/**
 * SortGroupClause -
 *		representation of ORDER BY, GROUP BY, PARTITION BY,
 *		DISTINCT, DISTINCT ON items
 *
 * You might think that ORDER BY is only interested in defining ordering,
 * and GROUP/DISTINCT are only interested in defining equality.  However,
 * one way to implement grouping is to sort and then apply a "uniq"-like
 * filter.  So it's also interesting to keep track of possible sort operators
 * for GROUP/DISTINCT, and in particular to try to sort for the grouping
 * in a way that will also yield a requested ORDER BY ordering.  So we need
 * to be able to compare ORDER BY and GROUP/DISTINCT lists, which motivates
 * the decision to give them the same representation.
 *
 * tleSortGroupRef must match ressortgroupref of exactly one entry of the
 *		query's targetlist; that is the expression to be sorted or grouped by.
 * eqop is the OID of the equality operator.
 * sortop is the OID of the ordering operator (a "<" or ">" operator),
 *		or InvalidOid if not available.
 * nulls_first means about what you'd expect.  If sortop is InvalidOid
 *		then nulls_first is meaningless and should be set to false.
 * hashable is true if eqop is hashable (note this condition also depends
 *		on the datatype of the input expression).
 *
 * In an ORDER BY item, all fields must be valid.  (The eqop isn't essential
 * here, but it's cheap to get it along with the sortop, and requiring it
 * to be valid eases comparisons to grouping items.)  Note that this isn't
 * actually enough information to determine an ordering: if the sortop is
 * collation-sensitive, a collation OID is needed too.  We don't store the
 * collation in SortGroupClause because it's not available at the time the
 * parser builds the SortGroupClause; instead, consult the exposed collation
 * of the referenced targetlist expression to find out what it is.
 *
 * In a grouping item, eqop must be valid.  If the eqop is a btree equality
 * operator, then sortop should be set to a compatible ordering operator.
 * We prefer to set eqop/sortop/nulls_first to match any ORDER BY item that
 * the query presents for the same tlist item.  If there is none, we just
 * use the default ordering op for the datatype.
 *
 * If the tlist item's type has a hash opclass but no btree opclass, then
 * we will set eqop to the hash equality operator, sortop to InvalidOid,
 * and nulls_first to false.  A grouping item of this kind can only be
 * implemented by hashing, and of course it'll never match an ORDER BY item.
 *
 * The hashable flag is provided since we generally have the requisite
 * information readily available when the SortGroupClause is constructed,
 * and it's relatively expensive to get it again later.  Note there is no
 * need for a "sortable" flag since OidIsValid(sortop) serves the purpose.
 *
 * A query might have both ORDER BY and DISTINCT (or DISTINCT ON) clauses.
 * In SELECT DISTINCT, the distinctClause list is as long or longer than the
 * sortClause list, while in SELECT DISTINCT ON it's typically shorter.
 * The two lists must match up to the end of the shorter one --- the parser
 * rearranges the distinctClause if necessary to make this true.  (This
 * restriction ensures that only one sort step is needed to both satisfy the
 * ORDER BY and set up for the Unique step.  This is semantically necessary
 * for DISTINCT ON, and presents no real drawback for DISTINCT.)
 */
export type SortGroupClause = {
  /** reference into targetlist */
  tleSortGroupRef: Index
  /** the equality operator ('=' op) */
  eqop: Oid
  /** the ordering operator ('<' op), or 0 */
  sortop: Oid
  /** do NULLs come before normal values? */
  nulls_first: boolean
  /** can eqop be implemented by hashing? */
  hashable: boolean
}

export type GroupingSet = {
  kind: GroupingSetKind
  content?: ({ A_Const: A_Const } | { A_Expr: A_Expr } | { ColumnRef: ColumnRef } | { GroupingSet: GroupingSet } | { RowExpr: RowExpr } | { TypeCast: TypeCast })[]
  location: number
}

/**
 * WindowClause -
 *		transformed representation of WINDOW and OVER clauses
 *
 * A parsed Query's windowClause list contains these structs.  "name" is set
 * if the clause originally came from WINDOW, and is NULL if it originally
 * was an OVER clause (but note that we collapse out duplicate OVERs).
 * partitionClause and orderClause are lists of SortGroupClause structs.
 * If we have RANGE with offset PRECEDING/FOLLOWING, the semantics of that are
 * specified by startInRangeFunc/inRangeColl/inRangeAsc/inRangeNullsFirst
 * for the start offset, or endInRangeFunc/inRange* for the end offset.
 * winref is an ID number referenced by WindowFunc nodes; it must be unique
 * among the members of a Query's windowClause list.
 * When refname isn't null, the partitionClause is always copied from there;
 * the orderClause might or might not be copied (see copiedOrder); the framing
 * options are never copied, per spec.
 *
 * The information relevant for the query jumbling is the partition clause
 * type and its bounds.
 */
export type WindowClause = {
  /** window name (NULL in an OVER clause) */
  name?: string
  /** referenced window name, if any */
  refname: string
  /** PARTITION BY list */
  partitionClause: any[]
  /** ORDER BY list */
  orderClause: any[]
  /** frame_clause options, see WindowDef */
  frameOptions: number
  /** expression for starting bound, if any */
  startOffset: Node
  /** expression for ending bound, if any */
  endOffset: Node
  /** qual to help short-circuit execution */
  runCondition: any[]
  /** in_range function for startOffset */
  startInRangeFunc: Oid
  /** in_range function for endOffset */
  endInRangeFunc: Oid
  /** collation for in_range tests */
  inRangeColl: Oid
  /** use ASC sort order for in_range tests? */
  inRangeAsc: boolean
  /** nulls sort first for in_range tests? */
  inRangeNullsFirst: boolean
  /** ID referenced by window functions */
  winref: Index
  /** did we copy orderClause from refname? */
  copiedOrder: boolean
}

/**
 * RowMarkClause -
 *	   parser output representation of FOR [KEY] UPDATE/SHARE clauses
 *
 * Query.rowMarks contains a separate RowMarkClause node for each relation
 * identified as a FOR [KEY] UPDATE/SHARE target.  If one of these clauses
 * is applied to a subquery, we generate RowMarkClauses for all normal and
 * subquery rels in the subquery, but they are marked pushedDown = true to
 * distinguish them from clauses that were explicitly written at this query
 * level.  Also, Query.hasForUpdate tells whether there were explicit FOR
 * UPDATE/SHARE/KEY SHARE clauses in the current query level.
 */
export type RowMarkClause = {
  /** range table index of target relation */
  rti: Index
  strength: LockClauseStrength
  /** NOWAIT and SKIP LOCKED */
  waitPolicy: LockWaitPolicy
  /** pushed down from higher query level? */
  pushedDown: boolean
}

/**
 * WithClause -
 *	   representation of WITH clause
 *
 * Note: WithClause does not propagate into the Query representation;
 * but CommonTableExpr does.
 */
export type WithClause = {
  /** list of CommonTableExprs */
  ctes: any[]
  /** true = WITH RECURSIVE */
  recursive: boolean
  /** token location, or -1 if unknown */
  location: number
}

/**
 * InferClause -
 *		ON CONFLICT unique index inference clause
 *
 * Note: InferClause does not propagate into the Query representation.
 */
export type InferClause = {
  /** IndexElems to infer unique index */
  indexElems: any[]
  /** qualification (partial-index predicate) */
  whereClause: Node
  /** Constraint name, or NULL if unnamed */
  conname?: string
  /** token location, or -1 if unknown */
  location: number
}

/**
 * OnConflictClause -
 *		representation of ON CONFLICT clause
 *
 * Note: OnConflictClause does not propagate into the Query representation.
 */
export type OnConflictClause = {
  /** DO NOTHING or UPDATE? */
  action: OnConflictAction
  /** Optional index inference clause */
  infer: InferClause
  /** the target list (of ResTarget) */
  targetList: any[]
  /** qualifications */
  whereClause: Node
  /** token location, or -1 if unknown */
  location: number
}

export type CTESearchClause = {
  search_col_list: any[]
  search_breadth_first: boolean
  search_seq_column: string
  location: number
}

export type CTECycleClause = {
  cycle_col_list: any[]
  cycle_mark_column: string
  cycle_mark_value: Node
  cycle_mark_default: Node
  cycle_path_column: string
  location: number
  /** These fields are set during parse analysis: */
  /** common type of _value and _default */
  cycle_mark_type: Oid
  cycle_mark_typmod: number
  cycle_mark_collation: Oid
  /** <> operator for type */
  cycle_mark_neop: Oid
}

export type CommonTableExpr = {
  /**
	 * Query name (never qualified).  The string name is included in the query
	 * jumbling because RTE_CTE RTEs need it.
	 */
  ctename: string
  /** optional list of column names */
  aliascolnames?: ({ String: String })[]
  /** is this an optimization fence? */
  ctematerialized: CTEMaterialize
  /** SelectStmt/InsertStmt/etc before parse analysis, Query afterwards: */
  /** the CTE's subquery */
  ctequery: ({ DeleteStmt: DeleteStmt } | { InsertStmt: InsertStmt } | { MergeStmt: MergeStmt } | { SelectStmt: SelectStmt } | { UpdateStmt: UpdateStmt })
  search_clause?: CTESearchClause
  cycle_clause?: CTECycleClause
  /** token location, or -1 if unknown */
  location: number
  /** These fields are set during parse analysis: */
  /** is this CTE actually recursive? */
  cterecursive?: boolean
  /**
	 * Number of RTEs referencing this CTE (excluding internal
	 * self-references), irrelevant for query jumbling.
	 */
  cterefcount?: number
  /** list of output column names */
  ctecolnames?: any[]
  /** OID list of output column type OIDs */
  ctecoltypes?: any[]
  /** integer list of output column typmods */
  ctecoltypmods?: any[]
  /** OID list of column collation OIDs */
  ctecolcollations?: any[]
}

/**
 * MergeWhenClause -
 *		raw parser representation of a WHEN clause in a MERGE statement
 *
 * This is transformed into MergeAction by parse analysis
 */
export type MergeWhenClause = {
  /** true=MATCHED, false=NOT MATCHED */
  matched?: boolean
  /** INSERT/UPDATE/DELETE/DO NOTHING */
  commandType: CmdType
  /** OVERRIDING clause */
  override: OverridingKind
  /** WHEN conditions (raw parser) */
  condition?: ({ A_Expr: A_Expr } | { BoolExpr: BoolExpr } | { NullTest: NullTest })
  /** INSERT/UPDATE targetlist */
  targetList?: ({ ResTarget: ResTarget })[]
  /** the following members are only used in INSERT actions */
  /** VALUES to INSERT, or NULL */
  values?: ({ A_Const: A_Const } | { A_Expr: A_Expr } | { ColumnRef: ColumnRef })[]
}

/**
 * MergeAction -
 *		Transformed representation of a WHEN clause in a MERGE statement
 */
export type MergeAction = {
  /** true=MATCHED, false=NOT MATCHED */
  matched: boolean
  /** INSERT/UPDATE/DELETE/DO NOTHING */
  commandType: CmdType
  /** OVERRIDING clause */
  override: OverridingKind
  /** transformed WHEN conditions */
  qual: Node
  /** the target list (of TargetEntry) */
  targetList: any[]
  /** target attribute numbers of an UPDATE */
  updateColnos: any[]
}

/**
 * TriggerTransition -
 *	   representation of transition row or table naming clause
 *
 * Only transition tables are initially supported in the syntax, and only for
 * AFTER triggers, but other permutations are accepted by the parser so we can
 * give a meaningful message from C code.
 */
export type TriggerTransition = {
  name: string
  isNew?: boolean
  isTable: boolean
}

/**
 * JsonOutput -
 *		representation of JSON output clause (RETURNING type [FORMAT format])
 */
export type JsonOutput = {
  /** RETURNING type name, if specified */
  typeName: TypeName
  /** RETURNING FORMAT clause and type Oids */
  returning: JsonReturning
}

/**
 * JsonKeyValue -
 *		untransformed representation of JSON object key-value pair for
 *		JSON_OBJECT() and JSON_OBJECTAGG()
 */
export type JsonKeyValue = {
  /** key expression */
  key: Expr
  /** JSON value expression */
  value: JsonValueExpr
}

/**
 * JsonObjectConstructor -
 *		untransformed representation of JSON_OBJECT() constructor
 */
export type JsonObjectConstructor = {
  /** list of JsonKeyValue pairs */
  exprs?: ({ JsonKeyValue: JsonKeyValue })[]
  /** RETURNING clause, if specified  */
  output?: JsonOutput
  /** skip NULL values? */
  absent_on_null?: boolean
  /** check key uniqueness? */
  unique?: boolean
  /** token location, or -1 if unknown */
  location: number
}

/**
 * JsonArrayConstructor -
 *		untransformed representation of JSON_ARRAY(element,...) constructor
 */
export type JsonArrayConstructor = {
  /** list of JsonValueExpr elements */
  exprs?: ({ JsonValueExpr: JsonValueExpr })[]
  /** RETURNING clause, if specified  */
  output?: JsonOutput
  /** skip NULL elements? */
  absent_on_null?: boolean
  /** token location, or -1 if unknown */
  location: number
}

/**
 * JsonArrayQueryConstructor -
 *		untransformed representation of JSON_ARRAY(subquery) constructor
 */
export type JsonArrayQueryConstructor = {
  /** subquery */
  query: ({ SelectStmt: SelectStmt })
  /** RETURNING clause, if specified  */
  output?: JsonOutput
  /** FORMAT clause for subquery, if specified */
  format: JsonFormat
  /** skip NULL elements? */
  absent_on_null: boolean
  /** token location, or -1 if unknown */
  location: number
}

/**
 * JsonAggConstructor -
 *		common fields of untransformed representation of
 *		JSON_ARRAYAGG() and JSON_OBJECTAGG()
 */
export type JsonAggConstructor = {
  /** RETURNING clause, if any */
  output: JsonOutput
  /** FILTER clause, if any */
  agg_filter: Node
  /** ORDER BY clause, if any */
  agg_order: any[]
  /** OVER clause, if any */
  over: WindowDef
  /** token location, or -1 if unknown */
  location: number
}

/**
 * JsonObjectAgg -
 *		untransformed representation of JSON_OBJECTAGG()
 */
export type JsonObjectAgg = {
  /** common fields */
  constructor?: JsonAggConstructor
  /** object key-value pair */
  arg: JsonKeyValue
  /** skip NULL values? */
  absent_on_null?: boolean
  /** check key uniqueness? */
  unique?: boolean
}

/**
 * JsonArrayAgg -
 *		untransformed representation of JSON_ARRAYAGG()
 */
export type JsonArrayAgg = {
  /** common fields */
  constructor?: JsonAggConstructor
  /** array element expression */
  arg: JsonValueExpr
  /** skip NULL elements? */
  absent_on_null?: boolean
}

/**
 *		RawStmt --- container for any one statement's raw parse tree
 *
 * Parse analysis converts a raw parse tree headed by a RawStmt node into
 * an analyzed statement headed by a Query node.  For optimizable statements,
 * the conversion is complex.  For utility statements, the parser usually just
 * transfers the raw parse tree (sans RawStmt) into the utilityStmt field of
 * the Query node, and all the useful work happens at execution time.
 *
 * stmt_location/stmt_len identify the portion of the source text string
 * containing this raw statement (useful for multi-statement strings).
 *
 * This is irrelevant for query jumbling, as this is not used in parsed
 * queries.
 */
export type RawStmt = {
  /** raw parse tree */
  stmt: Node
  /** start location, or -1 if unknown */
  stmt_location: number
  /** length in bytes; 0 means "rest of string" */
  stmt_len: number
}

/** ----------------------
 *		Insert Statement
 *
 * The source expression is represented by SelectStmt for both the
 * SELECT and VALUES cases.  If selectStmt is NULL, then the query
 * is INSERT ... DEFAULT VALUES.
 * ----------------------
 */
export type InsertStmt = {
  /** relation to insert into */
  relation: RangeVar
  /** optional: names of the target columns */
  cols?: ({ ResTarget: ResTarget })[]
  /** the source SELECT/VALUES, or NULL */
  selectStmt?: ({ SelectStmt: SelectStmt })
  /** ON CONFLICT clause */
  onConflictClause?: OnConflictClause
  /** list of expressions to return */
  returningList?: ({ ResTarget: ResTarget })[]
  /** WITH clause */
  withClause?: WithClause
  /** OVERRIDING clause */
  override: OverridingKind
}

/** ----------------------
 *		Delete Statement
 * ----------------------
 */
export type DeleteStmt = {
  /** relation to delete from */
  relation: RangeVar
  /** optional using clause for more tables */
  usingClause?: ({ RangeSubselect: RangeSubselect } | { RangeVar: RangeVar })[]
  /** qualifications */
  whereClause?: ({ A_Expr: A_Expr } | { BoolExpr: BoolExpr } | { SubLink: SubLink })
  /** list of expressions to return */
  returningList?: ({ ResTarget: ResTarget })[]
  /** WITH clause */
  withClause?: WithClause
}

/** ----------------------
 *		Update Statement
 * ----------------------
 */
export type UpdateStmt = {
  /** relation to update */
  relation: RangeVar
  /** the target list (of ResTarget) */
  targetList: ({ ResTarget: ResTarget })[]
  /** qualifications */
  whereClause?: ({ A_Const: A_Const } | { A_Expr: A_Expr } | { BoolExpr: BoolExpr } | { CurrentOfExpr: CurrentOfExpr } | { NullTest: NullTest } | { SubLink: SubLink })
  /** optional from clause for more tables */
  fromClause?: ({ JoinExpr: JoinExpr } | { RangeFunction: RangeFunction } | { RangeSubselect: RangeSubselect } | { RangeVar: RangeVar })[]
  /** list of expressions to return */
  returningList?: ({ ResTarget: ResTarget })[]
  /** WITH clause */
  withClause?: WithClause
}

/** ----------------------
 *		Merge Statement
 * ----------------------
 */
export type MergeStmt = {
  /** target relation to merge into */
  relation: RangeVar
  /** source relation */
  sourceRelation: ({ JoinExpr: JoinExpr } | { RangeFunction: RangeFunction } | { RangeSubselect: RangeSubselect } | { RangeVar: RangeVar })
  /** join condition between source and target */
  joinCondition: ({ A_Const: A_Const } | { A_Expr: A_Expr } | { BoolExpr: BoolExpr })
  /** list of MergeWhenClause(es) */
  mergeWhenClauses: ({ MergeWhenClause: MergeWhenClause })[]
  /** WITH clause */
  withClause?: WithClause
}

/** ----------------------
 *		Select Statement
 *
 * A "simple" SELECT is represented in the output of gram.y by a single
 * SelectStmt node; so is a VALUES construct.  A query containing set
 * operators (UNION, INTERSECT, EXCEPT) is represented by a tree of SelectStmt
 * nodes, in which the leaf nodes are component SELECTs and the internal nodes
 * represent UNION, INTERSECT, or EXCEPT operators.  Using the same node
 * type for both leaf and internal nodes allows gram.y to stick ORDER BY,
 * LIMIT, etc, clause values into a SELECT statement without worrying
 * whether it is a simple or compound SELECT.
 * ----------------------
 */
export type SelectStmt = {
  /**
	 * These fields are used only in "leaf" SelectStmts.
	 */
  /** NULL, list of DISTINCT ON exprs, or
								 * lcons(NIL,NIL) for all (SELECT DISTINCT) */
  distinctClause?: ({ A_Const: A_Const } | { ColumnRef: ColumnRef })[]
  /** target for SELECT INTO */
  intoClause?: IntoClause
  /** the target list (of ResTarget) */
  targetList?: ({ ResTarget: ResTarget })[]
  /** the FROM clause */
  fromClause?: ({ JoinExpr: JoinExpr } | { RangeFunction: RangeFunction } | { RangeSubselect: RangeSubselect } | { RangeTableFunc: RangeTableFunc } | { RangeTableSample: RangeTableSample } | { RangeVar: RangeVar })[]
  /** WHERE qualification */
  whereClause?: ({ A_Const: A_Const } | { A_Expr: A_Expr } | { BoolExpr: BoolExpr } | { BooleanTest: BooleanTest } | { ColumnRef: ColumnRef } | { FuncCall: FuncCall } | { JsonIsPredicate: JsonIsPredicate } | { NullTest: NullTest } | { SubLink: SubLink })
  /** GROUP BY clauses */
  groupClause?: ({ A_Const: A_Const } | { A_Expr: A_Expr } | { ColumnRef: ColumnRef } | { FuncCall: FuncCall } | { GroupingSet: GroupingSet } | { RowExpr: RowExpr })[]
  /** Is this GROUP BY DISTINCT? */
  groupDistinct?: boolean
  /** HAVING conditional-expression */
  havingClause?: ({ A_Expr: A_Expr } | { BoolExpr: BoolExpr } | { ColumnRef: ColumnRef } | { SubLink: SubLink })
  /** WINDOW window_name AS (...), ... */
  windowClause?: ({ WindowDef: WindowDef })[]
  /**
	 * In a "leaf" node representing a VALUES list, the above fields are all
	 * null, and instead this field is set.  Note that the elements of the
	 * sublists are just expressions, without ResTarget decoration. Also note
	 * that a list element can be DEFAULT (represented as a SetToDefault
	 * node), regardless of the context of the VALUES list. It's up to parse
	 * analysis to reject that where not valid.
	 */
  /** untransformed list of expression lists */
  valuesLists?: List<Expr>[]
  /**
	 * These fields are used in both "leaf" SelectStmts and upper-level
	 * SelectStmts.
	 */
  /** sort clause (a list of SortBy's) */
  sortClause?: ({ SortBy: SortBy })[]
  /** # of result tuples to skip */
  limitOffset?: ({ A_Const: A_Const } | { A_Expr: A_Expr } | { ColumnRef: ColumnRef })
  /** # of result tuples to return */
  limitCount?: ({ A_Const: A_Const } | { A_Expr: A_Expr } | { CaseExpr: CaseExpr } | { FuncCall: FuncCall })
  /** limit type */
  limitOption: LimitOption
  /** FOR UPDATE (list of LockingClause's) */
  lockingClause?: ({ LockingClause: LockingClause })[]
  /** WITH clause */
  withClause?: WithClause
  /**
	 * These fields are used only in upper-level SelectStmts.
	 */
  /** type of set op */
  op: SetOperation
  /** ALL specified? */
  all?: boolean
  /** left child */
  larg?: SelectStmt
  /** right child */
  rarg?: SelectStmt
  /** Eventually add fields for CORRESPONDING spec here */
}

/** ----------------------
 *		Set Operation node for post-analysis query trees
 *
 * After parse analysis, a SELECT with set operations is represented by a
 * top-level Query node containing the leaf SELECTs as subqueries in its
 * range table.  Its setOperations field shows the tree of set operations,
 * with leaf SelectStmt nodes replaced by RangeTblRef nodes, and internal
 * nodes replaced by SetOperationStmt nodes.  Information about the output
 * column types is added, too.  (Note that the child nodes do not necessarily
 * produce these types directly, but we've checked that their output types
 * can be coerced to the output column type.)  Also, if it's not UNION ALL,
 * information about the types' sort/group semantics is provided in the form
 * of a SortGroupClause list (same representation as, eg, DISTINCT).
 * The resolved common column collations are provided too; but note that if
 * it's not UNION ALL, it's okay for a column to not have a common collation,
 * so a member of the colCollations list could be InvalidOid even though the
 * column has a collatable type.
 * ----------------------
 */
export type SetOperationStmt = {
  /** type of set op */
  op: SetOperation
  /** ALL specified? */
  all: boolean
  /** left child */
  larg: Node
  /** right child */
  rarg: Node
  /** Eventually add fields for CORRESPONDING spec here */
  /** Fields derived during parse analysis (irrelevant for query jumbling): */
  /** OID list of output column type OIDs */
  colTypes: any[]
  /** integer list of output column typmods */
  colTypmods: any[]
  /** OID list of output column collation OIDs */
  colCollations: any[]
  /** a list of SortGroupClause's */
  groupClauses: any[]
  /** groupClauses is NIL if UNION ALL, but must be set otherwise */
}

/**
 * RETURN statement (inside SQL function body)
 */
export type ReturnStmt = {
  returnval: ({ A_Expr: A_Expr } | { A_Indirection: A_Indirection } | { BoolExpr: BoolExpr } | { ColumnRef: ColumnRef } | { FuncCall: FuncCall } | { SubLink: SubLink })
}

/** ----------------------
 *		PL/pgSQL Assignment Statement
 *
 * Like SelectStmt, this is transformed into a SELECT Query.
 * However, the targetlist of the result looks more like an UPDATE.
 * ----------------------
 */
export type PLAssignStmt = {
  /** initial column name */
  name: string
  /** subscripts and field names, if any */
  indirection: any[]
  /** number of names to use in ColumnRef */
  nnames: number
  /** the PL/pgSQL expression to assign */
  val: SelectStmt
  /** name's token location, or -1 if unknown */
  location: number
}

/** ----------------------
 *		Create Schema Statement
 *
 * NOTE: the schemaElts list contains raw parsetrees for component statements
 * of the schema, such as CREATE TABLE, GRANT, etc.  These are analyzed and
 * executed after the schema itself is created.
 * ----------------------
 */
export type CreateSchemaStmt = {
  /** the name of the schema to create */
  schemaname?: string
  /** the owner of the created schema */
  authrole?: RoleSpec
  /** schema components (list of parsenodes) */
  schemaElts?: ({ CreateSeqStmt: CreateSeqStmt } | { CreateStmt: CreateStmt } | { IndexStmt: IndexStmt } | { ViewStmt: ViewStmt })[]
  /** just do nothing if schema already exists? */
  if_not_exists?: boolean
}

/** ----------------------
 *	Alter Table
 * ----------------------
 */
export type AlterTableStmt = {
  /** table to work on */
  relation: RangeVar
  /** list of subcommands */
  cmds: ({ AlterTableCmd: AlterTableCmd })[]
  /** type of object */
  objtype: ObjectType
  /** skip error if table missing */
  missing_ok?: boolean
}

/** ----------------------
 *	Alter Table
 * ----------------------
 */
export type ReplicaIdentityStmt = {
  identity_type: string
  name?: string
}

/** ----------------------
 *	Alter Table
 * ----------------------
 */
export type AlterTableCmd = {
  /** Type of table alteration to apply */
  subtype: AlterTableType
  /** column, constraint, or trigger to act on,
								 * or tablespace */
  name?: string
  /** attribute number for columns referenced by
								 * number */
  num?: number
  newowner?: RoleSpec
  /** definition of new column, index,
								 * constraint, or parent table */
  def?: ({ A_Const: A_Const } | { A_Expr: A_Expr } | { ColumnDef: ColumnDef } | { Constraint: Constraint } | { FuncCall: FuncCall } | { Integer: Integer } | { List: List } | { PartitionCmd: PartitionCmd } | { RangeVar: RangeVar } | { ReplicaIdentityStmt: ReplicaIdentityStmt } | { String: String } | { TypeCast: TypeCast })
  /** RESTRICT or CASCADE for DROP cases */
  behavior: DropBehavior
  /** skip error if missing? */
  missing_ok?: boolean
  /** exec-time recursion */
  recurse?: boolean
}

/** ----------------------
 * Alter Collation
 * ----------------------
 */
export type AlterCollationStmt = {
  collname: any[]
}

/** ----------------------
 *	Alter Domain
 *
 * The fields are used in different ways by the different variants of
 * this command.
 * ----------------------
 */
export type AlterDomainStmt = {
  /**------------
								 *	T = alter column default
								 *	N = alter column drop not null
								 *	O = alter column set not null
								 *	C = add constraint
								 *	X = drop constraint
								 *------------
								 */
  subtype: string
  /** domain to work on */
  typeName: ({ String: String })[]
  /** column or constraint name to act on */
  name?: string
  /** definition of default or constraint */
  def?: ({ A_Const: A_Const } | { Constraint: Constraint })
  /** RESTRICT or CASCADE for DROP cases */
  behavior: DropBehavior
  /** skip error if missing? */
  missing_ok?: boolean
}

/** ----------------------
 *		Grant|Revoke Statement
 * ----------------------
 */
export type GrantStmt = {
  /** true = GRANT, false = REVOKE */
  is_grant?: boolean
  /** type of the grant target */
  targtype: GrantTargetType
  /** kind of object being operated on */
  objtype: ObjectType
  /** list of RangeVar nodes, ObjectWithArgs
								 * nodes, or plain names (as String values) */
  objects: ({ ObjectWithArgs: ObjectWithArgs } | { RangeVar: RangeVar } | { String: String })[]
  /** list of AccessPriv nodes */
  privileges?: ({ AccessPriv: AccessPriv })[]
  /** privileges == NIL denotes ALL PRIVILEGES */
  /** list of RoleSpec nodes */
  grantees: ({ RoleSpec: RoleSpec })[]
  /** grant or revoke grant option */
  grant_option?: boolean
  grantor?: RoleSpec
  /** drop behavior (for REVOKE) */
  behavior: DropBehavior
}

/**
 * ObjectWithArgs represents a function/procedure/operator name plus parameter
 * identification.
 *
 * objargs includes only the types of the input parameters of the object.
 * In some contexts, that will be all we have, and it's enough to look up
 * objects according to the traditional Postgres rules (i.e., when only input
 * arguments matter).
 *
 * objfuncargs, if not NIL, carries the full specification of the parameter
 * list, including parameter mode annotations.
 *
 * Some grammar productions can set args_unspecified = true instead of
 * providing parameter info.  In this case, lookup will succeed only if
 * the object name is unique.  Note that otherwise, NIL parameter lists
 * mean zero arguments.
 */
export type ObjectWithArgs = {
  /** qualified name of function/operator */
  objname: QualifiedName
  /** list of Typename nodes (input args only) */
  objargs?: ({ TypeName: TypeName })[]
  /** list of FunctionParameter nodes */
  objfuncargs?: ({ FunctionParameter: FunctionParameter })[]
  /** argument list was omitted? */
  args_unspecified?: boolean
}

/**
 * An access privilege, with optional list of column names
 * priv_name == NULL denotes ALL PRIVILEGES (only used with a column list)
 * cols == NIL denotes "all columns"
 * Note that simple "ALL PRIVILEGES" is represented as a NIL list, not
 * an AccessPriv with both fields null.
 */
export type AccessPriv = {
  /** string name of privilege */
  priv_name: string
  /** list of String */
  cols?: ({ String: String })[]
}

/** ----------------------
 *		Grant/Revoke Role Statement
 *
 * Note: because of the parsing ambiguity with the GRANT <privileges>
 * statement, granted_roles is a list of AccessPriv; the execution code
 * should complain if any column lists appear.  grantee_roles is a list
 * of role names, as String values.
 * ----------------------
 */
export type GrantRoleStmt = {
  /** list of roles to be granted/revoked */
  granted_roles: ({ AccessPriv: AccessPriv })[]
  /** list of member roles to add/delete */
  grantee_roles: ({ RoleSpec: RoleSpec })[]
  /** true = GRANT, false = REVOKE */
  is_grant?: boolean
  /** options e.g. WITH GRANT OPTION */
  opt?: ({ DefElem: DefElem })[]
  /** set grantor to other than current role */
  grantor?: RoleSpec
  /** drop behavior (for REVOKE) */
  behavior: DropBehavior
}

/** ----------------------
 *	Alter Default Privileges Statement
 * ----------------------
 */
export type AlterDefaultPrivilegesStmt = {
  /** list of DefElem */
  options: ({ DefElem: DefElem })[]
  /** GRANT/REVOKE action (with objects=NIL) */
  action: GrantStmt
}

/** ----------------------
 *		Copy Statement
 *
 * We support "COPY relation FROM file", "COPY relation TO file", and
 * "COPY (query) TO file".  In any given CopyStmt, exactly one of "relation"
 * and "query" must be non-NULL.
 * ----------------------
 */
export type CopyStmt = {
  /** the relation to copy */
  relation?: RangeVar
  /** the query (SELECT or DML statement with
								 * RETURNING) to copy, as a raw parse tree */
  query?: ({ InsertStmt: InsertStmt } | { MergeStmt: MergeStmt } | { SelectStmt: SelectStmt })
  /** List of column names (as Strings), or NIL
								 * for all columns */
  attlist?: ({ String: String })[]
  /** TO or FROM */
  is_from?: boolean
  /** is 'filename' a program to popen? */
  is_program?: boolean
  /** filename, or NULL for STDIN/STDOUT */
  filename?: string
  /** List of DefElem nodes */
  options?: ({ DefElem: DefElem })[]
  /** WHERE condition (or NULL) */
  whereClause?: Node
}

export type VariableSetStmt = {
  kind: VariableSetKind
  /** variable to be set */
  name?: string
  /** List of A_Const nodes */
  args?: ({ A_Const: A_Const } | { DefElem: DefElem })[]
  /** SET LOCAL? */
  is_local?: boolean
}

/** ----------------------
 * Show Statement
 * ----------------------
 */
export type VariableShowStmt = {
  name: string
}

/** ----------------------
 *		Create Table Statement
 *
 * NOTE: in the raw gram.y output, ColumnDef and Constraint nodes are
 * intermixed in tableElts, and constraints is NIL.  After parse analysis,
 * tableElts contains just ColumnDefs, and constraints contains just
 * Constraint nodes (in fact, only CONSTR_CHECK nodes, in the present
 * implementation).
 * ----------------------
 */
export type CreateStmt = {
  /** relation to create */
  relation: RangeVar
  /** column definitions (list of ColumnDef) */
  tableElts?: ({ ColumnDef: ColumnDef } | { Constraint: Constraint } | { TableLikeClause: TableLikeClause })[]
  /** relations to inherit from (list of
								 * RangeVar) */
  inhRelations?: ({ RangeVar: RangeVar })[]
  /** FOR VALUES clause */
  partbound?: PartitionBoundSpec
  /** PARTITION BY clause */
  partspec?: PartitionSpec
  /** OF typename */
  ofTypename?: TypeName
  /** constraints (list of Constraint nodes) */
  constraints?: any[]
  /** options from WITH clause */
  options?: ({ DefElem: DefElem })[]
  /** what do we do at COMMIT? */
  oncommit: OnCommitAction
  /** table space to use, or NULL */
  tablespacename?: string
  /** table access method */
  accessMethod?: string
  /** just do nothing if it already exists? */
  if_not_exists?: boolean
}

/** Foreign key matchtype codes */
export type Constraint = {
  /** see above */
  contype: ConstrType
  /** Fields used for most/all constraint types: */
  /** Constraint name, or NULL if unnamed */
  conname?: string
  /** DEFERRABLE? */
  deferrable?: boolean
  /** INITIALLY DEFERRED? */
  initdeferred?: boolean
  /** token location, or -1 if unknown */
  location?: number
  /** Fields used for constraints with expressions (CHECK and DEFAULT): */
  /** is constraint non-inheritable? */
  is_no_inherit?: boolean
  /** expr, as untransformed parse tree */
  raw_expr?: Expr
  /** expr, as nodeToString representation */
  cooked_expr?: string
  /** ALWAYS or BY DEFAULT */
  generated_when?: string
  /** Fields used for unique constraints (UNIQUE and PRIMARY KEY): */
  /** null treatment for UNIQUE constraints */
  nulls_not_distinct?: boolean
  /** String nodes naming referenced key
								 * column(s) */
  keys?: ({ String: String })[]
  /** String nodes naming referenced nonkey
								 * column(s) */
  including?: ({ String: String })[]
  /** Fields used for EXCLUSION constraints: */
  /** list of (IndexElem, operator name) pairs */
  exclusions?: List<{ IndexElem: IndexElem } | { List: List }>[]
  /** Fields used for index constraints (UNIQUE, PRIMARY KEY, EXCLUSION): */
  /** options from WITH clause */
  options?: ({ DefElem: DefElem })[]
  /** existing index to use; otherwise NULL */
  indexname?: string
  /** index tablespace; NULL for default */
  indexspace?: string
  /** reset default_tablespace prior to
										 * creating the index */
  reset_default_tblspc?: boolean
  /** These could be, but currently are not, used for UNIQUE/PKEY: */
  /** index access method; NULL for default */
  access_method?: string
  /** partial index predicate */
  where_clause?: Node
  /** Fields used for FOREIGN KEY constraints: */
  /** Primary key table */
  pktable?: RangeVar
  /** Attributes of foreign key */
  fk_attrs?: ({ String: String })[]
  /** Corresponding attrs in PK table */
  pk_attrs?: ({ String: String })[]
  /** FULL, PARTIAL, SIMPLE */
  fk_matchtype?: string
  /** ON UPDATE action */
  fk_upd_action?: string
  /** ON DELETE action */
  fk_del_action?: string
  /** ON DELETE SET NULL/DEFAULT (col1, col2) */
  fk_del_set_cols?: any[]
  /** pg_constraint.conpfeqop of my former self */
  old_conpfeqop?: any[]
  /** pg_constraint.confrelid of my former
									 * self */
  old_pktable_oid?: Oid
  /** Fields used for constraints that allow a NOT VALID specification */
  /** skip validation of existing rows? */
  skip_validation?: boolean
  /** mark the new constraint as valid? */
  initially_valid?: boolean
}

/** ----------------------
 *		Create/Drop Table Space Statements
 * ----------------------
 */
export type CreateTableSpaceStmt = {
  tablespacename: string
  owner?: RoleSpec
  location: string
  options?: ({ DefElem: DefElem })[]
}

/** ----------------------
 *		Create/Drop Table Space Statements
 * ----------------------
 */
export type DropTableSpaceStmt = {
  tablespacename: string
  /** skip error if missing? */
  missing_ok?: boolean
}

export type AlterTableSpaceOptionsStmt = {
  tablespacename: string
  options: ({ DefElem: DefElem })[]
  isReset?: boolean
}

export type AlterTableMoveAllStmt = {
  orig_tablespacename: string
  /** Object type to move */
  objtype: ObjectType
  /** List of roles to move objects of */
  roles?: any[]
  new_tablespacename: string
  nowait?: boolean
}

/** ----------------------
 *		Create/Alter Extension Statements
 * ----------------------
 */
export type CreateExtensionStmt = {
  extname: string
  /** just do nothing if it already exists? */
  if_not_exists: boolean
  /** List of DefElem nodes */
  options: any[]
}

/** Only used for ALTER EXTENSION UPDATE; later might need an action field */
export type AlterExtensionStmt = {
  extname: string
  /** List of DefElem nodes */
  options: any[]
}

/** ----------------------
 *		Create/Alter Extension Statements
 * ----------------------
 */
export type AlterExtensionContentsStmt = {
  /** Extension's name */
  extname: string
  /** +1 = add object, -1 = drop object */
  action: number
  /** Object's type */
  objtype: ObjectType
  /** Qualified name of the object */
  object: Node
}

/** ----------------------
 *		Create/Alter FOREIGN DATA WRAPPER Statements
 * ----------------------
 */
export type CreateFdwStmt = {
  /** foreign-data wrapper name */
  fdwname: string
  /** HANDLER/VALIDATOR options */
  func_options?: ({ DefElem: DefElem })[]
  /** generic options to FDW */
  options?: ({ DefElem: DefElem })[]
}

/** ----------------------
 *		Create/Alter FOREIGN DATA WRAPPER Statements
 * ----------------------
 */
export type AlterFdwStmt = {
  /** foreign-data wrapper name */
  fdwname: string
  /** HANDLER/VALIDATOR options */
  func_options?: ({ DefElem: DefElem })[]
  /** generic options to FDW */
  options?: ({ DefElem: DefElem })[]
}

/** ----------------------
 *		Create/Alter FOREIGN SERVER Statements
 * ----------------------
 */
export type CreateForeignServerStmt = {
  /** server name */
  servername: string
  /** optional server type */
  servertype?: string
  /** optional server version */
  version?: string
  /** FDW name */
  fdwname: string
  /** just do nothing if it already exists? */
  if_not_exists?: boolean
  /** generic options to server */
  options?: ({ DefElem: DefElem })[]
}

/** ----------------------
 *		Create/Alter FOREIGN SERVER Statements
 * ----------------------
 */
export type AlterForeignServerStmt = {
  /** server name */
  servername: string
  /** optional server version */
  version?: string
  /** generic options to server */
  options?: ({ DefElem: DefElem })[]
  /** version specified */
  has_version?: boolean
}

/** ----------------------
 *		Create FOREIGN TABLE Statement
 * ----------------------
 */
export type CreateForeignTableStmt = {
  base: CreateStmt
  servername: string
  options?: ({ DefElem: DefElem })[]
}

/** ----------------------
 *		Create/Drop USER MAPPING Statements
 * ----------------------
 */
export type CreateUserMappingStmt = {
  /** user role */
  user: RoleSpec
  /** server name */
  servername: string
  /** just do nothing if it already exists? */
  if_not_exists?: boolean
  /** generic options to server */
  options?: ({ DefElem: DefElem })[]
}

/** ----------------------
 *		Create/Drop USER MAPPING Statements
 * ----------------------
 */
export type AlterUserMappingStmt = {
  /** user role */
  user: RoleSpec
  /** server name */
  servername: string
  /** generic options to server */
  options: ({ DefElem: DefElem })[]
}

/** ----------------------
 *		Create/Drop USER MAPPING Statements
 * ----------------------
 */
export type DropUserMappingStmt = {
  /** user role */
  user: RoleSpec
  /** server name */
  servername: string
  /** ignore missing mappings */
  missing_ok?: boolean
}

export type ImportForeignSchemaStmt = {
  /** FDW server name */
  server_name: string
  /** remote schema name to query */
  remote_schema: string
  /** local schema to create objects in */
  local_schema: string
  /** type of table list */
  list_type: ImportForeignSchemaType
  /** List of RangeVar */
  table_list?: ({ RangeVar: RangeVar })[]
  /** list of options to pass to FDW */
  options?: ({ DefElem: DefElem })[]
}

/**----------------------
 *		Create POLICY Statement
 *----------------------
 */
export type CreatePolicyStmt = {
  /** Policy's name */
  policy_name: string
  /** the table name the policy applies to */
  table: RangeVar
  /** the command name the policy applies to */
  cmd_name: string
  /** restrictive or permissive policy */
  permissive?: boolean
  /** the roles associated with the policy */
  roles: ({ RoleSpec: RoleSpec })[]
  /** the policy's condition */
  qual: ({ A_Const: A_Const } | { A_Expr: A_Expr } | { BoolExpr: BoolExpr })
  /** the policy's WITH CHECK condition. */
  with_check?: Node
}

/**----------------------
 *		Alter POLICY Statement
 *----------------------
 */
export type AlterPolicyStmt = {
  /** Policy's name */
  policy_name: string
  /** the table name the policy applies to */
  table: RangeVar
  /** the roles associated with the policy */
  roles?: ({ RoleSpec: RoleSpec })[]
  /** the policy's condition */
  qual: ({ A_Const: A_Const })
  /** the policy's WITH CHECK condition. */
  with_check?: Node
}

/**----------------------
 *		Create ACCESS METHOD Statement
 *----------------------
 */
export type CreateAmStmt = {
  /** access method name */
  amname: string
  /** handler function name */
  handler_name: QualifiedName
  /** type of access method */
  amtype: string
}

/** ----------------------
 *		Create TRIGGER Statement
 * ----------------------
 */
export type CreateTrigStmt = {
  /** replace trigger if already exists */
  replace?: boolean
  /** This is a constraint trigger */
  isconstraint?: boolean
  /** TRIGGER's name */
  trigname: string
  /** relation trigger is on */
  relation: RangeVar
  /** qual. name of function to call */
  funcname: QualifiedName
  /** list of String or NIL */
  args?: ({ String: String })[]
  /** ROW/STATEMENT */
  row?: boolean
  /** timing uses the TRIGGER_TYPE bits defined in catalog/pg_trigger.h */
  /** BEFORE, AFTER, or INSTEAD */
  timing?: number
  /** events uses the TRIGGER_TYPE bits defined in catalog/pg_trigger.h */
  /** "OR" of INSERT/UPDATE/DELETE/TRUNCATE */
  events: number
  /** column names, or NIL for all columns */
  columns?: any[]
  /** qual expression, or NULL if none */
  whenClause?: Node
  /** explicitly named transition data */
  /** TriggerTransition nodes, or NIL if none */
  transitionRels?: ({ TriggerTransition: TriggerTransition })[]
  /** The remaining fields are only used for constraint triggers */
  /** [NOT] DEFERRABLE */
  deferrable?: boolean
  /** INITIALLY {DEFERRED|IMMEDIATE} */
  initdeferred?: boolean
  /** opposite relation, if RI trigger */
  constrrel?: RangeVar
}

/** ----------------------
 *		Create EVENT TRIGGER Statement
 * ----------------------
 */
export type CreateEventTrigStmt = {
  /** TRIGGER's name */
  trigname: string
  /** event's identifier */
  eventname: string
  /** list of DefElems indicating filtering */
  whenclause?: ({ DefElem: DefElem })[]
  /** qual. name of function to call */
  funcname: QualifiedName
}

/** ----------------------
 *		Alter EVENT TRIGGER Statement
 * ----------------------
 */
export type AlterEventTrigStmt = {
  /** TRIGGER's name */
  trigname: string
  /** trigger's firing configuration WRT
								 * session_replication_role */
  tgenabled: string
}

/** ----------------------
 *		Create LANGUAGE Statements
 * ----------------------
 */
export type CreatePLangStmt = {
  /** T => replace if already exists */
  replace?: boolean
  /** PL name */
  plname: string
  /** PL call handler function (qual. name) */
  plhandler: QualifiedName
  /** optional inline function (qual. name) */
  plinline?: QualifiedName
  /** optional validator function (qual. name) */
  plvalidator?: QualifiedName
  /** PL is trusted */
  pltrusted?: boolean
}

/** ----------------------
 *	Create/Alter/Drop Role Statements
 *
 * Note: these node types are also used for the backwards-compatible
 * Create/Alter/Drop User/Group statements.  In the ALTER and DROP cases
 * there's really no need to distinguish what the original spelling was,
 * but for CREATE we mark the type because the defaults vary.
 * ----------------------
 */
export type CreateRoleStmt = {
  /** ROLE/USER/GROUP */
  stmt_type: RoleStmtType
  /** role name */
  role: string
  /** List of DefElem nodes */
  options?: ({ DefElem: DefElem })[]
}

/** ----------------------
 *	Create/Alter/Drop Role Statements
 *
 * Note: these node types are also used for the backwards-compatible
 * Create/Alter/Drop User/Group statements.  In the ALTER and DROP cases
 * there's really no need to distinguish what the original spelling was,
 * but for CREATE we mark the type because the defaults vary.
 * ----------------------
 */
export type AlterRoleStmt = {
  /** role */
  role: RoleSpec
  /** List of DefElem nodes */
  options: ({ DefElem: DefElem })[]
  /** +1 = add members, -1 = drop members */
  action: number
}

/** ----------------------
 *	Create/Alter/Drop Role Statements
 *
 * Note: these node types are also used for the backwards-compatible
 * Create/Alter/Drop User/Group statements.  In the ALTER and DROP cases
 * there's really no need to distinguish what the original spelling was,
 * but for CREATE we mark the type because the defaults vary.
 * ----------------------
 */
export type AlterRoleSetStmt = {
  /** role */
  role: RoleSpec
  /** database name, or NULL */
  database?: string
  /** SET or RESET subcommand */
  setstmt: VariableSetStmt
}

/** ----------------------
 *	Create/Alter/Drop Role Statements
 *
 * Note: these node types are also used for the backwards-compatible
 * Create/Alter/Drop User/Group statements.  In the ALTER and DROP cases
 * there's really no need to distinguish what the original spelling was,
 * but for CREATE we mark the type because the defaults vary.
 * ----------------------
 */
export type DropRoleStmt = {
  /** List of roles to remove */
  roles: ({ RoleSpec: RoleSpec })[]
  /** skip error if a role is missing? */
  missing_ok?: boolean
}

/** ----------------------
 *		{Create|Alter} SEQUENCE Statement
 * ----------------------
 */
export type CreateSeqStmt = {
  /** the sequence to create */
  sequence: RangeVar
  options?: ({ DefElem: DefElem })[]
  /** ID of owner, or InvalidOid for default */
  ownerId?: Oid
  for_identity?: boolean
  /** just do nothing if it already exists? */
  if_not_exists?: boolean
}

/** ----------------------
 *		{Create|Alter} SEQUENCE Statement
 * ----------------------
 */
export type AlterSeqStmt = {
  /** the sequence to alter */
  sequence: RangeVar
  options: ({ DefElem: DefElem })[]
  for_identity?: boolean
  /** skip error if a role is missing? */
  missing_ok?: boolean
}

/** ----------------------
 *		Create {Aggregate|Operator|Type} Statement
 * ----------------------
 */
export type DefineStmt = {
  /** aggregate, operator, type */
  kind: ObjectType
  /** hack to signal old CREATE AGG syntax */
  oldstyle?: boolean
  /** qualified name (list of String) */
  defnames: QualifiedName
  /** a list of TypeName (if needed) */
  args?: List<{ FunctionParameter: FunctionParameter }>[]
  /** a list of DefElem */
  definition?: ({ DefElem: DefElem })[]
  /** just do nothing if it already exists? */
  if_not_exists?: boolean
  /** replace if already exists? */
  replace?: boolean
}

/** ----------------------
 *		Create Domain Statement
 * ----------------------
 */
export type CreateDomainStmt = {
  /** qualified name (list of String) */
  domainname: QualifiedName
  /** the base type */
  typeName: TypeName
  /** untransformed COLLATE spec, if any */
  collClause?: CollateClause
  /** constraints (list of Constraint nodes) */
  constraints?: ({ Constraint: Constraint })[]
}

/** ----------------------
 *		Create Operator Class Statement
 * ----------------------
 */
export type CreateOpClassStmt = {
  /** qualified name (list of String) */
  opclassname: QualifiedName
  /** qualified name (ditto); NIL if omitted */
  opfamilyname?: QualifiedName
  /** name of index AM opclass is for */
  amname: string
  /** datatype of indexed column */
  datatype: TypeName
  /** List of CreateOpClassItem nodes */
  items: ({ CreateOpClassItem: CreateOpClassItem })[]
  /** Should be marked as default for type? */
  isDefault?: boolean
}

/** ----------------------
 *		Create Operator Class Statement
 * ----------------------
 */
export type CreateOpClassItem = {
  /** see codes above */
  itemtype: number
  /** operator or function name and args */
  name?: ObjectWithArgs
  /** strategy num or support proc num */
  number?: number
  /** only used for ordering operators */
  order_family?: any[]
  /** amproclefttype/amprocrighttype or
								 * amoplefttype/amoprighttype */
  class_args?: ({ TypeName: TypeName })[]
  /** fields used for a storagetype item: */
  /** datatype stored in index */
  storedtype?: TypeName
}

/** ----------------------
 *		Create Operator Family Statement
 * ----------------------
 */
export type CreateOpFamilyStmt = {
  /** qualified name (list of String) */
  opfamilyname: QualifiedName
  /** name of index AM opfamily is for */
  amname: string
}

/** ----------------------
 *		Alter Operator Family Statement
 * ----------------------
 */
export type AlterOpFamilyStmt = {
  /** qualified name (list of String) */
  opfamilyname: QualifiedName
  /** name of index AM opfamily is for */
  amname: string
  /** ADD or DROP the items? */
  isDrop?: boolean
  /** List of CreateOpClassItem nodes */
  items: ({ CreateOpClassItem: CreateOpClassItem })[]
}

/** ----------------------
 *		Drop Table|Sequence|View|Index|Type|Domain|Conversion|Schema Statement
 * ----------------------
 */
export type DropStmt = {
  /** list of names */
  objects: List<{ String: String } | { TypeName: TypeName }>[]
  /** object type */
  removeType: ObjectType
  /** RESTRICT or CASCADE behavior */
  behavior: DropBehavior
  /** skip error if object is missing? */
  missing_ok?: boolean
  /** drop index concurrently? */
  concurrent?: boolean
}

/** ----------------------
 *				Truncate Table Statement
 * ----------------------
 */
export type TruncateStmt = {
  /** relations (RangeVars) to be truncated */
  relations: ({ RangeVar: RangeVar })[]
  /** restart owned sequences? */
  restart_seqs?: boolean
  /** RESTRICT or CASCADE behavior */
  behavior: DropBehavior
}

/** ----------------------
 *				Comment On Statement
 * ----------------------
 */
export type CommentStmt = {
  /** Object's type */
  objtype: ObjectType
  /** Qualified name of the object */
  object: ({ Integer: Integer } | { List: List } | { ObjectWithArgs: ObjectWithArgs } | { String: String } | { TypeName: TypeName })
  /** Comment to insert, or NULL to remove */
  comment?: string
}

/** ----------------------
 *				SECURITY LABEL Statement
 * ----------------------
 */
export type SecLabelStmt = {
  /** Object's type */
  objtype: ObjectType
  /** Qualified name of the object */
  object: ({ List: List } | { String: String })
  /** Label provider (or NULL) */
  provider?: string
  /** New security label to be assigned */
  label: string
}

/** these planner-control flags do not correspond to any SQL grammar: */
export type DeclareCursorStmt = {
  /** name of the portal (cursor) */
  portalname: string
  /** bitmask of options (see above) */
  options: number
  /** the query (see comments above) */
  query: ({ SelectStmt: SelectStmt })
}

/** ----------------------
 *		Close Portal Statement
 * ----------------------
 */
export type ClosePortalStmt = {
  /** name of the portal (cursor) */
  portalname: string
  /** NULL means CLOSE ALL */
}

/** ----------------------
 *		Fetch Statement (also Move)
 * ----------------------
 */
export type FetchStmt = {
  /** see above */
  direction: FetchDirection
  /** number of rows, or position argument */
  howMany?: number
  /** name of portal (cursor) */
  portalname: string
  /** true if MOVE */
  ismove?: boolean
}

/** ----------------------
 *		Create Index Statement
 *
 * This represents creation of an index and/or an associated constraint.
 * If isconstraint is true, we should create a pg_constraint entry along
 * with the index.  But if indexOid isn't InvalidOid, we are not creating an
 * index, just a UNIQUE/PKEY constraint using an existing index.  isconstraint
 * must always be true in this case, and the fields describing the index
 * properties are empty.
 * ----------------------
 */
export type IndexStmt = {
  /** name of new index, or NULL for default */
  idxname?: string
  /** relation to build index on */
  relation: RangeVar
  /** name of access method (eg. btree) */
  accessMethod: string
  /** tablespace, or NULL for default */
  tableSpace?: string
  /** columns to index: a list of IndexElem */
  indexParams: ({ IndexElem: IndexElem })[]
  /** additional columns to index: a list
										 * of IndexElem */
  indexIncludingParams?: ({ IndexElem: IndexElem })[]
  /** WITH clause options: a list of DefElem */
  options?: ({ DefElem: DefElem })[]
  /** qualification (partial-index predicate) */
  whereClause?: ({ A_Expr: A_Expr } | { BoolExpr: BoolExpr } | { NullTest: NullTest })
  /** exclusion operator names, or NIL if none */
  excludeOpNames?: any[]
  /** comment to apply to index, or NULL */
  idxcomment?: string
  /** OID of an existing index, if any */
  indexOid?: Oid
  /** relfilenumber of existing storage, if any */
  oldNumber?: number
  /** rd_createSubid of oldNumber */
  oldCreateSubid?: SubTransactionId
  /** rd_firstRelfilelocatorSubid
													 * of oldNumber */
  oldFirstRelfilelocatorSubid?: SubTransactionId
  /** is index unique? */
  unique?: boolean
  /** null treatment for UNIQUE constraints */
  nulls_not_distinct?: boolean
  /** is index a primary key? */
  primary?: boolean
  /** is it for a pkey/unique constraint? */
  isconstraint?: boolean
  /** is the constraint DEFERRABLE? */
  deferrable?: boolean
  /** is the constraint INITIALLY DEFERRED? */
  initdeferred?: boolean
  /** true when transformIndexStmt is finished */
  transformed?: boolean
  /** should this be a concurrent index build? */
  concurrent?: boolean
  /** just do nothing if index already exists? */
  if_not_exists?: boolean
  /** reset default_tablespace prior to
										 * executing */
  reset_default_tblspc?: boolean
}

/** ----------------------
 *		Create Statistics Statement
 * ----------------------
 */
export type CreateStatsStmt = {
  /** qualified name (list of String) */
  defnames: QualifiedName
  /** stat types (list of String) */
  stat_types?: ({ String: String })[]
  /** expressions to build statistics on */
  exprs: ({ StatsElem: StatsElem })[]
  /** rels to build stats on (list of RangeVar) */
  relations: ({ RangeVar: RangeVar })[]
  /** comment to apply to stats, or NULL */
  stxcomment?: string
  /** true when transformStatsStmt is finished */
  transformed?: boolean
  /** do nothing if stats name already exists */
  if_not_exists?: boolean
}

/**
 * StatsElem - statistics parameters (used in CREATE STATISTICS)
 *
 * For a plain attribute, 'name' is the name of the referenced table column
 * and 'expr' is NULL.  For an expression, 'name' is NULL and 'expr' is the
 * expression tree.
 */
export type StatsElem = {
  /** name of attribute to index, or NULL */
  name?: string
  /** expression to index, or NULL */
  expr?: Expr
}

/** ----------------------
 *		Alter Statistics Statement
 * ----------------------
 */
export type AlterStatsStmt = {
  /** qualified name (list of String) */
  defnames: QualifiedName
  /** statistics target */
  stxstattarget?: number
  /** skip error if statistics object is missing */
  missing_ok?: boolean
}

/** ----------------------
 *		Create Function Statement
 * ----------------------
 */
export type CreateFunctionStmt = {
  /** it's really CREATE PROCEDURE */
  is_procedure?: boolean
  /** T => replace if already exists */
  replace?: boolean
  /** qualified name of function to create */
  funcname: QualifiedName
  /** a list of FunctionParameter */
  parameters?: ({ FunctionParameter: FunctionParameter })[]
  /** the return type */
  returnType?: TypeName
  /** a list of DefElem */
  options?: ({ DefElem: DefElem })[]
  sql_body?: ({ List: List } | { ReturnStmt: ReturnStmt })
}

/** ----------------------
 *		Create Function Statement
 * ----------------------
 */
export type FunctionParameter = {
  /** parameter name, or NULL if not given */
  name?: string
  /** TypeName for parameter type */
  argType: TypeName
  /** IN/OUT/etc */
  mode: FunctionParameterMode
  /** raw default expr, or NULL if not given */
  defexpr?: Expr
}

/** ----------------------
 *		Create Function Statement
 * ----------------------
 */
export type AlterFunctionStmt = {
  objtype: ObjectType
  /** name and args of function */
  func: ObjectWithArgs
  /** list of DefElem */
  actions: ({ DefElem: DefElem })[]
}

/** ----------------------
 *		DO Statement
 *
 * DoStmt is the raw parser output, InlineCodeBlock is the execution-time API
 * ----------------------
 */
export type DoStmt = {
  /** List of DefElem nodes */
  args: ({ DefElem: DefElem })[]
}

/** ----------------------
 *		DO Statement
 *
 * DoStmt is the raw parser output, InlineCodeBlock is the execution-time API
 * ----------------------
 */
export type InlineCodeBlock = {
  /** source text of anonymous code block */
  source_text: string
  /** OID of selected language */
  langOid: Oid
  /** trusted property of the language */
  langIsTrusted: boolean
  /** atomic execution context */
  atomic: boolean
}

/** ----------------------
 *		CALL statement
 *
 * OUT-mode arguments are removed from the transformed funcexpr.  The outargs
 * list contains copies of the expressions for all output arguments, in the
 * order of the procedure's declared arguments.  (outargs is never evaluated,
 * but is useful to the caller as a reference for what to assign to.)
 * The transformed call state is not relevant in the query jumbling, only the
 * function call is.
 * ----------------------
 */
export type CallStmt = {
  /** from the parser */
  funccall: FuncCall
  /** transformed call, with only input args */
  funcexpr?: FuncExpr
  /** transformed output-argument expressions */
  outargs?: any[]
}

export type CallContext = {
  atomic: boolean
}

/** ----------------------
 *		Alter Object Rename Statement
 * ----------------------
 */
export type RenameStmt = {
  /** OBJECT_TABLE, OBJECT_COLUMN, etc */
  renameType: ObjectType
  /** if column name, associated relation type */
  relationType: ObjectType
  /** in case it's a table */
  relation?: RangeVar
  /** in case it's some other object */
  object?: ({ List: List } | { ObjectWithArgs: ObjectWithArgs } | { String: String })
  /** name of contained object (column, rule,
								 * trigger, etc) */
  subname?: string
  /** the new name */
  newname: string
  /** RESTRICT or CASCADE behavior */
  behavior: DropBehavior
  /** skip error if missing? */
  missing_ok?: boolean
}

/** ----------------------
 * ALTER object DEPENDS ON EXTENSION extname
 * ----------------------
 */
export type AlterObjectDependsStmt = {
  /** OBJECT_FUNCTION, OBJECT_TRIGGER, etc */
  objectType: ObjectType
  /** in case a table is involved */
  relation: RangeVar
  /** name of the object */
  object: Node
  /** extension name */
  extname: String
  /** set true to remove dep rather than add */
  remove: boolean
}

/** ----------------------
 *		ALTER object SET SCHEMA Statement
 * ----------------------
 */
export type AlterObjectSchemaStmt = {
  /** OBJECT_TABLE, OBJECT_TYPE, etc */
  objectType: ObjectType
  /** in case it's a table */
  relation?: RangeVar
  /** in case it's some other object */
  object: ({ List: List } | { ObjectWithArgs: ObjectWithArgs })
  /** the new schema */
  newschema: string
  /** skip error if missing? */
  missing_ok?: boolean
}

/** ----------------------
 *		Alter Object Owner Statement
 * ----------------------
 */
export type AlterOwnerStmt = {
  /** OBJECT_TABLE, OBJECT_TYPE, etc */
  objectType: ObjectType
  /** in case it's a table */
  relation?: RangeVar
  /** in case it's some other object */
  object: ({ List: List } | { ObjectWithArgs: ObjectWithArgs } | { String: String })
  /** the new owner */
  newowner: RoleSpec
}

/** ----------------------
 *		Alter Operator Set ( this-n-that )
 * ----------------------
 */
export type AlterOperatorStmt = {
  /** operator name and argument types */
  opername: ObjectWithArgs
  /** List of DefElem nodes */
  options: ({ DefElem: DefElem })[]
}

/** ------------------------
 *		Alter Type Set ( this-n-that )
 * ------------------------
 */
export type AlterTypeStmt = {
  /** type name (possibly qualified) */
  typeName: QualifiedName
  /** List of DefElem nodes */
  options: ({ DefElem: DefElem })[]
}

/** ----------------------
 *		Create Rule Statement
 * ----------------------
 */
export type RuleStmt = {
  /** relation the rule is for */
  relation: RangeVar
  /** name of the rule */
  rulename: string
  /** qualifications */
  whereClause?: ({ A_Expr: A_Expr } | { BoolExpr: BoolExpr } | { SubLink: SubLink })
  /** SELECT, INSERT, etc */
  event: CmdType
  /** is a 'do instead'? */
  instead?: boolean
  /** the action statements */
  actions?: ({ DeleteStmt: DeleteStmt } | { InsertStmt: InsertStmt } | { SelectStmt: SelectStmt } | { UpdateStmt: UpdateStmt })[]
  /** OR REPLACE */
  replace?: boolean
}

/** ----------------------
 *		Notify Statement
 * ----------------------
 */
export type NotifyStmt = {
  /** condition name to notify */
  conditionname: string
  /** the payload string, or NULL if none */
  payload?: string
}

/** ----------------------
 *		Listen Statement
 * ----------------------
 */
export type ListenStmt = {
  /** condition name to listen on */
  conditionname: string
}

/** ----------------------
 *		Unlisten Statement
 * ----------------------
 */
export type UnlistenStmt = {
  /** name to unlisten on, or NULL for all */
  conditionname?: string
}

/** ----------------------
 *		{Begin|Commit|Rollback} Transaction Statement
 * ----------------------
 */
export type TransactionStmt = {
  /** see above */
  kind: TransactionStmtKind
  /** for BEGIN/START commands */
  options?: ({ DefElem: DefElem })[]
  /** for savepoint commands */
  savepoint_name?: string
  /** for two-phase-commit related commands */
  gid?: string
  /** AND CHAIN option */
  chain?: boolean
}

/** ----------------------
 *		Create Type Statement, composite types
 * ----------------------
 */
export type CompositeTypeStmt = {
  /** the composite type to be created */
  typevar: RangeVar
  /** list of ColumnDef nodes */
  coldeflist: ({ ColumnDef: ColumnDef })[]
}

/** ----------------------
 *		Create Type Statement, enum types
 * ----------------------
 */
export type CreateEnumStmt = {
  /** qualified name (list of String) */
  typeName: QualifiedName
  /** enum values (list of String) */
  vals: ({ String: String })[]
}

/** ----------------------
 *		Create Type Statement, range types
 * ----------------------
 */
export type CreateRangeStmt = {
  /** qualified name (list of String) */
  typeName: QualifiedName
  /** range parameters (list of DefElem) */
  params: ({ DefElem: DefElem })[]
}

/** ----------------------
 *		Alter Type Statement, enum types
 * ----------------------
 */
export type AlterEnumStmt = {
  /** qualified name (list of String) */
  typeName: QualifiedName
  /** old enum value's name, if renaming */
  oldVal?: string
  /** new enum value's name */
  newVal: string
  /** neighboring enum value, if specified */
  newValNeighbor?: string
  /** place new enum value after neighbor? */
  newValIsAfter?: boolean
  /** no error if new already exists? */
  skipIfNewValExists?: boolean
}

/** ----------------------
 *		Create View Statement
 * ----------------------
 */
export type ViewStmt = {
  /** the view to be created */
  view: RangeVar
  /** target column names */
  aliases?: ({ String: String })[]
  /** the SELECT query (as a raw parse tree) */
  query: ({ SelectStmt: SelectStmt })
  /** replace an existing view? */
  replace?: boolean
  /** options from WITH clause */
  options?: ({ DefElem: DefElem })[]
  /** WITH CHECK OPTION */
  withCheckOption: ViewCheckOption
}

/** ----------------------
 *		Load Statement
 * ----------------------
 */
export type LoadStmt = {
  /** file to load */
  filename: string
}

/** ----------------------
 *		Createdb Statement
 * ----------------------
 */
export type CreatedbStmt = {
  /** name of database to create */
  dbname: string
  /** List of DefElem nodes */
  options: any[]
}

/** ----------------------
 *	Alter Database
 * ----------------------
 */
export type AlterDatabaseStmt = {
  /** name of database to alter */
  dbname: string
  /** List of DefElem nodes */
  options: any[]
}

export type AlterDatabaseRefreshCollStmt = {
  dbname: string
}

/** ----------------------
 *	Alter Database
 * ----------------------
 */
export type AlterDatabaseSetStmt = {
  /** database name */
  dbname: string
  /** SET or RESET subcommand */
  setstmt: VariableSetStmt
}

/** ----------------------
 *		Dropdb Statement
 * ----------------------
 */
export type DropdbStmt = {
  /** database to drop */
  dbname: string
  /** skip error if db is missing? */
  missing_ok?: boolean
  /** currently only FORCE is supported */
  options: ({ DefElem: DefElem })[]
}

/** ----------------------
 *		Alter System Statement
 * ----------------------
 */
export type AlterSystemStmt = {
  /** SET subcommand */
  setstmt: VariableSetStmt
}

/** ----------------------
 *		Cluster Statement (support pbrown's cluster index implementation)
 * ----------------------
 */
export type ClusterStmt = {
  /** relation being indexed, or NULL if all */
  relation: RangeVar
  /** original index defined */
  indexname?: string
  /** list of DefElem nodes */
  params?: any[]
}

/** ----------------------
 *		Vacuum and Analyze Statements
 *
 * Even though these are nominally two statements, it's convenient to use
 * just one node type for both.
 * ----------------------
 */
export type VacuumStmt = {
  /** list of DefElem nodes */
  options?: ({ DefElem: DefElem })[]
  /** list of VacuumRelation, or NIL for all */
  rels?: ({ VacuumRelation: VacuumRelation })[]
  /** true for VACUUM, false for ANALYZE */
  is_vacuumcmd?: boolean
}

/**
 * Info about a single target table of VACUUM/ANALYZE.
 *
 * If the OID field is set, it always identifies the table to process.
 * Then the relation field can be NULL; if it isn't, it's used only to report
 * failure to open/lock the relation.
 */
export type VacuumRelation = {
  /** table name to process, or NULL */
  relation: RangeVar
  /** table's OID; InvalidOid if not looked up */
  oid?: Oid
  /** list of column names, or NIL for all */
  va_cols?: ({ String: String })[]
}

/** ----------------------
 *		Explain Statement
 *
 * The "query" field is initially a raw parse tree, and is converted to a
 * Query node during parse analysis.  Note that rewriting and planning
 * of the query are always postponed until execution.
 * ----------------------
 */
export type ExplainStmt = {
  /** the query (see comments above) */
  query: ({ CreateTableAsStmt: CreateTableAsStmt } | { DeclareCursorStmt: DeclareCursorStmt } | { DeleteStmt: DeleteStmt } | { ExecuteStmt: ExecuteStmt } | { InsertStmt: InsertStmt } | { MergeStmt: MergeStmt } | { SelectStmt: SelectStmt } | { UpdateStmt: UpdateStmt })
  /** list of DefElem nodes */
  options?: ({ DefElem: DefElem })[]
}

/** ----------------------
 *		CREATE TABLE AS Statement (a/k/a SELECT INTO)
 *
 * A query written as CREATE TABLE AS will produce this node type natively.
 * A query written as SELECT ... INTO will be transformed to this form during
 * parse analysis.
 * A query written as CREATE MATERIALIZED view will produce this node type,
 * during parse analysis, since it needs all the same data.
 *
 * The "query" field is handled similarly to EXPLAIN, though note that it
 * can be a SELECT or an EXECUTE, but not other DML statements.
 * ----------------------
 */
export type CreateTableAsStmt = {
  /** the query (see comments above) */
  query: ({ ExecuteStmt: ExecuteStmt } | { SelectStmt: SelectStmt })
  /** destination table */
  into: IntoClause
  /** OBJECT_TABLE or OBJECT_MATVIEW */
  objtype: ObjectType
  /** it was written as SELECT INTO */
  is_select_into?: boolean
  /** just do nothing if it already exists? */
  if_not_exists?: boolean
}

/** ----------------------
 *		REFRESH MATERIALIZED VIEW Statement
 * ----------------------
 */
export type RefreshMatViewStmt = {
  /** allow concurrent access? */
  concurrent: boolean
  /** true for WITH NO DATA */
  skipData: boolean
  /** relation to insert into */
  relation: RangeVar
}

/** ----------------------
 * Checkpoint Statement
 * ----------------------
 */
export type CheckPointStmt = {
}

/** ----------------------
 * Discard Statement
 * ----------------------
 */
export type DiscardStmt = {
  target: DiscardMode
}

/** ----------------------
 *		LOCK Statement
 * ----------------------
 */
export type LockStmt = {
  /** relations to lock */
  relations: any[]
  /** lock mode */
  mode: number
  /** no wait mode */
  nowait: boolean
}

/** ----------------------
 *		SET CONSTRAINTS Statement
 * ----------------------
 */
export type ConstraintsSetStmt = {
  /** List of names as RangeVars */
  constraints?: ({ RangeVar: RangeVar })[]
  deferred?: boolean
}

export type ReindexStmt = {
  /** REINDEX_OBJECT_INDEX, REINDEX_OBJECT_TABLE,
								 * etc. */
  kind: ReindexObjectType
  /** Table or index to reindex */
  relation?: RangeVar
  /** name of database to reindex */
  name?: string
  /** list of DefElem nodes */
  params?: ({ DefElem: DefElem })[]
}

/** ----------------------
 *		CREATE CONVERSION Statement
 * ----------------------
 */
export type CreateConversionStmt = {
  /** Name of the conversion */
  conversion_name: ({ String: String })[]
  /** source encoding name */
  for_encoding_name: string
  /** destination encoding name */
  to_encoding_name: string
  /** qualified conversion function name */
  func_name: QualifiedName
  /** is this a default conversion? */
  def?: boolean
}

/** ----------------------
 *	CREATE CAST Statement
 * ----------------------
 */
export type CreateCastStmt = {
  sourcetype: TypeName
  targettype: TypeName
  func?: ObjectWithArgs
  context: CoercionContext
  inout?: boolean
}

/** ----------------------
 *	CREATE TRANSFORM Statement
 * ----------------------
 */
export type CreateTransformStmt = {
  replace?: boolean
  type_name: TypeName
  lang: string
  fromsql: ObjectWithArgs
  tosql: ObjectWithArgs
}

/** ----------------------
 *		PREPARE Statement
 * ----------------------
 */
export type PrepareStmt = {
  /** Name of plan, arbitrary */
  name: string
  /** Types of parameters (List of TypeName) */
  argtypes?: ({ TypeName: TypeName })[]
  /** The query itself (as a raw parsetree) */
  query: ({ InsertStmt: InsertStmt } | { SelectStmt: SelectStmt } | { UpdateStmt: UpdateStmt })
}

/** ----------------------
 *		EXECUTE Statement
 * ----------------------
 */
export type ExecuteStmt = {
  /** The name of the plan to execute */
  name: string
  /** Values to assign to parameters */
  params?: ({ A_ArrayExpr: A_ArrayExpr } | { A_Const: A_Const })[]
}

/** ----------------------
 *		DEALLOCATE Statement
 * ----------------------
 */
export type DeallocateStmt = {
  /** The name of the plan to remove */
  name: string
  /** NULL means DEALLOCATE ALL */
}

/**
 *		DROP OWNED statement
 */
export type DropOwnedStmt = {
  roles: ({ RoleSpec: RoleSpec })[]
  behavior: DropBehavior
}

/**
 *		REASSIGN OWNED statement
 */
export type ReassignOwnedStmt = {
  roles: ({ RoleSpec: RoleSpec })[]
  newrole: RoleSpec
}

/**
 * TS Dictionary stmts: DefineStmt, RenameStmt and DropStmt are default
 */
export type AlterTSDictionaryStmt = {
  /** qualified name (list of String) */
  dictname: QualifiedName
  /** List of DefElem nodes */
  options: ({ DefElem: DefElem })[]
}

export type AlterTSConfigurationStmt = {
  /** ALTER_TSCONFIG_ADD_MAPPING, etc */
  kind: AlterTSConfigType
  /** qualified name (list of String) */
  cfgname: QualifiedName
  /**
	 * dicts will be non-NIL if ADD/ALTER MAPPING was specified. If dicts is
	 * NIL, but tokentype isn't, DROP MAPPING was specified.
	 */
  /** list of String */
  tokentype?: ({ String: String })[]
  /** list of list of String */
  dicts: List<{ String: String }>[]
  /** if true - remove old variant */
  override?: boolean
  /** if true - replace dictionary by another */
  replace?: boolean
  /** for DROP - skip error if missing? */
  missing_ok?: boolean
}

export type PublicationTable = {
  /** relation to be published */
  relation: RangeVar
  /** qualifications */
  whereClause: Node
  /** List of columns in a publication table */
  columns: any[]
}

export type PublicationObjSpec = {
  /** type of this publication object */
  pubobjtype: PublicationObjSpecType
  name?: string
  pubtable?: PublicationTable
  /** token location, or -1 if unknown */
  location?: number
}

export type CreatePublicationStmt = {
  /** Name of the publication */
  pubname: string
  /** List of DefElem nodes */
  options?: ({ DefElem: DefElem })[]
  /** Optional list of publication objects */
  pubobjects?: ({ PublicationObjSpec: PublicationObjSpec })[]
  /** Special publication for all tables in db */
  for_all_tables?: boolean
}

export type AlterPublicationStmt = {
  /** Name of the publication */
  pubname: string
  /** parameters used for ALTER PUBLICATION ... WITH */
  /** List of DefElem nodes */
  options?: ({ DefElem: DefElem })[]
  /**
	 * Parameters used for ALTER PUBLICATION ... ADD/DROP/SET publication
	 * objects.
	 */
  /** Optional list of publication objects */
  pubobjects?: ({ PublicationObjSpec: PublicationObjSpec })[]
  /** Special publication for all tables in db */
  for_all_tables?: boolean
  /** What action to perform with the given
									 * objects */
  action: AlterPublicationAction
}

export type CreateSubscriptionStmt = {
  /** Name of the subscription */
  subname: string
  /** Connection string to publisher */
  conninfo: string
  /** One or more publication to subscribe to */
  publication: ({ String: String })[]
  /** List of DefElem nodes */
  options?: ({ DefElem: DefElem })[]
}

export type AlterSubscriptionStmt = {
  /** ALTER_SUBSCRIPTION_OPTIONS, etc */
  kind: AlterSubscriptionType
  /** Name of the subscription */
  subname: string
  /** Connection string to publisher */
  conninfo?: string
  /** One or more publication to subscribe to */
  publication?: ({ String: String })[]
  /** List of DefElem nodes */
  options?: ({ DefElem: DefElem })[]
}

export type DropSubscriptionStmt = {
  /** Name of the subscription */
  subname: string
  /** Skip error if missing? */
  missing_ok: boolean
  /** RESTRICT or CASCADE behavior */
  behavior: DropBehavior
}

/**
 * Alias -
 *	  specifies an alias for a range variable; the alias might also
 *	  specify renaming of columns within the table.
 *
 * Note: colnames is a list of String nodes.  In Alias structs
 * associated with RTEs, there may be entries corresponding to dropped
 * columns; these are normally empty strings ("").  See parsenodes.h for info.
 */
export type Alias = {
  /** aliased rel name (never qualified) */
  aliasname: string
  /** optional list of column aliases */
  colnames: ({ String: String })[]
}

/**
 * RangeVar - range variable, used in FROM clauses
 *
 * Also used to represent table names in utility statements; there, the alias
 * field is not used, and inh tells whether to apply the operation
 * recursively to child tables.  In some contexts it is also useful to carry
 * a TEMP table indication here.
 */
export type RangeVar = {
  /** the catalog (database) name, or NULL */
  catalogname?: string
  /** the schema name, or NULL */
  schemaname?: string
  /** the relation/sequence name */
  relname: string
  /** expand rel by inheritance? recursively act on children? */
  inh?: boolean
  /** see RELPERSISTENCE_* in pg_class.h */
  relpersistence: string
  /** table alias & optional column aliases */
  alias?: Alias
  /** token location, or -1 if unknown */
  location: number
}

/**
 * IntoClause - target information for SELECT INTO, CREATE TABLE AS, and
 * CREATE MATERIALIZED VIEW
 *
 * For CREATE MATERIALIZED VIEW, viewQuery is the parsed-but-not-rewritten
 * SELECT Query for the view; otherwise it's NULL.  This is irrelevant in
 * the query jumbling as CreateTableAsStmt already includes a reference to
 * its own Query, so ignore it.  (Although it's actually Query*, we declare
 * it as Node* to avoid a forward reference.)
 */
export type IntoClause = {
  /** target relation name */
  rel: RangeVar
  /** column names to assign, or NIL */
  colNames?: any[]
  /** table access method */
  accessMethod: string
  /** options from WITH clause */
  options: any[]
  /** what do we do at COMMIT? */
  onCommit: OnCommitAction
  /** table space to use, or NULL */
  tableSpaceName?: string
  /** materialized view's SELECT query */
  viewQuery: Node
  /** true for WITH NO DATA */
  skipData: boolean
}

/** Symbols for the indexes of the special RTE entries in rules */
export type Var = {
  /**
	 * index of this var's relation in the range table, or
	 * INNER_VAR/OUTER_VAR/etc
	 */
  varno: number
  /**
	 * attribute number of this var, or zero for all attrs ("whole-row Var")
	 */
  varattno: AttrNumber
  /** pg_type OID for the type of this var */
  vartype: Oid
  /** pg_attribute typmod value */
  vartypmod: number
  /** OID of collation, or InvalidOid if none */
  varcollid: Oid
  /**
	 * RT indexes of outer joins that can replace the Var's value with null.
	 * We can omit varnullingrels in the query jumble, because it's fully
	 * determined by varno/varlevelsup plus the Var's query location.
	 */
  varnullingrels: any
  /**
	 * for subquery variables referencing outer relations; 0 in a normal var,
	 * >0 means N levels up
	 */
  varlevelsup: Index
  /**
	 * varnosyn/varattnosyn are ignored for equality, because Vars with
	 * different syntactic identifiers are semantically the same as long as
	 * their varno/varattno match.
	 */
  /** syntactic relation index (0 if unknown) */
  /** syntactic attribute number */
  /** token location, or -1 if unknown */
  location: number
}

/**
 * Const
 *
 * Note: for varlena data types, we make a rule that a Const node's value
 * must be in non-extended form (4-byte header, no compression or external
 * references).  This ensures that the Const node is self-contained and makes
 * it more likely that equal() will see logically identical values as equal.
 *
 * Only the constant type OID is relevant for the query jumbling.
 */
export type Const = {
  /** pg_type OID of the constant's datatype */
  consttype: Oid
  /** typmod value, if any */
  consttypmod: number
  /** OID of collation, or InvalidOid if none */
  constcollid: Oid
  /** typlen of the constant's datatype */
  constlen: number
  /** the constant's value */
  constvalue: Datum
  /** whether the constant is null (if true, constvalue is undefined) */
  constisnull: boolean
  /**
	 * Whether this datatype is passed by value.  If true, then all the
	 * information is stored in the Datum.  If false, then the Datum contains
	 * a pointer to the information.
	 */
  constbyval: boolean
  /**
	 * token location, or -1 if unknown.  All constants are tracked as
	 * locations in query jumbling, to be marked as parameters.
	 */
  location: number
}

/**
 * Param
 *
 *		paramkind specifies the kind of parameter. The possible values
 *		for this field are:
 *
 *		PARAM_EXTERN:  The parameter value is supplied from outside the plan.
 *				Such parameters are numbered from 1 to n.
 *
 *		PARAM_EXEC:  The parameter is an internal executor parameter, used
 *				for passing values into and out of sub-queries or from
 *				nestloop joins to their inner scans.
 *				For historical reasons, such parameters are numbered from 0.
 *				These numbers are independent of PARAM_EXTERN numbers.
 *
 *		PARAM_SUBLINK:	The parameter represents an output column of a SubLink
 *				node's sub-select.  The column number is contained in the
 *				`paramid' field.  (This type of Param is converted to
 *				PARAM_EXEC during planning.)
 *
 *		PARAM_MULTIEXPR:  Like PARAM_SUBLINK, the parameter represents an
 *				output column of a SubLink node's sub-select, but here, the
 *				SubLink is always a MULTIEXPR SubLink.  The high-order 16 bits
 *				of the `paramid' field contain the SubLink's subLinkId, and
 *				the low-order 16 bits contain the column number.  (This type
 *				of Param is also converted to PARAM_EXEC during planning.)
 */
export type Param = {
  /** kind of parameter. See above */
  paramkind: ParamKind
  /** numeric ID for parameter */
  paramid: number
  /** pg_type OID of parameter's datatype */
  paramtype: Oid
  /** typmod value, if known */
  paramtypmod: number
  /** OID of collation, or InvalidOid if none */
  paramcollid: Oid
  /** token location, or -1 if unknown */
  location: number
}

/**
 * Aggref
 *
 * The aggregate's args list is a targetlist, ie, a list of TargetEntry nodes.
 *
 * For a normal (non-ordered-set) aggregate, the non-resjunk TargetEntries
 * represent the aggregate's regular arguments (if any) and resjunk TLEs can
 * be added at the end to represent ORDER BY expressions that are not also
 * arguments.  As in a top-level Query, the TLEs can be marked with
 * ressortgroupref indexes to let them be referenced by SortGroupClause
 * entries in the aggorder and/or aggdistinct lists.  This represents ORDER BY
 * and DISTINCT operations to be applied to the aggregate input rows before
 * they are passed to the transition function.  The grammar only allows a
 * simple "DISTINCT" specifier for the arguments, but we use the full
 * query-level representation to allow more code sharing.
 *
 * For an ordered-set aggregate, the args list represents the WITHIN GROUP
 * (aggregated) arguments, all of which will be listed in the aggorder list.
 * DISTINCT is not supported in this case, so aggdistinct will be NIL.
 * The direct arguments appear in aggdirectargs (as a list of plain
 * expressions, not TargetEntry nodes).
 *
 * aggtranstype is the data type of the state transition values for this
 * aggregate (resolved to an actual type, if agg's transtype is polymorphic).
 * This is determined during planning and is InvalidOid before that.
 *
 * aggargtypes is an OID list of the data types of the direct and regular
 * arguments.  Normally it's redundant with the aggdirectargs and args lists,
 * but in a combining aggregate, it's not because the args list has been
 * replaced with a single argument representing the partial-aggregate
 * transition values.
 *
 * aggpresorted is set by the query planner for ORDER BY and DISTINCT
 * aggregates where the chosen plan provides presorted input for this
 * aggregate during execution.
 *
 * aggsplit indicates the expected partial-aggregation mode for the Aggref's
 * parent plan node.  It's always set to AGGSPLIT_SIMPLE in the parser, but
 * the planner might change it to something else.  We use this mainly as
 * a crosscheck that the Aggrefs match the plan; but note that when aggsplit
 * indicates a non-final mode, aggtype reflects the transition data type
 * not the SQL-level output type of the aggregate.
 *
 * aggno and aggtransno are -1 in the parse stage, and are set in planning.
 * Aggregates with the same 'aggno' represent the same aggregate expression,
 * and can share the result.  Aggregates with same 'transno' but different
 * 'aggno' can share the same transition state, only the final function needs
 * to be called separately.
 *
 * Information related to collations, transition types and internal states
 * are irrelevant for the query jumbling.
 */
export type Aggref = {
  /** pg_proc Oid of the aggregate */
  aggfnoid: Oid
  /** type Oid of result of the aggregate */
  aggtype: Oid
  /** OID of collation of result */
  aggcollid: Oid
  /** OID of collation that function should use */
  inputcollid: Oid
  /**
	 * type Oid of aggregate's transition value; ignored for equal since it
	 * might not be set yet
	 */
  /** type Oids of direct and aggregated args */
  aggargtypes: any[]
  /** direct arguments, if an ordered-set agg */
  aggdirectargs: any[]
  /** aggregated arguments and sort expressions */
  args: any[]
  /** ORDER BY (list of SortGroupClause) */
  aggorder: any[]
  /** DISTINCT (list of SortGroupClause) */
  aggdistinct: any[]
  /** FILTER expression, if any */
  aggfilter: Expr
  /** true if argument list was really '*' */
  aggstar: boolean
  /**
	 * true if variadic arguments have been combined into an array last
	 * argument
	 */
  aggvariadic: boolean
  /** aggregate kind (see pg_aggregate.h) */
  aggkind: string
  /** aggregate input already sorted */
  /** > 0 if agg belongs to outer query */
  agglevelsup: Index
  /** expected agg-splitting mode of parent Agg */
  aggsplit: AggSplit
  /** unique ID within the Agg node */
  aggno: number
  /** unique ID of transition state in the Agg */
  aggtransno: number
  /** token location, or -1 if unknown */
  location: number
}

/**
 * GroupingFunc
 *
 * A GroupingFunc is a GROUPING(...) expression, which behaves in many ways
 * like an aggregate function (e.g. it "belongs" to a specific query level,
 * which might not be the one immediately containing it), but also differs in
 * an important respect: it never evaluates its arguments, they merely
 * designate expressions from the GROUP BY clause of the query level to which
 * it belongs.
 *
 * The spec defines the evaluation of GROUPING() purely by syntactic
 * replacement, but we make it a real expression for optimization purposes so
 * that one Agg node can handle multiple grouping sets at once.  Evaluating the
 * result only needs the column positions to check against the grouping set
 * being projected.  However, for EXPLAIN to produce meaningful output, we have
 * to keep the original expressions around, since expression deparse does not
 * give us any feasible way to get at the GROUP BY clause.
 *
 * Also, we treat two GroupingFunc nodes as equal if they have equal arguments
 * lists and agglevelsup, without comparing the refs and cols annotations.
 *
 * In raw parse output we have only the args list; parse analysis fills in the
 * refs list, and the planner fills in the cols list.
 *
 * All the fields used as information for an internal state are irrelevant
 * for the query jumbling.
 */
export type GroupingFunc = {
  /** arguments, not evaluated but kept for benefit of EXPLAIN etc. */
  args: ({ ColumnRef: ColumnRef })[]
  /** ressortgrouprefs of arguments */
  refs?: any[]
  /** actual column positions set by planner */
  /** same as Aggref.agglevelsup */
  agglevelsup?: Index
  /** token location */
  location: number
}

/**
 * WindowFunc
 *
 * Collation information is irrelevant for the query jumbling, as is the
 * internal state information of the node like "winstar" and "winagg".
 */
export type WindowFunc = {
  /** pg_proc Oid of the function */
  winfnoid: Oid
  /** type Oid of result of the window function */
  wintype: Oid
  /** OID of collation of result */
  wincollid: Oid
  /** OID of collation that function should use */
  inputcollid: Oid
  /** arguments to the window function */
  args: any[]
  /** FILTER expression, if any */
  aggfilter: Expr
  /** index of associated WindowClause */
  winref: Index
  /** true if argument list was really '*' */
  winstar: boolean
  /** is function a simple aggregate? */
  winagg: boolean
  /** token location, or -1 if unknown */
  location: number
}

/**
 * SubscriptingRef: describes a subscripting operation over a container
 * (array, etc).
 *
 * A SubscriptingRef can describe fetching a single element from a container,
 * fetching a part of a container (e.g. an array slice), storing a single
 * element into a container, or storing a slice.  The "store" cases work with
 * an initial container value and a source value that is inserted into the
 * appropriate part of the container; the result of the operation is an
 * entire new modified container value.
 *
 * If reflowerindexpr = NIL, then we are fetching or storing a single container
 * element at the subscripts given by refupperindexpr. Otherwise we are
 * fetching or storing a container slice, that is a rectangular subcontainer
 * with lower and upper bounds given by the index expressions.
 * reflowerindexpr must be the same length as refupperindexpr when it
 * is not NIL.
 *
 * In the slice case, individual expressions in the subscript lists can be
 * NULL, meaning "substitute the array's current lower or upper bound".
 * (Non-array containers may or may not support this.)
 *
 * refcontainertype is the actual container type that determines the
 * subscripting semantics.  (This will generally be either the exposed type of
 * refexpr, or the base type if that is a domain.)  refelemtype is the type of
 * the container's elements; this is saved for the use of the subscripting
 * functions, but is not used by the core code.  refrestype, reftypmod, and
 * refcollid describe the type of the SubscriptingRef's result.  In a store
 * expression, refrestype will always match refcontainertype; in a fetch,
 * it could be refelemtype for an element fetch, or refcontainertype for a
 * slice fetch, or possibly something else as determined by type-specific
 * subscripting logic.  Likewise, reftypmod and refcollid will match the
 * container's properties in a store, but could be different in a fetch.
 *
 * Any internal state data is ignored for the query jumbling.
 *
 * Note: for the cases where a container is returned, if refexpr yields a R/W
 * expanded container, then the implementation is allowed to modify that
 * object in-place and return the same object.
 */
export type SubscriptingRef = {
  /** type of the container proper */
  refcontainertype: Oid
  /** the container type's pg_type.typelem */
  refelemtype: Oid
  /** type of the SubscriptingRef's result */
  refrestype: Oid
  /** typmod of the result */
  reftypmod: number
  /** collation of result, or InvalidOid if none */
  refcollid: Oid
  /** expressions that evaluate to upper container indexes */
  refupperindexpr: any[]
  /**
	 * expressions that evaluate to lower container indexes, or NIL for single
	 * container element.
	 */
  reflowerindexpr?: any[]
  /** the expression that evaluates to a container value */
  refexpr: Expr
  /** expression for the source value, or NULL if fetch */
  refassgnexpr?: Expr
}

/**
 * FuncExpr - expression node for a function call
 *
 * Collation information is irrelevant for the query jumbling, only the
 * arguments and the function OID matter.
 */
export type FuncExpr = {
  /** PG_PROC OID of the function */
  funcid: Oid
  /** PG_TYPE OID of result value */
  funcresulttype: Oid
  /** true if function returns set */
  funcretset: boolean
  /**
	 * true if variadic arguments have been combined into an array last
	 * argument
	 */
  funcvariadic: boolean
  /** how to display this function call */
  funcformat: CoercionForm
  /** OID of collation of result */
  funccollid: Oid
  /** OID of collation that function should use */
  inputcollid: Oid
  /** arguments to the function */
  args: any[]
  /** token location, or -1 if unknown */
  location: number
}

/**
 * NamedArgExpr - a named argument of a function
 *
 * This node type can only appear in the args list of a FuncCall or FuncExpr
 * node.  We support pure positional call notation (no named arguments),
 * named notation (all arguments are named), and mixed notation (unnamed
 * arguments followed by named ones).
 *
 * Parse analysis sets argnumber to the positional index of the argument,
 * but doesn't rearrange the argument list.
 *
 * The planner will convert argument lists to pure positional notation
 * during expression preprocessing, so execution never sees a NamedArgExpr.
 */
export type NamedArgExpr = {
  /** the argument expression */
  arg: Expr
  /** the name */
  name: string
  /** argument's number in positional notation */
  argnumber: number
  /** argument name location, or -1 if unknown */
  location: number
}

/**
 * OpExpr - expression node for an operator invocation
 *
 * Semantically, this is essentially the same as a function call.
 *
 * Note that opfuncid is not necessarily filled in immediately on creation
 * of the node.  The planner makes sure it is valid before passing the node
 * tree to the executor, but during parsing/planning opfuncid can be 0.
 * Therefore, equal() will accept a zero value as being equal to other values.
 *
 * Internal state information and collation data is irrelevant for the query
 * jumbling.
 */
export type OpExpr = {
  /** PG_OPERATOR OID of the operator */
  opno: Oid
  /** PG_PROC OID of underlying function */
  /** PG_TYPE OID of result value */
  opresulttype: Oid
  /** true if operator returns set */
  opretset: boolean
  /** OID of collation of result */
  opcollid: Oid
  /** OID of collation that operator should use */
  inputcollid: Oid
  /** arguments to the operator (1 or 2) */
  args: any[]
  /** token location, or -1 if unknown */
  location: number
}

/**
 * ScalarArrayOpExpr - expression node for "scalar op ANY/ALL (array)"
 *
 * The operator must yield boolean.  It is applied to the left operand
 * and each element of the righthand array, and the results are combined
 * with OR or AND (for ANY or ALL respectively).  The node representation
 * is almost the same as for the underlying operator, but we need a useOr
 * flag to remember whether it's ANY or ALL, and we don't have to store
 * the result type (or the collation) because it must be boolean.
 *
 * A ScalarArrayOpExpr with a valid hashfuncid is evaluated during execution
 * by building a hash table containing the Const values from the RHS arg.
 * This table is probed during expression evaluation.  The planner will set
 * hashfuncid to the hash function which must be used to build and probe the
 * hash table.  The executor determines if it should use hash-based checks or
 * the more traditional means based on if the hashfuncid is set or not.
 *
 * When performing hashed NOT IN, the negfuncid will also be set to the
 * equality function which the hash table must use to build and probe the hash
 * table.  opno and opfuncid will remain set to the <> operator and its
 * corresponding function and won't be used during execution.  For
 * non-hashtable based NOT INs, negfuncid will be set to InvalidOid.  See
 * convert_saop_to_hashed_saop().
 *
 * Similar to OpExpr, opfuncid, hashfuncid, and negfuncid are not necessarily
 * filled in right away, so will be ignored for equality if they are not set
 * yet.
 *
 * OID entries of the internal function types are irrelevant for the query
 * jumbling, but the operator OID and the arguments are.
 */
export type ScalarArrayOpExpr = {
  /** PG_OPERATOR OID of the operator */
  opno: Oid
  /** PG_PROC OID of comparison function */
  /** PG_PROC OID of hash func or InvalidOid */
  /** PG_PROC OID of negator of opfuncid function or InvalidOid.  See above */
  /** true for ANY, false for ALL */
  useOr: boolean
  /** OID of collation that operator should use */
  inputcollid: Oid
  /** the scalar and array operands */
  args: any[]
  /** token location, or -1 if unknown */
  location: number
}

export type BoolExpr = {
  boolop: BoolExprType
  /** arguments to this expression */
  args: ({ A_Expr: A_Expr } | { BoolExpr: BoolExpr } | { BooleanTest: BooleanTest } | { ColumnRef: ColumnRef } | { FuncCall: FuncCall } | { JsonIsPredicate: JsonIsPredicate } | { NullTest: NullTest } | { ParamRef: ParamRef } | { SubLink: SubLink } | { TypeCast: TypeCast })[]
  /** token location, or -1 if unknown */
  location: number
}

/**
 * SubLink
 *
 * A SubLink represents a subselect appearing in an expression, and in some
 * cases also the combining operator(s) just above it.  The subLinkType
 * indicates the form of the expression represented:
 *	EXISTS_SUBLINK		EXISTS(SELECT ...)
 *	ALL_SUBLINK			(lefthand) op ALL (SELECT ...)
 *	ANY_SUBLINK			(lefthand) op ANY (SELECT ...)
 *	ROWCOMPARE_SUBLINK	(lefthand) op (SELECT ...)
 *	EXPR_SUBLINK		(SELECT with single targetlist item ...)
 *	MULTIEXPR_SUBLINK	(SELECT with multiple targetlist items ...)
 *	ARRAY_SUBLINK		ARRAY(SELECT with single targetlist item ...)
 *	CTE_SUBLINK			WITH query (never actually part of an expression)
 * For ALL, ANY, and ROWCOMPARE, the lefthand is a list of expressions of the
 * same length as the subselect's targetlist.  ROWCOMPARE will *always* have
 * a list with more than one entry; if the subselect has just one target
 * then the parser will create an EXPR_SUBLINK instead (and any operator
 * above the subselect will be represented separately).
 * ROWCOMPARE, EXPR, and MULTIEXPR require the subselect to deliver at most
 * one row (if it returns no rows, the result is NULL).
 * ALL, ANY, and ROWCOMPARE require the combining operators to deliver boolean
 * results.  ALL and ANY combine the per-row results using AND and OR
 * semantics respectively.
 * ARRAY requires just one target column, and creates an array of the target
 * column's type using any number of rows resulting from the subselect.
 *
 * SubLink is classed as an Expr node, but it is not actually executable;
 * it must be replaced in the expression tree by a SubPlan node during
 * planning.
 *
 * NOTE: in the raw output of gram.y, testexpr contains just the raw form
 * of the lefthand expression (if any), and operName is the String name of
 * the combining operator.  Also, subselect is a raw parsetree.  During parse
 * analysis, the parser transforms testexpr into a complete boolean expression
 * that compares the lefthand value(s) to PARAM_SUBLINK nodes representing the
 * output columns of the subselect.  And subselect is transformed to a Query.
 * This is the representation seen in saved rules and in the rewriter.
 *
 * In EXISTS, EXPR, MULTIEXPR, and ARRAY SubLinks, testexpr and operName
 * are unused and are always null.
 *
 * subLinkId is currently used only for MULTIEXPR SubLinks, and is zero in
 * other SubLinks.  This number identifies different multiple-assignment
 * subqueries within an UPDATE statement's SET list.  It is unique only
 * within a particular targetlist.  The output column(s) of the MULTIEXPR
 * are referenced by PARAM_MULTIEXPR Params appearing elsewhere in the tlist.
 *
 * The CTE_SUBLINK case never occurs in actual SubLink nodes, but it is used
 * in SubPlans generated for WITH subqueries.
 */
export type SubLink = {
  /** see above */
  subLinkType: SubLinkType
  /** ID (1..n); 0 if not MULTIEXPR */
  subLinkId?: number
  /** outer-query test for ALL/ANY/ROWCOMPARE */
  testexpr?: Expr
  /** originally specified operator name */
  operName?: QualifiedName
  /** subselect as Query* or raw parsetree */
  subselect: ({ SelectStmt: SelectStmt })
  /** token location, or -1 if unknown */
  location: number
}

/**
 * SubPlan - executable expression node for a subplan (sub-SELECT)
 *
 * The planner replaces SubLink nodes in expression trees with SubPlan
 * nodes after it has finished planning the subquery.  SubPlan references
 * a sub-plantree stored in the subplans list of the toplevel PlannedStmt.
 * (We avoid a direct link to make it easier to copy expression trees
 * without causing multiple processing of the subplan.)
 *
 * In an ordinary subplan, testexpr points to an executable expression
 * (OpExpr, an AND/OR tree of OpExprs, or RowCompareExpr) for the combining
 * operator(s); the left-hand arguments are the original lefthand expressions,
 * and the right-hand arguments are PARAM_EXEC Param nodes representing the
 * outputs of the sub-select.  (NOTE: runtime coercion functions may be
 * inserted as well.)  This is just the same expression tree as testexpr in
 * the original SubLink node, but the PARAM_SUBLINK nodes are replaced by
 * suitably numbered PARAM_EXEC nodes.
 *
 * If the sub-select becomes an initplan rather than a subplan, the executable
 * expression is part of the outer plan's expression tree (and the SubPlan
 * node itself is not, but rather is found in the outer plan's initPlan
 * list).  In this case testexpr is NULL to avoid duplication.
 *
 * The planner also derives lists of the values that need to be passed into
 * and out of the subplan.  Input values are represented as a list "args" of
 * expressions to be evaluated in the outer-query context (currently these
 * args are always just Vars, but in principle they could be any expression).
 * The values are assigned to the global PARAM_EXEC params indexed by parParam
 * (the parParam and args lists must have the same ordering).  setParam is a
 * list of the PARAM_EXEC params that are computed by the sub-select, if it
 * is an initplan or MULTIEXPR plan; they are listed in order by sub-select
 * output column position.  (parParam and setParam are integer Lists, not
 * Bitmapsets, because their ordering is significant.)
 *
 * Also, the planner computes startup and per-call costs for use of the
 * SubPlan.  Note that these include the cost of the subquery proper,
 * evaluation of the testexpr if any, and any hashtable management overhead.
 */
export type SubPlan = {
  /** Fields copied from original SubLink: */
  /** see above */
  subLinkType: SubLinkType
  /** The combining operators, transformed to an executable expression: */
  /** OpExpr or RowCompareExpr expression tree */
  testexpr: Expr
  /** IDs of Params embedded in the above */
  paramIds: any[]
  /** Identification of the Plan tree to use: */
  /** Index (from 1) in PlannedStmt.subplans */
  plan_id: number
  /** Identification of the SubPlan for EXPLAIN and debugging purposes: */
  /** A name assigned during planning */
  plan_name: string
  /** Extra data useful for determining subplan's output type: */
  /** Type of first column of subplan result */
  firstColType: Oid
  /** Typmod of first column of subplan result */
  firstColTypmod: number
  /** Collation of first column of subplan
									 * result */
  firstColCollation: Oid
  /** Information about execution strategy: */
  /** true to store subselect output in a hash
								 * table (implies we are doing "IN") */
  useHashTable: boolean
  /** true if it's okay to return FALSE when the
								 * spec result is UNKNOWN; this allows much
								 * simpler handling of null values */
  unknownEqFalse: boolean
  /** is the subplan parallel-safe? */
  parallel_safe: boolean
  /** Note: parallel_safe does not consider contents of testexpr or args */
  /** Information for passing params into and out of the subselect: */
  /** setParam and parParam are lists of integers (param IDs) */
  /** initplan and MULTIEXPR subqueries have to
								 * set these Params for parent plan */
  setParam: any[]
  /** indices of input Params from parent plan */
  parParam: any[]
  /** exprs to pass as parParam values */
  args: any[]
  /** Estimated execution costs: */
  /** one-time setup cost */
  startup_cost: Cost
  /** cost for each subplan evaluation */
  per_call_cost: Cost
}

/**
 * AlternativeSubPlan - expression node for a choice among SubPlans
 *
 * This is used only transiently during planning: by the time the plan
 * reaches the executor, all AlternativeSubPlan nodes have been removed.
 *
 * The subplans are given as a List so that the node definition need not
 * change if there's ever more than two alternatives.  For the moment,
 * though, there are always exactly two; and the first one is the fast-start
 * plan.
 */
export type AlternativeSubPlan = {
  /** SubPlan(s) with equivalent results */
  subplans: any[]
}

/** ----------------
 * FieldSelect
 *
 * FieldSelect represents the operation of extracting one field from a tuple
 * value.  At runtime, the input expression is expected to yield a rowtype
 * Datum.  The specified field number is extracted and returned as a Datum.
 * ----------------
 */
export type FieldSelect = {
  /** input expression */
  arg: Expr
  /** attribute number of field to extract */
  fieldnum: AttrNumber
  /** type of the field (result type of this node) */
  resulttype: Oid
  /** output typmod (usually -1) */
  resulttypmod: number
  /** OID of collation of the field */
  resultcollid: Oid
}

/** ----------------
 * FieldStore
 *
 * FieldStore represents the operation of modifying one field in a tuple
 * value, yielding a new tuple value (the input is not touched!).  Like
 * the assign case of SubscriptingRef, this is used to implement UPDATE of a
 * portion of a column.
 *
 * resulttype is always a named composite type (not a domain).  To update
 * a composite domain value, apply CoerceToDomain to the FieldStore.
 *
 * A single FieldStore can actually represent updates of several different
 * fields.  The parser only generates FieldStores with single-element lists,
 * but the planner will collapse multiple updates of the same base column
 * into one FieldStore.
 * ----------------
 */
export type FieldStore = {
  /** input tuple value */
  arg: Expr
  /** new value(s) for field(s) */
  newvals: any[]
  /** integer list of field attnums */
  fieldnums: any[]
  /** type of result (same as type of arg) */
  resulttype: Oid
  /** Like RowExpr, we deliberately omit a typmod and collation here */
}

/** ----------------
 * RelabelType
 *
 * RelabelType represents a "dummy" type coercion between two binary-
 * compatible datatypes, such as reinterpreting the result of an OID
 * expression as an int4.  It is a no-op at runtime; we only need it
 * to provide a place to store the correct type to be attributed to
 * the expression result during type resolution.  (We can't get away
 * with just overwriting the type field of the input expression node,
 * so we need a separate node to show the coercion's result type.)
 * ----------------
 */
export type RelabelType = {
  /** input expression */
  arg: Expr
  /** output type of coercion expression */
  resulttype: Oid
  /** output typmod (usually -1) */
  resulttypmod: number
  /** OID of collation, or InvalidOid if none */
  resultcollid: Oid
  /** how to display this node */
  relabelformat: CoercionForm
  /** token location, or -1 if unknown */
  location: number
}

/** ----------------
 * CoerceViaIO
 *
 * CoerceViaIO represents a type coercion between two types whose textual
 * representations are compatible, implemented by invoking the source type's
 * typoutput function then the destination type's typinput function.
 * ----------------
 */
export type CoerceViaIO = {
  /** input expression */
  arg: Expr
  /** output type of coercion */
  resulttype: Oid
  /** output typmod is not stored, but is presumed -1 */
  /** OID of collation, or InvalidOid if none */
  resultcollid: Oid
  /** how to display this node */
  coerceformat: CoercionForm
  /** token location, or -1 if unknown */
  location: number
}

/** ----------------
 * ArrayCoerceExpr
 *
 * ArrayCoerceExpr represents a type coercion from one array type to another,
 * which is implemented by applying the per-element coercion expression
 * "elemexpr" to each element of the source array.  Within elemexpr, the
 * source element is represented by a CaseTestExpr node.  Note that even if
 * elemexpr is a no-op (that is, just CaseTestExpr + RelabelType), the
 * coercion still requires some effort: we have to fix the element type OID
 * stored in the array header.
 * ----------------
 */
export type ArrayCoerceExpr = {
  /** input expression (yields an array) */
  arg: Expr
  /** expression representing per-element work */
  elemexpr: Expr
  /** output type of coercion (an array type) */
  resulttype: Oid
  /** output typmod (also element typmod) */
  resulttypmod: number
  /** OID of collation, or InvalidOid if none */
  resultcollid: Oid
  /** how to display this node */
  coerceformat: CoercionForm
  /** token location, or -1 if unknown */
  location: number
}

/** ----------------
 * ConvertRowtypeExpr
 *
 * ConvertRowtypeExpr represents a type coercion from one composite type
 * to another, where the source type is guaranteed to contain all the columns
 * needed for the destination type plus possibly others; the columns need not
 * be in the same positions, but are matched up by name.  This is primarily
 * used to convert a whole-row value of an inheritance child table into a
 * valid whole-row value of its parent table's rowtype.  Both resulttype
 * and the exposed type of "arg" must be named composite types (not domains).
 * ----------------
 */
export type ConvertRowtypeExpr = {
  /** input expression */
  arg: Expr
  /** output type (always a composite type) */
  resulttype: Oid
  /** Like RowExpr, we deliberately omit a typmod and collation here */
  /** how to display this node */
  convertformat: CoercionForm
  /** token location, or -1 if unknown */
  location: number
}

/**----------
 * CollateExpr - COLLATE
 *
 * The planner replaces CollateExpr with RelabelType during expression
 * preprocessing, so execution never sees a CollateExpr.
 *----------
 */
export type CollateExpr = {
  /** input expression */
  arg: Expr
  /** collation's OID */
  collOid: Oid
  /** token location, or -1 if unknown */
  location: number
}

/**----------
 * CaseExpr - a CASE expression
 *
 * We support two distinct forms of CASE expression:
 *		CASE WHEN boolexpr THEN expr [ WHEN boolexpr THEN expr ... ]
 *		CASE testexpr WHEN compexpr THEN expr [ WHEN compexpr THEN expr ... ]
 * These are distinguishable by the "arg" field being NULL in the first case
 * and the testexpr in the second case.
 *
 * In the raw grammar output for the second form, the condition expressions
 * of the WHEN clauses are just the comparison values.  Parse analysis
 * converts these to valid boolean expressions of the form
 *		CaseTestExpr '=' compexpr
 * where the CaseTestExpr node is a placeholder that emits the correct
 * value at runtime.  This structure is used so that the testexpr need be
 * evaluated only once.  Note that after parse analysis, the condition
 * expressions always yield boolean.
 *
 * Note: we can test whether a CaseExpr has been through parse analysis
 * yet by checking whether casetype is InvalidOid or not.
 *----------
 */
export type CaseExpr = {
  /** type of expression result */
  casetype?: Oid
  /** OID of collation, or InvalidOid if none */
  casecollid?: Oid
  /** implicit equality comparison argument */
  arg?: Expr
  /** the arguments (list of WHEN clauses) */
  args: ({ CaseWhen: CaseWhen })[]
  /** the default result (ELSE clause) */
  defresult?: Expr
  /** token location, or -1 if unknown */
  location: number
}

/**
 * CaseWhen - one arm of a CASE expression
 */
export type CaseWhen = {
  /** condition expression */
  expr: Expr
  /** substitution result */
  result: Expr
  /** token location, or -1 if unknown */
  location: number
}

/**
 * Placeholder node for the test value to be processed by a CASE expression.
 * This is effectively like a Param, but can be implemented more simply
 * since we need only one replacement value at a time.
 *
 * We also abuse this node type for some other purposes, including:
 *	* Placeholder for the current array element value in ArrayCoerceExpr;
 *	  see build_coercion_expression().
 *	* Nested FieldStore/SubscriptingRef assignment expressions in INSERT/UPDATE;
 *	  see transformAssignmentIndirection().
 *	* Placeholder for intermediate results in some SQL/JSON expression nodes,
 *	  such as JsonConstructorExpr.
 *
 * The uses in CaseExpr and ArrayCoerceExpr are safe only to the extent that
 * there is not any other CaseExpr or ArrayCoerceExpr between the value source
 * node and its child CaseTestExpr(s).  This is true in the parse analysis
 * output, but the planner's function-inlining logic has to be careful not to
 * break it.
 *
 * The nested-assignment-expression case is safe because the only node types
 * that can be above such CaseTestExprs are FieldStore and SubscriptingRef.
 */
export type CaseTestExpr = {
  /** type for substituted value */
  typeId: Oid
  /** typemod for substituted value */
  typeMod: number
  /** collation for the substituted value */
  collation: Oid
}

/**
 * ArrayExpr - an ARRAY[] expression
 *
 * Note: if multidims is false, the constituent expressions all yield the
 * scalar type identified by element_typeid.  If multidims is true, the
 * constituent expressions all yield arrays of element_typeid (ie, the same
 * type as array_typeid); at runtime we must check for compatible subscripts.
 */
export type ArrayExpr = {
  /** type of expression result */
  array_typeid: Oid
  /** OID of collation, or InvalidOid if none */
  array_collid: Oid
  /** common type of array elements */
  element_typeid: Oid
  /** the array elements or sub-arrays */
  elements: any[]
  /** true if elements are sub-arrays */
  multidims: boolean
  /** token location, or -1 if unknown */
  location: number
}

/**
 * RowExpr - a ROW() expression
 *
 * Note: the list of fields must have a one-for-one correspondence with
 * physical fields of the associated rowtype, although it is okay for it
 * to be shorter than the rowtype.  That is, the N'th list element must
 * match up with the N'th physical field.  When the N'th physical field
 * is a dropped column (attisdropped) then the N'th list element can just
 * be a NULL constant.  (This case can only occur for named composite types,
 * not RECORD types, since those are built from the RowExpr itself rather
 * than vice versa.)  It is important not to assume that length(args) is
 * the same as the number of columns logically present in the rowtype.
 *
 * colnames provides field names if the ROW() result is of type RECORD.
 * Names *must* be provided if row_typeid is RECORDOID; but if it is a
 * named composite type, colnames will be ignored in favor of using the
 * type's cataloged field names, so colnames should be NIL.  Like the
 * args list, colnames is defined to be one-for-one with physical fields
 * of the rowtype (although dropped columns shouldn't appear in the
 * RECORD case, so this fine point is currently moot).
 */
export type RowExpr = {
  /** the fields */
  args?: ({ A_ArrayExpr: A_ArrayExpr } | { A_Const: A_Const } | { A_Expr: A_Expr } | { CollateClause: CollateClause } | { ColumnRef: ColumnRef } | { FuncCall: FuncCall } | { RowExpr: RowExpr } | { SetToDefault: SetToDefault } | { SubLink: SubLink } | { TypeCast: TypeCast })[]
  /** RECORDOID or a composite type's ID */
  row_typeid?: Oid
  /**
	 * row_typeid cannot be a domain over composite, only plain composite.  To
	 * create a composite domain value, apply CoerceToDomain to the RowExpr.
	 *
	 * Note: we deliberately do NOT store a typmod.  Although a typmod will be
	 * associated with specific RECORD types at runtime, it will differ for
	 * different backends, and so cannot safely be stored in stored
	 * parsetrees.  We must assume typmod -1 for a RowExpr node.
	 *
	 * We don't need to store a collation either.  The result type is
	 * necessarily composite, and composite types never have a collation.
	 */
  /** how to display this node */
  row_format: CoercionForm
  /** list of String, or NIL */
  colnames?: any[]
  /** token location, or -1 if unknown */
  location: number
}

/**
 * RowCompareExpr - row-wise comparison, such as (a, b) <= (1, 2)
 *
 * We support row comparison for any operator that can be determined to
 * act like =, <>, <, <=, >, or >= (we determine this by looking for the
 * operator in btree opfamilies).  Note that the same operator name might
 * map to a different operator for each pair of row elements, since the
 * element datatypes can vary.
 *
 * A RowCompareExpr node is only generated for the < <= > >= cases;
 * the = and <> cases are translated to simple AND or OR combinations
 * of the pairwise comparisons.  However, we include = and <> in the
 * RowCompareType enum for the convenience of parser logic.
 */
export type RowCompareExpr = {
  /** LT LE GE or GT, never EQ or NE */
  rctype: RowCompareType
  /** OID list of pairwise comparison ops */
  opnos: any[]
  /** OID list of containing operator families */
  opfamilies: any[]
  /** OID list of collations for comparisons */
  inputcollids: any[]
  /** the left-hand input arguments */
  largs: any[]
  /** the right-hand input arguments */
  rargs: any[]
}

/**
 * CoalesceExpr - a COALESCE expression
 */
export type CoalesceExpr = {
  /** type of expression result */
  coalescetype?: Oid
  /** OID of collation, or InvalidOid if none */
  coalescecollid?: Oid
  /** the arguments */
  args: ({ A_Const: A_Const } | { ColumnRef: ColumnRef } | { TypeCast: TypeCast })[]
  /** token location, or -1 if unknown */
  location: number
}

/**
 * MinMaxExpr - a GREATEST or LEAST function
 */
export type MinMaxExpr = {
  /** common type of arguments and result */
  minmaxtype?: Oid
  /** OID of collation of result */
  minmaxcollid?: Oid
  /** OID of collation that function should use */
  inputcollid?: Oid
  /** function to execute */
  op: MinMaxOp
  /** the arguments */
  args: ({ A_Const: A_Const } | { A_Expr: A_Expr } | { ColumnRef: ColumnRef })[]
  /** token location, or -1 if unknown */
  location: number
}

export type SQLValueFunction = {
  /** which function this is */
  op: SQLValueFunctionOp
  /**
	 * Result type/typmod.  Type is fully determined by "op", so no need to
	 * include this Oid in the query jumbling.
	 */
  type?: Oid
  typmod?: number
  /** token location, or -1 if unknown */
  location: number
}

export type XmlExpr = {
  /** xml function ID */
  op: XmlExprOp
  /** name in xml(NAME foo ...) syntaxes */
  name?: string
  /** non-XML expressions for xml_attributes */
  named_args?: ({ ResTarget: ResTarget })[]
  /** parallel list of String values */
  arg_names?: any[]
  /** list of expressions */
  args?: ({ A_Const: A_Const } | { ColumnRef: ColumnRef } | { FuncCall: FuncCall } | { TypeCast: TypeCast } | { XmlExpr: XmlExpr })[]
  /** DOCUMENT or CONTENT */
  xmloption: XmlOptionType
  /** INDENT option for XMLSERIALIZE */
  indent?: boolean
  /** target type/typmod for XMLSERIALIZE */
  type?: Oid
  typmod?: number
  /** token location, or -1 if unknown */
  location: number
}

/**
 * JsonFormat -
 *		representation of JSON FORMAT clause
 */
export type JsonFormat = {
  /** format type */
  format_type: JsonFormatType
  /** JSON encoding */
  encoding: JsonEncoding
  /** token location, or -1 if unknown */
  location: number
}

/**
 * JsonReturning -
 *		transformed representation of JSON RETURNING clause
 */
export type JsonReturning = {
  /** output JSON format */
  format: JsonFormat
  /** target type Oid */
  typid: Oid
  /** target type modifier */
  typmod: number
}

/**
 * JsonValueExpr -
 *		representation of JSON value expression (expr [FORMAT JsonFormat])
 *
 * The actual value is obtained by evaluating formatted_expr.  raw_expr is
 * only there for displaying the original user-written expression and is not
 * evaluated by ExecInterpExpr() and eval_const_exprs_mutator().
 */
export type JsonValueExpr = {
  /** raw expression */
  raw_expr: Expr
  /** formatted expression */
  formatted_expr?: Expr
  /** FORMAT clause, if specified */
  format: JsonFormat
}

/**
 * JsonConstructorExpr -
 *		wrapper over FuncExpr/Aggref/WindowFunc for SQL/JSON constructors
 */
export type JsonConstructorExpr = {
  /** constructor type */
  type: JsonConstructorType
  args: any[]
  /** underlying json[b]_xxx() function call */
  func: Expr
  /** coercion to RETURNING type */
  coercion: Expr
  /** RETURNING clause */
  returning: JsonReturning
  /** ABSENT ON NULL? */
  absent_on_null?: boolean
  /** WITH UNIQUE KEYS? (JSON_OBJECT[AGG] only) */
  unique: boolean
  location: number
}

/**
 * JsonIsPredicate -
 *		representation of IS JSON predicate
 */
export type JsonIsPredicate = {
  /** subject expression */
  expr: Expr
  /** FORMAT clause, if specified */
  format: JsonFormat
  /** JSON item type */
  item_type: JsonValueType
  /** check key uniqueness? */
  unique_keys?: boolean
  /** token location, or -1 if unknown */
  location: number
}

/** ----------------
 * NullTest
 *
 * NullTest represents the operation of testing a value for NULLness.
 * The appropriate test is performed and returned as a boolean Datum.
 *
 * When argisrow is false, this simply represents a test for the null value.
 *
 * When argisrow is true, the input expression must yield a rowtype, and
 * the node implements "row IS [NOT] NULL" per the SQL standard.  This
 * includes checking individual fields for NULLness when the row datum
 * itself isn't NULL.
 *
 * NOTE: the combination of a rowtype input and argisrow==false does NOT
 * correspond to the SQL notation "row IS [NOT] NULL"; instead, this case
 * represents the SQL notation "row IS [NOT] DISTINCT FROM NULL".
 * ----------------
 */
export type NullTest = {
  /** input expression */
  arg: Expr
  /** IS NULL, IS NOT NULL */
  nulltesttype: NullTestType
  /** T to perform field-by-field null checks */
  argisrow?: boolean
  /** token location, or -1 if unknown */
  location: number
}

/**
 * BooleanTest
 *
 * BooleanTest represents the operation of determining whether a boolean
 * is TRUE, FALSE, or UNKNOWN (ie, NULL).  All six meaningful combinations
 * are supported.  Note that a NULL input does *not* cause a NULL result.
 * The appropriate test is performed and returned as a boolean Datum.
 */
export type BooleanTest = {
  /** input expression */
  arg: Expr
  /** test type */
  booltesttype: BoolTestType
  /** token location, or -1 if unknown */
  location: number
}

/**
 * CoerceToDomain
 *
 * CoerceToDomain represents the operation of coercing a value to a domain
 * type.  At runtime (and not before) the precise set of constraints to be
 * checked will be determined.  If the value passes, it is returned as the
 * result; if not, an error is raised.  Note that this is equivalent to
 * RelabelType in the scenario where no constraints are applied.
 */
export type CoerceToDomain = {
  /** input expression */
  arg: Expr
  /** domain type ID (result type) */
  resulttype: Oid
  /** output typmod (currently always -1) */
  resulttypmod: number
  /** OID of collation, or InvalidOid if none */
  resultcollid: Oid
  /** how to display this node */
  coercionformat: CoercionForm
  /** token location, or -1 if unknown */
  location: number
}

/**
 * Placeholder node for the value to be processed by a domain's check
 * constraint.  This is effectively like a Param, but can be implemented more
 * simply since we need only one replacement value at a time.
 *
 * Note: the typeId/typeMod/collation will be set from the domain's base type,
 * not the domain itself.  This is because we shouldn't consider the value
 * to be a member of the domain if we haven't yet checked its constraints.
 */
export type CoerceToDomainValue = {
  /** type for substituted value */
  typeId: Oid
  /** typemod for substituted value */
  typeMod: number
  /** collation for the substituted value */
  collation: Oid
  /** token location, or -1 if unknown */
  location: number
}

/**
 * Placeholder node for a DEFAULT marker in an INSERT or UPDATE command.
 *
 * This is not an executable expression: it must be replaced by the actual
 * column default expression during rewriting.  But it is convenient to
 * treat it as an expression node during parsing and rewriting.
 */
export type SetToDefault = {
  /** type for substituted value */
  typeId?: Oid
  /** typemod for substituted value */
  typeMod?: number
  /** collation for the substituted value */
  collation?: Oid
  /** token location, or -1 if unknown */
  location: number
}

/**
 * Node representing [WHERE] CURRENT OF cursor_name
 *
 * CURRENT OF is a bit like a Var, in that it carries the rangetable index
 * of the target relation being constrained; this aids placing the expression
 * correctly during planning.  We can assume however that its "levelsup" is
 * always zero, due to the syntactic constraints on where it can appear.
 * Also, cvarno will always be a true RT index, never INNER_VAR etc.
 *
 * The referenced cursor can be represented either as a hardwired string
 * or as a reference to a run-time parameter of type REFCURSOR.  The latter
 * case is for the convenience of plpgsql.
 */
export type CurrentOfExpr = {
  /** RT index of target relation */
  cvarno?: Index
  /** name of referenced cursor, or NULL */
  cursor_name: string
  /** refcursor parameter number, or 0 */
  cursor_param?: number
}

/**
 * NextValueExpr - get next value from sequence
 *
 * This has the same effect as calling the nextval() function, but it does not
 * check permissions on the sequence.  This is used for identity columns,
 * where the sequence is an implicit dependency without its own permissions.
 */
export type NextValueExpr = {
  seqid: Oid
  typeId: Oid
}

/**
 * InferenceElem - an element of a unique index inference specification
 *
 * This mostly matches the structure of IndexElems, but having a dedicated
 * primnode allows for a clean separation between the use of index parameters
 * by utility commands, and this node.
 */
export type InferenceElem = {
  /** expression to infer from, or NULL */
  expr?: Expr
  /** OID of collation, or InvalidOid */
  infercollid: Oid
  /** OID of att opclass, or InvalidOid */
  inferopclass: Oid
}

/**--------------------
 * TargetEntry -
 *	   a target entry (used in query target lists)
 *
 * Strictly speaking, a TargetEntry isn't an expression node (since it can't
 * be evaluated by ExecEvalExpr).  But we treat it as one anyway, since in
 * very many places it's convenient to process a whole query targetlist as a
 * single expression tree.
 *
 * In a SELECT's targetlist, resno should always be equal to the item's
 * ordinal position (counting from 1).  However, in an INSERT or UPDATE
 * targetlist, resno represents the attribute number of the destination
 * column for the item; so there may be missing or out-of-order resnos.
 * It is even legal to have duplicated resnos; consider
 *		UPDATE table SET arraycol[1] = ..., arraycol[2] = ..., ...
 * In an INSERT, the rewriter and planner will normalize the tlist by
 * reordering it into physical column order and filling in default values
 * for any columns not assigned values by the original query.  In an UPDATE,
 * after the rewriter merges multiple assignments for the same column, the
 * planner extracts the target-column numbers into a separate "update_colnos"
 * list, and then renumbers the tlist elements serially.  Thus, tlist resnos
 * match ordinal position in all tlists seen by the executor; but it is wrong
 * to assume that before planning has happened.
 *
 * resname is required to represent the correct column name in non-resjunk
 * entries of top-level SELECT targetlists, since it will be used as the
 * column title sent to the frontend.  In most other contexts it is only
 * a debugging aid, and may be wrong or even NULL.  (In particular, it may
 * be wrong in a tlist from a stored rule, if the referenced column has been
 * renamed by ALTER TABLE since the rule was made.  Also, the planner tends
 * to store NULL rather than look up a valid name for tlist entries in
 * non-toplevel plan nodes.)  In resjunk entries, resname should be either
 * a specific system-generated name (such as "ctid") or NULL; anything else
 * risks confusing ExecGetJunkAttribute!
 *
 * ressortgroupref is used in the representation of ORDER BY, GROUP BY, and
 * DISTINCT items.  Targetlist entries with ressortgroupref=0 are not
 * sort/group items.  If ressortgroupref>0, then this item is an ORDER BY,
 * GROUP BY, and/or DISTINCT target value.  No two entries in a targetlist
 * may have the same nonzero ressortgroupref --- but there is no particular
 * meaning to the nonzero values, except as tags.  (For example, one must
 * not assume that lower ressortgroupref means a more significant sort key.)
 * The order of the associated SortGroupClause lists determine the semantics.
 *
 * resorigtbl/resorigcol identify the source of the column, if it is a
 * simple reference to a column of a base table (or view).  If it is not
 * a simple reference, these fields are zeroes.
 *
 * If resjunk is true then the column is a working column (such as a sort key)
 * that should be removed from the final output of the query.  Resjunk columns
 * must have resnos that cannot duplicate any regular column's resno.  Also
 * note that there are places that assume resjunk columns come after non-junk
 * columns.
 *--------------------
 */
export type TargetEntry = {
  /** expression to evaluate */
  expr: Expr
  /** attribute number (see notes above) */
  resno: AttrNumber
  /** name of the column (could be NULL) */
  resname?: string
  /** nonzero if referenced by a sort/group clause */
  ressortgroupref: Index
  /** OID of column's source table */
  resorigtbl: Oid
  /** column's number in source table */
  resorigcol: AttrNumber
  /** set to true to eliminate the attribute from final target list */
  resjunk: boolean
}

/**
 * RangeTblRef - reference to an entry in the query's rangetable
 *
 * We could use direct pointers to the RT entries and skip having these
 * nodes, but multiple pointers to the same node in a querytree cause
 * lots of headaches, so it seems better to store an index into the RT.
 */
export type RangeTblRef = {
  rtindex: number
}

/**----------
 * JoinExpr - for SQL JOIN expressions
 *
 * isNatural, usingClause, and quals are interdependent.  The user can write
 * only one of NATURAL, USING(), or ON() (this is enforced by the grammar).
 * If he writes NATURAL then parse analysis generates the equivalent USING()
 * list, and from that fills in "quals" with the right equality comparisons.
 * If he writes USING() then "quals" is filled with equality comparisons.
 * If he writes ON() then only "quals" is set.  Note that NATURAL/USING
 * are not equivalent to ON() since they also affect the output column list.
 *
 * alias is an Alias node representing the AS alias-clause attached to the
 * join expression, or NULL if no clause.  NB: presence or absence of the
 * alias has a critical impact on semantics, because a join with an alias
 * restricts visibility of the tables/columns inside it.
 *
 * join_using_alias is an Alias node representing the join correlation
 * name that SQL:2016 and later allow to be attached to JOIN/USING.
 * Its column alias list includes only the common column names from USING,
 * and it does not restrict visibility of the join's input tables.
 *
 * During parse analysis, an RTE is created for the Join, and its index
 * is filled into rtindex.  This RTE is present mainly so that Vars can
 * be created that refer to the outputs of the join.  The planner sometimes
 * generates JoinExprs internally; these can have rtindex = 0 if there are
 * no join alias variables referencing such joins.
 *----------
 */
export type JoinExpr = {
  /** type of join */
  jointype: JoinType
  /** Natural join? Will need to shape table */
  isNatural?: boolean
  /** left subtree */
  larg: ({ JoinExpr: JoinExpr } | { RangeFunction: RangeFunction } | { RangeSubselect: RangeSubselect } | { RangeVar: RangeVar })
  /** right subtree */
  rarg: ({ JoinExpr: JoinExpr } | { RangeFunction: RangeFunction } | { RangeSubselect: RangeSubselect } | { RangeVar: RangeVar })
  /** USING clause, if any (list of String) */
  usingClause?: ({ String: String })[]
  /** alias attached to USING clause, if any */
  join_using_alias?: Alias
  /** qualifiers on join, if any */
  quals?: ({ A_Const: A_Const } | { A_Expr: A_Expr } | { BoolExpr: BoolExpr } | { NullTest: NullTest })
  /** user-written alias clause, if any */
  alias?: Alias
  /** RT index assigned for join, or 0 */
  rtindex?: number
}

/**----------
 * FromExpr - represents a FROM ... WHERE ... construct
 *
 * This is both more flexible than a JoinExpr (it can have any number of
 * children, including zero) and less so --- we don't need to deal with
 * aliases and so on.  The output column set is implicitly just the union
 * of the outputs of the children.
 *----------
 */
export type FromExpr = {
  /** List of join subtrees */
  fromlist: any[]
  /** qualifiers on join, if any */
  quals: Node
}

/**----------
 * OnConflictExpr - represents an ON CONFLICT DO ... expression
 *
 * The optimizer requires a list of inference elements, and optionally a WHERE
 * clause to infer a unique index.  The unique index (or, occasionally,
 * indexes) inferred are used to arbitrate whether or not the alternative ON
 * CONFLICT path is taken.
 *----------
 */
export type OnConflictExpr = {
  /** DO NOTHING or UPDATE? */
  action: OnConflictAction
  /** Arbiter */
  /** unique index arbiter list (of
								 * InferenceElem's) */
  arbiterElems: any[]
  /** unique index arbiter WHERE clause */
  arbiterWhere: Node
  /** pg_constraint OID for arbiter */
  constraint: Oid
  /** ON CONFLICT UPDATE */
  /** List of ON CONFLICT SET TargetEntrys */
  onConflictSet: any[]
  /** qualifiers to restrict UPDATE to */
  onConflictWhere: Node
  /** RT index of 'excluded' relation */
  exclRelIndex: number
  /** tlist of the EXCLUDED pseudo relation */
  exclRelTlist: any[]
}

/**
 *	  ParamListInfo
 *
 *	  ParamListInfo structures are used to pass parameters into the executor
 *	  for parameterized plans.  We support two basic approaches to supplying
 *	  parameter values, the "static" way and the "dynamic" way.
 *
 *	  In the static approach, per-parameter data is stored in an array of
 *	  ParamExternData structs appended to the ParamListInfo struct.
 *	  Each entry in the array defines the value to be substituted for a
 *	  PARAM_EXTERN parameter.  The "paramid" of a PARAM_EXTERN Param
 *	  can range from 1 to numParams.
 *
 *	  Although parameter numbers are normally consecutive, we allow
 *	  ptype == InvalidOid to signal an unused array entry.
 *
 *	  pflags is a flags field.  Currently the only used bit is:
 *	  PARAM_FLAG_CONST signals the planner that it may treat this parameter
 *	  as a constant (i.e., generate a plan that works only for this value
 *	  of the parameter).
 *
 *	  In the dynamic approach, all access to parameter values is done through
 *	  hook functions found in the ParamListInfo struct.  In this case,
 *	  the ParamExternData array is typically unused and not allocated;
 *	  but the legal range of paramid is still 1 to numParams.
 *
 *	  Although the data structure is really an array, not a list, we keep
 *	  the old typedef name to avoid unnecessary code changes.
 *
 *	  There are 3 hook functions that can be associated with a ParamListInfo
 *	  structure:
 *
 *	  If paramFetch isn't null, it is called to fetch the ParamExternData
 *	  for a particular param ID, rather than accessing the relevant element
 *	  of the ParamExternData array.  This supports the case where the array
 *	  isn't there at all, as well as cases where the data in the array
 *	  might be obsolete or lazily evaluated.  paramFetch must return the
 *	  address of a ParamExternData struct describing the specified param ID;
 *	  the convention above about ptype == InvalidOid signaling an invalid
 *	  param ID still applies.  The returned struct can either be placed in
 *	  the "workspace" supplied by the caller, or it can be in storage
 *	  controlled by the paramFetch hook if that's more convenient.
 *	  (In either case, the struct is not expected to be long-lived.)
 *	  If "speculative" is true, the paramFetch hook should not risk errors
 *	  in trying to fetch the parameter value, and should report an invalid
 *	  parameter instead.
 *
 *	  If paramCompile isn't null, then it controls what execExpr.c compiles
 *	  for PARAM_EXTERN Param nodes --- typically, this hook would emit a
 *	  EEOP_PARAM_CALLBACK step.  This allows unnecessary work to be
 *	  optimized away in compiled expressions.
 *
 *	  If parserSetup isn't null, then it is called to re-instantiate the
 *	  original parsing hooks when a query needs to be re-parsed/planned.
 *	  This is especially useful if the types of parameters might change
 *	  from time to time, since it can replace the need to supply a fixed
 *	  list of parameter types to the parser.
 *
 *	  Notice that the paramFetch and paramCompile hooks are actually passed
 *	  the ParamListInfo struct's address; they can therefore access all
 *	  three of the "arg" fields, and the distinction between paramFetchArg
 *	  and paramCompileArg is rather arbitrary.
 */
export type ParamExternData = {
  /** parameter value */
  value: Datum
  /** is it NULL? */
  isnull?: boolean
  /** flag bits, see above */
  pflags: number
  /** parameter's datatype, or 0 */
  ptype: Oid
}

/**
 *	  ParamListInfo
 *
 *	  ParamListInfo structures are used to pass parameters into the executor
 *	  for parameterized plans.  We support two basic approaches to supplying
 *	  parameter values, the "static" way and the "dynamic" way.
 *
 *	  In the static approach, per-parameter data is stored in an array of
 *	  ParamExternData structs appended to the ParamListInfo struct.
 *	  Each entry in the array defines the value to be substituted for a
 *	  PARAM_EXTERN parameter.  The "paramid" of a PARAM_EXTERN Param
 *	  can range from 1 to numParams.
 *
 *	  Although parameter numbers are normally consecutive, we allow
 *	  ptype == InvalidOid to signal an unused array entry.
 *
 *	  pflags is a flags field.  Currently the only used bit is:
 *	  PARAM_FLAG_CONST signals the planner that it may treat this parameter
 *	  as a constant (i.e., generate a plan that works only for this value
 *	  of the parameter).
 *
 *	  In the dynamic approach, all access to parameter values is done through
 *	  hook functions found in the ParamListInfo struct.  In this case,
 *	  the ParamExternData array is typically unused and not allocated;
 *	  but the legal range of paramid is still 1 to numParams.
 *
 *	  Although the data structure is really an array, not a list, we keep
 *	  the old typedef name to avoid unnecessary code changes.
 *
 *	  There are 3 hook functions that can be associated with a ParamListInfo
 *	  structure:
 *
 *	  If paramFetch isn't null, it is called to fetch the ParamExternData
 *	  for a particular param ID, rather than accessing the relevant element
 *	  of the ParamExternData array.  This supports the case where the array
 *	  isn't there at all, as well as cases where the data in the array
 *	  might be obsolete or lazily evaluated.  paramFetch must return the
 *	  address of a ParamExternData struct describing the specified param ID;
 *	  the convention above about ptype == InvalidOid signaling an invalid
 *	  param ID still applies.  The returned struct can either be placed in
 *	  the "workspace" supplied by the caller, or it can be in storage
 *	  controlled by the paramFetch hook if that's more convenient.
 *	  (In either case, the struct is not expected to be long-lived.)
 *	  If "speculative" is true, the paramFetch hook should not risk errors
 *	  in trying to fetch the parameter value, and should report an invalid
 *	  parameter instead.
 *
 *	  If paramCompile isn't null, then it controls what execExpr.c compiles
 *	  for PARAM_EXTERN Param nodes --- typically, this hook would emit a
 *	  EEOP_PARAM_CALLBACK step.  This allows unnecessary work to be
 *	  optimized away in compiled expressions.
 *
 *	  If parserSetup isn't null, then it is called to re-instantiate the
 *	  original parsing hooks when a query needs to be re-parsed/planned.
 *	  This is especially useful if the types of parameters might change
 *	  from time to time, since it can replace the need to supply a fixed
 *	  list of parameter types to the parser.
 *
 *	  Notice that the paramFetch and paramCompile hooks are actually passed
 *	  the ParamListInfo struct's address; they can therefore access all
 *	  three of the "arg" fields, and the distinction between paramFetchArg
 *	  and paramCompileArg is rather arbitrary.
 */
export type ParamListInfoData = {
  /** parameter fetch hook */
  paramFetch: any
  paramFetchArg: void
  /** parameter compile hook */
  paramCompile: any
  paramCompileArg: void
  /** parser setup hook */
  parserSetup: any
  parserSetupArg: void
  /** params as a single string for errors */
  paramValuesStr: string
  /** nominal/maximum # of Params represented */
  numParams: number
  /**
	 * params[] may be of length zero if paramFetch is supplied; otherwise it
	 * must be of length numParams.
	 */
}

/** ----------------
 *	  ParamExecData
 *
 *	  ParamExecData entries are used for executor internal parameters
 *	  (that is, values being passed into or out of a sub-query).  The
 *	  paramid of a PARAM_EXEC Param is a (zero-based) index into an
 *	  array of ParamExecData records, which is referenced through
 *	  es_param_exec_vals or ecxt_param_exec_vals.
 *
 *	  If execPlan is not NULL, it points to a SubPlanState node that needs
 *	  to be executed to produce the value.  (This is done so that we can have
 *	  lazy evaluation of InitPlans: they aren't executed until/unless a
 *	  result value is needed.)	Otherwise the value is assumed to be valid
 *	  when needed.
 * ----------------
 */
export type ParamExecData = {
  /** should be "SubPlanState *" */
  execPlan: void
  value: Datum
  isnull: boolean
}

/** type of argument for ParamsErrorCallback */
export type ParamsErrorCbData = {
  portalName: string
  params: ParamListInfo
}

/**
 * A NullableDatum is used in places where both a Datum and its nullness needs
 * to be stored. This can be more efficient than storing datums and nullness
 * in separate arrays, due to better spatial locality, even if more space may
 * be wasted due to padding.
 */
export type NullableDatum = {
  value: Datum
  isnull: boolean
  /** due to alignment padding this could be used for flags for free */
}

export type VacAttrStats = {
  /**
	 * These fields are set up by the main ANALYZE code before invoking the
	 * type-specific typanalyze function.
	 *
	 * Note: do not assume that the data being analyzed has the same datatype
	 * shown in attr, ie do not trust attr->atttypid, attlen, etc.  This is
	 * because some index opclasses store a different type than the underlying
	 * column/expression.  Instead use attrtypid, attrtypmod, and attrtype for
	 * information about the datatype being fed to the typanalyze function.
	 * Likewise, use attrcollid not attr->attcollation.
	 */
  /** copy of pg_attribute row for column */
  attr: any
  /** type of data being analyzed */
  attrtypid: Oid
  /** typmod of data being analyzed */
  attrtypmod: number
  /** copy of pg_type row for attrtypid */
  attrtype: any
  /** collation of data being analyzed */
  attrcollid: Oid
  /** where to save long-lived data */
  anl_context: any
  /**
	 * These fields must be filled in by the typanalyze routine, unless it
	 * returns false.
	 */
  /** function pointer */
  compute_stats: any
  /** Minimum # of rows wanted for stats */
  minrows: number
  /** for extra type-specific data */
  extra_data: void
  /**
	 * These fields are to be filled in by the compute_stats routine. (They
	 * are initialized to zero when the struct is created.)
	 */
  stats_valid: boolean
  /** fraction of entries that are NULL */
  stanullfrac?: number
  /** average width of column values */
  stawidth: number
  /** # distinct values */
  stadistinct: number
  stakind: number
  staop: Oid
  stacoll: Oid
  numnumbers: number
  stanumbers: number
  numvalues: number
  stavalues: Datum
  /**
	 * These fields describe the stavalues[n] element types. They will be
	 * initialized to match attrtypid, but a custom typanalyze function might
	 * want to store an array of something other than the analyzed column's
	 * elements. It should then overwrite these fields.
	 */
  statypid: Oid
  statyplen: number
  statypbyval: boolean
  statypalign: string
  /**
	 * These fields are private to the main ANALYZE code and should not be
	 * looked at by type-specific functions.
	 */
  /** attribute number within tuples */
  tupattnum: number
  /** access info for std fetch function */
  rows: any
  tupDesc: any
  /** access info for index fetch function */
  exprvals: Datum
  exprnulls: boolean
  rowstride: number
}

/**
 * Parameters customizing behavior of VACUUM and ANALYZE.
 *
 * Note that at least one of VACOPT_VACUUM and VACOPT_ANALYZE must be set
 * in options.
 *
 * When adding a new VacuumParam member, consider adding it to vacuumdb as
 * well.
 */
export type VacuumParams = {
  /** bitmask of VACOPT_* */
  options: number
  /** min freeze age, -1 to use default */
  freeze_min_age: number
  /** age at which to scan whole table */
  freeze_table_age: number
  /** min multixact freeze age, -1 to
											 * use default */
  multixact_freeze_min_age: number
  /** multixact age at which to scan
											 * whole table */
  multixact_freeze_table_age: number
  /** force a for-wraparound vacuum */
  is_wraparound: boolean
  /** minimum execution threshold in ms at
									 * which autovacuum is logged, -1 to use
									 * default */
  log_min_duration: number
  /** Do index vacuum and cleanup */
  index_cleanup: VacOptValue
  /** Truncate empty pages at the end */
  truncate: VacOptValue
  /**
	 * The number of parallel vacuum workers.  0 by default which means choose
	 * based on the number of indexes.  -1 indicates parallel vacuum is
	 * disabled.
	 */
  nworkers: number
}

/**
 * VacuumCutoffs is immutable state that describes the cutoffs used by VACUUM.
 * Established at the beginning of each VACUUM operation.
 */
export type VacuumCutoffs = {
  /**
	 * Existing pg_class fields at start of VACUUM
	 */
  relfrozenxid: TransactionId
  relminmxid: MultiXactId
  /**
	 * OldestXmin is the Xid below which tuples deleted by any xact (that
	 * committed) should be considered DEAD, not just RECENTLY_DEAD.
	 *
	 * OldestMxact is the Mxid below which MultiXacts are definitely not seen
	 * as visible by any running transaction.
	 *
	 * OldestXmin and OldestMxact are also the most recent values that can
	 * ever be passed to vac_update_relstats() as frozenxid and minmulti
	 * arguments at the end of VACUUM.  These same values should be passed
	 * when it turns out that VACUUM will leave no unfrozen XIDs/MXIDs behind
	 * in the table.
	 */
  OldestXmin: TransactionId
  OldestMxact: MultiXactId
  /**
	 * FreezeLimit is the Xid below which all Xids are definitely frozen or
	 * removed in pages VACUUM scans and cleanup locks.
	 *
	 * MultiXactCutoff is the value below which all MultiXactIds are
	 * definitely removed from Xmax in pages VACUUM scans and cleanup locks.
	 */
  FreezeLimit: TransactionId
  MultiXactCutoff: MultiXactId
}

/**
 * VacDeadItems stores TIDs whose index tuples are deleted by index vacuuming.
 */
export type VacDeadItems = {
  /** # slots allocated in array */
  max_items: number
  /** current # of entries */
  num_items: number
  /** Sorted array of TIDs to delete from indexes */
  items: any
}

export type Integer = {
  ival?: number
}

export type Float = {
  fval: string
}

export type Boolean = {
  boolval: boolean
}

export type String = {
  sval: string
}

export type BitString = {
  bsval: string
}

/** A qualified name for referencing a database object, e.g. "public.my_table" */
export type QualifiedName = { String: String }[]

export type List<T = Node> = { items: T[] }

export type A_Const =
  | BitString
  | Boolean
  | Float
  | Integer
  | String

/**
 * Expr - generic superclass for executable-expression nodes
 *
 * All node types that are used in executable expression trees should derive
 * from Expr (that is, have Expr as their first field).  Since Expr only
 * contains NodeTag, this is a formality, but it is an easy form of
 * documentation.  See also the ExprState node types in execnodes.h.
 */
export type Expr =
  | { A_ArrayExpr: A_ArrayExpr }
  | { A_Const: A_Const }
  | { A_Expr: A_Expr }
  | { BoolExpr: BoolExpr }
  | { BooleanTest: BooleanTest }
  | { CaseExpr: CaseExpr }
  | { CaseWhen: CaseWhen }
  | { CoalesceExpr: CoalesceExpr }
  | { ColumnRef: ColumnRef }
  | { CommonTableExpr: CommonTableExpr }
  | { CurrentOfExpr: CurrentOfExpr }
  | { FuncCall: FuncCall }
  | { GroupingFunc: GroupingFunc }
  | { JoinExpr: JoinExpr }
  | { JsonValueExpr: JsonValueExpr }
  | { List: List<Expr> }
  | { MinMaxExpr: MinMaxExpr }
  | { NamedArgExpr: NamedArgExpr }
  | { NullTest: NullTest }
  | { ParamRef: ParamRef }
  | { RowExpr: RowExpr }
  | { SQLValueFunction: SQLValueFunction }
  | { SetToDefault: SetToDefault }
  | { SubLink: SubLink }
  | { TypeCast: TypeCast }
  | { XmlExpr: XmlExpr }

export type Node =
  | { A_ArrayExpr: A_ArrayExpr }
  | { A_Const: A_Const }
  | { A_Expr: A_Expr }
  | { A_Indices: A_Indices }
  | { A_Indirection: A_Indirection }
  | { A_Star: A_Star }
  | { AccessPriv: AccessPriv }
  | { AlterDefaultPrivilegesStmt: AlterDefaultPrivilegesStmt }
  | { AlterDomainStmt: AlterDomainStmt }
  | { AlterEnumStmt: AlterEnumStmt }
  | { AlterEventTrigStmt: AlterEventTrigStmt }
  | { AlterExtensionContentsStmt: AlterExtensionContentsStmt }
  | { AlterExtensionStmt: AlterExtensionStmt }
  | { AlterFdwStmt: AlterFdwStmt }
  | { AlterForeignServerStmt: AlterForeignServerStmt }
  | { AlterFunctionStmt: AlterFunctionStmt }
  | { AlterObjectSchemaStmt: AlterObjectSchemaStmt }
  | { AlterOpFamilyStmt: AlterOpFamilyStmt }
  | { AlterOperatorStmt: AlterOperatorStmt }
  | { AlterOwnerStmt: AlterOwnerStmt }
  | { AlterPolicyStmt: AlterPolicyStmt }
  | { AlterPublicationStmt: AlterPublicationStmt }
  | { AlterRoleStmt: AlterRoleStmt }
  | { AlterSeqStmt: AlterSeqStmt }
  | { AlterStatsStmt: AlterStatsStmt }
  | { AlterSubscriptionStmt: AlterSubscriptionStmt }
  | { AlterTSConfigurationStmt: AlterTSConfigurationStmt }
  | { AlterTSDictionaryStmt: AlterTSDictionaryStmt }
  | { AlterTableCmd: AlterTableCmd }
  | { AlterTableMoveAllStmt: AlterTableMoveAllStmt }
  | { AlterTableSpaceOptionsStmt: AlterTableSpaceOptionsStmt }
  | { AlterTableStmt: AlterTableStmt }
  | { AlterTypeStmt: AlterTypeStmt }
  | { AlterUserMappingStmt: AlterUserMappingStmt }
  | { BoolExpr: BoolExpr }
  | { Boolean: Boolean }
  | { BooleanTest: BooleanTest }
  | { CallStmt: CallStmt }
  | { CaseExpr: CaseExpr }
  | { CaseWhen: CaseWhen }
  | { CheckPointStmt: CheckPointStmt }
  | { ClosePortalStmt: ClosePortalStmt }
  | { ClusterStmt: ClusterStmt }
  | { CoalesceExpr: CoalesceExpr }
  | { CollateClause: CollateClause }
  | { ColumnDef: ColumnDef }
  | { ColumnRef: ColumnRef }
  | { CommentStmt: CommentStmt }
  | { CommonTableExpr: CommonTableExpr }
  | { CompositeTypeStmt: CompositeTypeStmt }
  | { Constraint: Constraint }
  | { ConstraintsSetStmt: ConstraintsSetStmt }
  | { CopyStmt: CopyStmt }
  | { CreateAmStmt: CreateAmStmt }
  | { CreateCastStmt: CreateCastStmt }
  | { CreateConversionStmt: CreateConversionStmt }
  | { CreateDomainStmt: CreateDomainStmt }
  | { CreateEnumStmt: CreateEnumStmt }
  | { CreateEventTrigStmt: CreateEventTrigStmt }
  | { CreateExtensionStmt: CreateExtensionStmt }
  | { CreateFdwStmt: CreateFdwStmt }
  | { CreateForeignServerStmt: CreateForeignServerStmt }
  | { CreateForeignTableStmt: CreateForeignTableStmt }
  | { CreateFunctionStmt: CreateFunctionStmt }
  | { CreateOpClassItem: CreateOpClassItem }
  | { CreateOpClassStmt: CreateOpClassStmt }
  | { CreateOpFamilyStmt: CreateOpFamilyStmt }
  | { CreatePLangStmt: CreatePLangStmt }
  | { CreatePolicyStmt: CreatePolicyStmt }
  | { CreatePublicationStmt: CreatePublicationStmt }
  | { CreateRangeStmt: CreateRangeStmt }
  | { CreateRoleStmt: CreateRoleStmt }
  | { CreateSchemaStmt: CreateSchemaStmt }
  | { CreateSeqStmt: CreateSeqStmt }
  | { CreateStatsStmt: CreateStatsStmt }
  | { CreateStmt: CreateStmt }
  | { CreateSubscriptionStmt: CreateSubscriptionStmt }
  | { CreateTableAsStmt: CreateTableAsStmt }
  | { CreateTableSpaceStmt: CreateTableSpaceStmt }
  | { CreateTransformStmt: CreateTransformStmt }
  | { CreateTrigStmt: CreateTrigStmt }
  | { CreateUserMappingStmt: CreateUserMappingStmt }
  | { CurrentOfExpr: CurrentOfExpr }
  | { DeallocateStmt: DeallocateStmt }
  | { DeclareCursorStmt: DeclareCursorStmt }
  | { DefElem: DefElem }
  | { DefineStmt: DefineStmt }
  | { DeleteStmt: DeleteStmt }
  | { DiscardStmt: DiscardStmt }
  | { DistinctExpr: DistinctExpr }
  | { DoStmt: DoStmt }
  | { DropOwnedStmt: DropOwnedStmt }
  | { DropRoleStmt: DropRoleStmt }
  | { DropStmt: DropStmt }
  | { DropSubscriptionStmt: DropSubscriptionStmt }
  | { DropTableSpaceStmt: DropTableSpaceStmt }
  | { DropUserMappingStmt: DropUserMappingStmt }
  | { DropdbStmt: DropdbStmt }
  | { ExecuteStmt: ExecuteStmt }
  | { ExplainStmt: ExplainStmt }
  | { FetchStmt: FetchStmt }
  | { Float: Float }
  | { FuncCall: FuncCall }
  | { FunctionParameter: FunctionParameter }
  | { GrantRoleStmt: GrantRoleStmt }
  | { GrantStmt: GrantStmt }
  | { GroupingFunc: GroupingFunc }
  | { GroupingSet: GroupingSet }
  | { ImportForeignSchemaStmt: ImportForeignSchemaStmt }
  | { IndexElem: IndexElem }
  | { IndexStmt: IndexStmt }
  | { InsertStmt: InsertStmt }
  | { Integer: Integer }
  | { JoinExpr: JoinExpr }
  | { JsonArrayAgg: JsonArrayAgg }
  | { JsonArrayConstructor: JsonArrayConstructor }
  | { JsonArrayQueryConstructor: JsonArrayQueryConstructor }
  | { JsonIsPredicate: JsonIsPredicate }
  | { JsonKeyValue: JsonKeyValue }
  | { JsonObjectAgg: JsonObjectAgg }
  | { JsonObjectConstructor: JsonObjectConstructor }
  | { JsonValueExpr: JsonValueExpr }
  | { List: List }
  | { LoadStmt: LoadStmt }
  | { LockingClause: LockingClause }
  | { MergeStmt: MergeStmt }
  | { MergeWhenClause: MergeWhenClause }
  | { MinMaxExpr: MinMaxExpr }
  | { MultiAssignRef: MultiAssignRef }
  | { NamedArgExpr: NamedArgExpr }
  | { NotifyStmt: NotifyStmt }
  | { NullIfExpr: NullIfExpr }
  | { NullTest: NullTest }
  | { ObjectWithArgs: ObjectWithArgs }
  | { ParamRef: ParamRef }
  | { PartitionCmd: PartitionCmd }
  | { PartitionElem: PartitionElem }
  | { PartitionRangeDatum: PartitionRangeDatum }
  | { PrepareStmt: PrepareStmt }
  | { PublicationObjSpec: PublicationObjSpec }
  | { RangeFunction: RangeFunction }
  | { RangeSubselect: RangeSubselect }
  | { RangeTableFunc: RangeTableFunc }
  | { RangeTableFuncCol: RangeTableFuncCol }
  | { RangeTableSample: RangeTableSample }
  | { RangeVar: RangeVar }
  | { ReassignOwnedStmt: ReassignOwnedStmt }
  | { RefreshMatViewStmt: RefreshMatViewStmt }
  | { ReindexStmt: ReindexStmt }
  | { RenameStmt: RenameStmt }
  | { ReplicaIdentityStmt: ReplicaIdentityStmt }
  | { ResTarget: ResTarget }
  | { ReturnStmt: ReturnStmt }
  | { RoleSpec: RoleSpec }
  | { RowExpr: RowExpr }
  | { RuleStmt: RuleStmt }
  | { SQLValueFunction: SQLValueFunction }
  | { SecLabelStmt: SecLabelStmt }
  | { SelectStmt: SelectStmt }
  | { SetToDefault: SetToDefault }
  | { SortBy: SortBy }
  | { StatsElem: StatsElem }
  | { String: String }
  | { SubLink: SubLink }
  | { TableLikeClause: TableLikeClause }
  | { TransactionStmt: TransactionStmt }
  | { TriggerTransition: TriggerTransition }
  | { TruncateStmt: TruncateStmt }
  | { TypeCast: TypeCast }
  | { TypeName: TypeName }
  | { UpdateStmt: UpdateStmt }
  | { VacuumRelation: VacuumRelation }
  | { VacuumStmt: VacuumStmt }
  | { VariableSetStmt: VariableSetStmt }
  | { VariableShowStmt: VariableShowStmt }
  | { ViewStmt: ViewStmt }
  | { WindowDef: WindowDef }
  | { XmlExpr: XmlExpr }
  | { XmlSerialize: XmlSerialize }
