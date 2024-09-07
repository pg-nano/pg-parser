@echo on
setlocal enabledelayedexpansion

if not defined CI (
    git submodule update --init --recursive
)

set buildDir=%cd%
set projectDir=%cd%\..

set MAKEFLAGS=
set MFLAGS=

cd ../libpg_query
nmake /F Makefile.msvc build

rem Search for pg_query.lib, error if not found
for /f "delims=" %%f in ('dir /b /s pg_query.lib') do set file=%%f
if not defined file (
    echo "ERROR: pg_query.lib not found"

)

rem Error if pg_query.h is missing
for /f "delims=" %%f in ('dir /b /s pg_query.h') do set file=%%f
if not defined file (
    echo "ERROR: pg_query.h not found"
)

rem Copy pg_query.lib to windows dir
copy /Y pg_query.lib "%projectDir%\libpg_query\"

rem Copy header
copy /Y pg_query.h "%projectDir%\libpg_query\"

rem Cleanup: revert to original directory
cd /D %buildDir%

exit /B 0
