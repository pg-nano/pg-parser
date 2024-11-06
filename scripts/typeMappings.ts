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
 * If a field's nullability is incorrectly inferred, add it here.
 */
export const nullableFields = new Set(['Alias.colnames'])

function Node(types: string) {
  return types
    .split(' | ')
    .map(type => `{ ${type}: ${type} }`)
    .join(' | ')
}

function NodeArray(types: string) {
  return `(${Node(types)})[]`
}
