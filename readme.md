# @pg-nano/pg-parser

A fork of [libpg-query](https://github.com/launchql/libpg-query-node) with best-in-class type definitions.

Not currently intended for use outside of [pg-nano](https://github.com/pg-nano/pg-nano), though it has the same API as its predecessor.

### Walking the AST

This package provides a `walk` function for easy AST traversal.

```ts
import { parseQuerySync, walk, NodeTag } from "@pg-nano/pg-parser"

walk(parseQuerySync(sql), (path) => {
  path.tag // string
  path.node // the node object
  path.parent // the parent node

  if (path.isSelectStmt()) {
    walk(path.node.targetList, {
      ColumnRef(path) {
        const id = path.node.fields
          .map((f) => (NodeTag.isString(f) ? f.String.sval : "*"))
          .join(".")

        console.log(id)
      },
    })

    // don't walk into the children
    return false
  }
})
```

### Type definitions

Every possible type that could be returned from libpg_query is defined in [ast.ts](https://github.com/pg-nano/pg-parser/blob/16-latest/ast.ts). If a type is missing, it's probably because libpg_query didn't tell us about it (otherwise, please [file an issue](https://github.com/pg-nano/pg-parser/issues)).

The type definitions are generated from the [srcdata](https://github.com/pganalyze/libpg_query/tree/16-latest/srcdata) of `libpg_query` (the C library this package binds to). If you're interested in how they're generated, see [scripts/generateTypes.ts](https://github.com/pg-nano/pg-parser/blob/16-latest/scripts/generateTypes.ts) and [scripts/inferFieldMetadata.ts](https://github.com/pg-nano/pg-parser/blob/16-latest/scripts/inferFieldMetadata.ts). For some cases, type definitions are manually specified in [scripts/typeMappings.ts](https://github.com/pg-nano/pg-parser/blob/16-latest/scripts/typeMappings.ts).

### Other improvements

- Uses `prebuild-install` to avoid bundling every platform's binaries into the package.
- Added `splitWithScannerSync` for SQL statement splitting.
- [Generated](https://github.com/pg-nano/pg-parser/blob/16-latest/scripts/generateTests.ts) unit tests (see [snapshots](https://github.com/pg-nano/pg-parser/tree/16-latest/test/postgres_regress/__snapshots__) of every SQL case supported by `libpg_query`).

### Features not included

- No `deparse` support (turning an AST back into a string), as this isn't needed for our use case.

### License

MIT
