@echo off
REM Playwright Environment Test Runner (Windows)
REM Usage: run-tests.bat [env] [optional: test file or --grep pattern]
REM Examples:
REM   run-tests.bat prod
REM   run-tests.bat staging tests/franklinTempletonInvestor.spec.js
REM   run-tests.bat beta --grep @smoke

setlocal enabledelayedexpansion

set ENV=%1
set TEST_FILE=%2
set EXTRA_ARGS=%3

if "%ENV%"=="" set ENV=staging

REM Validate environment
if /i "%ENV%"=="beta" goto valid_env
if /i "%ENV%"=="staging" goto valid_env
if /i "%ENV%"=="prod" goto valid_env
if /i "%ENV%"=="development" goto valid_env

echo X Error: Invalid environment '%ENV%'
echo Valid options: beta, staging, prod, development
echo.
echo Usage: run-tests.bat [env] [test-file] [extra-args]
echo Examples:
echo   run-tests.bat prod
echo   run-tests.bat staging tests/franklinTempletonInvestor.spec.js
echo   run-tests.bat beta --grep @smoke
exit /b 1

:valid_env
echo.
echo Running tests on %ENV% environment...
echo.
echo Environment: %ENV%
echo Test File: %TEST_FILE%
echo.

REM Run tests
set ENVIRONMENT=%ENV%
if "%TEST_FILE%"=="" (
  npx playwright test %EXTRA_ARGS%
) else (
  npx playwright test %TEST_FILE% %EXTRA_ARGS%
)

endlocal
