#include <napi.h>
#include "sync.h"   // NOLINT(build/include)
#include "async.h"  // NOLINT(build/include)

// Expose synchronous and asynchronous access to our parsing functions
Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(
    Napi::String::New(env, "parseQuerySync"),
    Napi::Function::New(env, ParseQuerySync)
  );

  exports.Set(
    Napi::String::New(env, "parseQueryAsync"),
    Napi::Function::New(env, ParseQueryAsync)
  );

  exports.Set(
    Napi::String::New(env, "parsePlPgSQLSync"),
    Napi::Function::New(env, ParsePlPgSQLSync)
  );

  exports.Set(
    Napi::String::New(env, "parsePlPgSQLAsync"),
    Napi::Function::New(env, ParsePlPgSQLAsync)
  );

  exports.Set(
      Napi::String::New(env, "fingerprintSync"),
      Napi::Function::New(env, FingerprintSync)
  );

  exports.Set(
      Napi::String::New(env, "fingerprintAsync"),
      Napi::Function::New(env, FingerprintAsync)
  );

  return exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init)
