#include <napi.h>
#include <string>
#include "sync.h"  // NOLINT(build/include)
#include "helpers.h"  // NOLINT(build/include)

Napi::String ParseQuerySync(const Napi::CallbackInfo& info) {
  std::string query = info[0].As<Napi::String>();
  PgQueryParseResult result = pg_query_parse(query.c_str());

  return QueryParseResult(info.Env(), result);
}

Napi::String ParsePlPgSQLSync(const Napi::CallbackInfo& info) {
  std::string query = info[0].As<Napi::String>();
  PgQueryPlpgsqlParseResult result = pg_query_parse_plpgsql(query.c_str());

  return PlPgSQLParseResult(info.Env(), result);
}

Napi::String FingerprintSync(const Napi::CallbackInfo& info) {
  std::string query = info[0].As<Napi::String>();
  PgQueryFingerprintResult result = pg_query_fingerprint(query.c_str());

  return FingerprintResult(info.Env(), result);
}

Napi::Value SplitWithScannerSync(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  if (info.Length() < 1 || !info[0].IsString()) {
    Napi::TypeError::New(env, "String expected").ThrowAsJavaScriptException();
    return env.Null();
  }

  std::string input = info[0].As<Napi::String>().Utf8Value();
  PgQuerySplitResult result = pg_query_split_with_scanner(input.c_str());

  if (result.error) {
    Napi::Error::New(env, result.error->message).ThrowAsJavaScriptException();
    pg_query_free_split_result(result);
    return env.Null();
  }

  Napi::Array statements = Napi::Array::New(env, result.n_stmts);

  for (int i = 0; i < result.n_stmts; i++) {
    Napi::Object stmt = Napi::Object::New(env);
    stmt.Set("location", result.stmts[i]->stmt_location);
    stmt.Set("length", result.stmts[i]->stmt_len);
    statements[i] = stmt;
  }

  pg_query_free_split_result(result);

  return statements;
}

