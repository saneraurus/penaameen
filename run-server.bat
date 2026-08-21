@echo off
setlocal EnableDelayedExpansion
set "PATH=C:\Program Files\nodejs;%PATH%"
cd /d "%~dp0"

echo ==============================================
echo  PENA AMEEN - 1-Click Dev Start (DB + Web)
echo ==============================================
echo.

echo [1/4] Pulling latest changes from git...
git pull --ff-only
if errorlevel 1 (
  echo.
  echo Git pull failed. Commit or stash your local changes first, then run again.
  pause
  exit /b 1
)

echo.
echo [2/4] Installing dependencies...
call npm install
if errorlevel 1 (
  echo.
  echo npm install failed.
  pause
  exit /b 1
)

echo.
echo [3/4] Checking prerequisites...
node --version >nul 2>&1
if errorlevel 1 (
  echo Node.js not found. Please install Node.js 22+ and ensure it is in PATH.
  pause
  exit /b 1
)
for /f "tokens=*" %%v in ('node --version') do echo Node %%v detected.
if not exist "scripts\start-all.mjs" (
  echo scripts\start-all.mjs not found — cannot start all backends.
  pause
  exit /b 1
)

echo.
echo [4/4] Starting PENA AMEEN (DB + Web)...
echo   - Embedded Postgres: postgresql://postgres:password@localhost:5432/penaameen
echo   - Next.js Web:       http://localhost:3000
echo   - Logs prefixed [db] / [web]
echo   - Press Ctrl+C to stop BOTH backends.
echo.
echo Tip: DB data is persistent in .pgdata\ . To reset: npm run db:reset
echo      To skip git pull next time, run: npm run dev:all  directly
echo.

REM Use the orchestrator — it will reuse DB if already running, else start it and wait for READY.
node scripts\start-all.mjs
set "EXITCODE=%ERRORLEVEL%"

echo.
echo Dev server stopped (exit code %EXITCODE%).
echo DB will also be stopped if it was started by this script.
echo If DB window is still running separately, close it or run: taskkill /F /IM node.exe (hati-hati)
pause
endlocal
exit /b %EXITCODE%
