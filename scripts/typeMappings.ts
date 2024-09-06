export const typeMappings: Record<string, string> = {
  void: "void",
  bool: "boolean",
  bits32: "number",
  char: "string",
  "char*": "string",
  double: "number",
  float4: "number",
  long: "number",
  int: "number",
  int16: "number",
  int32: "number",
  uint16: "number",
  uint32: "number",
  uint64: "number",
  "unsigned int": "number",
  "signed int": "number",
  NameData: "string",
  Node: "Node",
  "[]Node": "Node[]",
  RelFileNumber: "number",

  // Overrides
  List: "any[]",
  "Alias.colnames": NodeArray("String"),
  "AlterSeqStmt.options": NodeArray("DefElem"),
  "AlterTableStmt.cmds": NodeArray("AlterTableCmd"),
  "ColumnRef.fields": NodeArray("String | A_Star"),
  "CreateOpClassItem.class_args": NodeArray("TypeName"),
  "CreateSeqStmt.options": NodeArray("DefElem"),
  "DefElem.arg": "TypeName | String | Integer | Float",
  "DropRoleStmt.roles": NodeArray("RoleSpec"),
  "LockingClause.lockedRels": NodeArray("RangeVar"),
  "ObjectWithArgs.objargs": NodeArray("TypeName"),
  "ObjectWithArgs.objname": NodeArray("String"),
  "PartitionElem.collation": NodeArray("String"),
  "RangeSubselect.subquery": "SelectStmt",
  "SelectStmt.valuesLists": "List<Expr>[]",
  "TypeName.names": NodeArray("String"),
}

function Node(types: string) {
  return types
    .split(" | ")
    .map((type) => `{ ${type}: ${type} }`)
    .join(" | ")
}

function NodeArray(types: string) {
  return `(${Node(types)})[]`
}
