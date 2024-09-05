{
  "defines": [
    "NAPI_VERSION=<(napi_build_version)"
  ],
  "targets": [
    {
      "target_name": "libpg_query",
      "type": "none",
      "actions": [
        {
          "action_name": "build_libpg_query",
          "inputs": [],
          "outputs": [
            "libpg_query/libpg_query.a"
          ],
          "action": [
            "make",
            "-C",
            "libpg_query",
            "build"
          ]
        }
      ]
    },
    {
      "target_name": "queryparser",
      "dependencies": [
        "<!(node -p \"require('node-addon-api').gyp\")",
        "libpg_query"
      ],
      "sources": [
        "src/addon.cc",
        "src/helpers.cc",
        "src/sync.cc",
        "src/async.cc"
      ],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")",
        "libpg_query"
      ],
      "cflags!": [
        "-fno-exceptions"
      ],
      "cflags_cc!": [
        "-fno-exceptions"
      ],
      "xcode_settings": {
        "GCC_ENABLE_CPP_EXCEPTIONS": "YES",
        "CLANG_CXX_LIBRARY": "libc++",
        "MACOSX_DEPLOYMENT_TARGET": "10.7"
      },
      "msvs_settings": {
        "VCCLCompilerTool": {
          "ExceptionHandling": 1
        }
      }
    }
  ]
}
