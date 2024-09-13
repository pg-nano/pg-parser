# @pg-nano/pg-parser

A fork of [libpg-query](https://github.com/launchql/libpg-query-node) with best-in-class type definitions.

Not currently intended for use outside of [pg-nano](https://github.com/pg-nano/pg-nano), though it has the same API as its predecessor.

### Walking the AST

I've added a `walk` function for easy AST traversal. You can pass a callback or a visitor object. You can return false to not walk into the children of the current node.

Each node passed to your visitor is wrapped in a `NodePath` instance, which tracks the parent node and provides type guards (e.g. `isSelectStmt`) for type narrowing. You can access the underlying node with `path.node`.

```ts
import { parseQuerySync, walk, NodeTag } from "@pg-nano/pg-parser"

walk(parseQuerySync(sql), (path) => {
  path.tag // string
  path.node // the node object
  path.parent // the parent node

  if (path.isSelectStmt()) {
    // The visitor pattern is also supported.
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

I've also added a `select` function for type-safe, deep field access through dot-notation. You must not include the node types in the field path.

```ts
import { select, Expr } from "@pg-nano/pg-parser"

/**
 * Given an expression node of many possible types,
 * check for a `typeName` field.
 */
const typeName = select(expr as Expr, 'typeName')
//    ^? TypeName | undefined
```

Similar to `select`, you may like the `$` function for field access. It returns a proxy that makes field access less verbose. It also comes with type guards for all nodes.

```ts
import { $, walk } from "@pg-nano/pg-parser"

walk(ast, {
  SelectStmt(path) {
    for (const target of path.node.targetList) {
      const { name, val } = $(target)

      if ($.isColumnRef(val)) {
        console.log(
          name,
          $(val).fields.map(field => {
            return $.isA_Star(field) ? "*" : field.String.sval
          }).join("."),
        )
      }
    }
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

## Contributing

To generate the type definitions, you can use this command:

```sh
pnpm prepare:types
```

To compile the TypeScript bindings and the C++ addon (and recompile them on file changes), you can use this command:

```sh
pnpm dev
```

Otherwise, `pnpm build` will compile just once.

If you're editing C++ code, you'll want to have [compiledb](https://github.com/nickdiego/compiledb) installed and the [clangd extension](https://marketplace.visualstudio.com/items?itemName=llvm-vs-code-extensions.vscode-clangd) in VSCode. This enables the `clangd` language server for features like autocomplete, static analysis, and code navigation.

```sh
brew install compiledb
```

**⚠️ Windows support:** The `binding.gyp` file is currently broken for Windows builds. Any help would be appreciated!

## License

MIT
