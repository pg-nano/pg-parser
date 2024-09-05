#include <napi.h>

Napi::Value ParseQueryAsync(const Napi::CallbackInfo& info);
Napi::Value ParsePlPgSQLAsync(const Napi::CallbackInfo& info);
Napi::Value FingerprintAsync(const Napi::CallbackInfo& info);
