# @pg-nano/pg-parser

A fork of [libpg-query](https://github.com/launchql/libpg-query-node) with type definitions generated from the [srcdata](https://github.com/pganalyze/libpg_query/tree/16-latest/srcdata) of `libpg_query` (the C library this package binds to).

Not currently intended for use outside of [pg-nano](https://github.com/pg-nano/pg-nano), though it has the same API as its predecessor.

### Improvements

- Uses `prebuild-install` to avoid bundling every platform's binaries into the package.
- Added `splitWithScannerSync` for SQL statement splitting.
- [Generated](https://github.com/pg-nano/pg-parser/blob/16-latest/scripts/generateTests.ts) unit tests (see a snapshot of every SQL case supported by `libpg_query`).
- [Generated](https://github.com/pg-nano/pg-parser/blob/16-latest/scripts/generateTypes.ts) type definitions!
