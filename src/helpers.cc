#include "helpers.h"  // NOLINT(build/include)
#include "pg_query.h"
#include "helpers.h"
#include <napi.h>

Napi::Error CreateError(Napi::Env env, const PgQueryError& err)
{
    auto error = Napi::Error::New(env, err.message);
    error.Set("fileName", err.filename);
    error.Set("functionName", err.funcname);
    error.Set("lineNumber", Napi::Value::From(env, err.lineno));
    error.Set("cursorPosition", Napi::Value::From(env, err.cursorpos));
    error.Set("context", err.context ? Napi::Value::From(env, err.context) : env.Null());
    return error;
}

Napi::String QueryParseResult(Napi::Env env, const PgQueryParseResult& result)
{
    if (result.error) {
        auto throwVal = CreateError(env, *result.error);
        pg_query_free_parse_result(result);
        throw throwVal;
    }

    auto returnVal = Napi::String::New(env, result.parse_tree);
    pg_query_free_parse_result(result);
    return returnVal;
}

Napi::String PlPgSQLParseResult(Napi::Env env, const PgQueryPlpgsqlParseResult& result)
{
    if (result.error) {
        auto throwVal = CreateError(env, *result.error);
        pg_query_free_plpgsql_parse_result(result);
        throw throwVal;
    }

    auto returnVal = Napi::String::New(env, result.plpgsql_funcs);
    pg_query_free_plpgsql_parse_result(result);
    return returnVal;
}


Napi::String FingerprintResult(Napi::Env env, const PgQueryFingerprintResult & result)
{
  if (result.error) {
    auto throwVal = CreateError(env, *result.error);
    pg_query_free_fingerprint_result(result);
    throw throwVal;
  }

  auto returnVal = Napi::String::New(env, result.fingerprint_str);
  pg_query_free_fingerprint_result(result);
  return returnVal;
}
