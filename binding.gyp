{
    "defines": [
        "NAPI_VERSION=<(napi_build_version)"
    ],
    "targets": [
        {
            "target_name": "queryparser",
            "sources": [
                "src/addon.cc",
                "src/helpers.cc",
                "src/sync.cc",
                "src/async.cc"
            ],
            "dependencies": [
                "<!(node -p \"require('node-addon-api').gyp\")"
            ],
            "include_dirs": [
                "<!@(node -p \"require('node-addon-api').include\")",
                "<!@(pwd)/libpg_query",
                "<!@(pwd)/libpg_query/vendor",
            ],
            "cflags!": [
                "-fno-exceptions"
            ],
            "cflags_cc!": [
                "-fno-exceptions"
            ],
            "conditions": [
                [
                    'OS=="linux"',
                    {
                        "libraries": [
                            "-L<!(pwd)/libpg_query",
                            "-lpg_query"
                        ],
                        "actions": [{
                            "action_name": "build_libpg_query",
                            "inputs": [],
                            "outputs": ["libpg_query/libpg_query.a"],
                            "action": ["scripts/build_libpg_query.sh"]
                        }],
                    }
                ],
                [
                    'OS=="mac"',
                    {
                        "libraries": [
                            "-L<!(pwd)/libpg_query",
                            "-lpg_query"
                        ],
                        "xcode_settings": {
                            "CLANG_CXX_LIBRARY": "libc++",
                            "GCC_ENABLE_CPP_EXCEPTIONS": "YES",
                            "MACOSX_DEPLOYMENT_TARGET": "14.0"
                        },
                        "actions": [{
                            "action_name": "build_libpg_query",
                            "inputs": [],
                            "outputs": ["libpg_query/libpg_query.a"],
                            "action": ["scripts/build_libpg_query.sh"]
                        }],
                    }
                ],
                [
                    'OS=="win"',
                    {
                        "link_settings": {
                            "library_dirs": [
                                "../libpg_query"
                            ],
                            "libraries": [
                                "../libpg_query/pg_query.lib"
                            ]
                        },
                        "msvs_settings": {
                            "VCCLCompilerTool": {
                                "ExceptionHandling": 0,
                                "AdditionalOptions": [
                                    "/EHsc"
                                ]
                            }
                        },
                        "defines": [
                            "NAPI_DISABLE_CPP_EXCEPTIONS"
                        ],
                        "actions": [{
                            "action_name": "build_libpg_query",
                            "inputs": [],
                            "outputs": ["libpg_query/libpg_query.lib"],
                            "action": ["cmd", "/C", "scripts/build_libpg_query.bat"]
                        }],
                    }
                ]
            ]
        }
    ]
}
