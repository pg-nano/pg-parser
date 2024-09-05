#include "pg_query.h"
#include <napi.h>

Napi::Error CreateError(Napi::Env env, const PgQueryError& err);
Napi::String QueryParseResult(Napi::Env env, const PgQueryParseResult& result);
Napi::String PlPgSQLParseResult(Napi::Env env, const PgQueryPlpgsqlParseResult& result);
Napi::String FingerprintResult(Napi::Env env, const PgQueryFingerprintResult & result);
