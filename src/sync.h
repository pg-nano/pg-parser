#include <napi.h>

Napi::String ParseQuerySync(const Napi::CallbackInfo& info);
Napi::String ParsePlPgSQLSync(const Napi::CallbackInfo& info);
Napi::String FingerprintSync(const Napi::CallbackInfo& info);
