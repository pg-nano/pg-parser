#!/bin/sh
set -e
set -x

if [ -z "$CI" ]; then
    git submodule update --init --recursive
fi

unset MAKEFLAGS
unset MFLAGS

cd libpg_query
make build
