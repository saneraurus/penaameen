@echo off
setlocal
set "PATH=C:\Program Files\nodejs;%PATH%"
cd /d "%~dp0"

echo [1/3] Pulling latest changes from git...
git pull --ff-only
if errorlevel 1 (
  echo.
  echo Git pull failed. Commit or stash your local changes first, then run again.
  pause
  exit /b 1
)

echo.
echo [2/3] Installing dependencies...
call npm install
if errorlevel 1 (
  echo.
  echo npm install failed.
  pause
  exit /b 1
)

echo.
echo [3/3] Starting PENA AMEEN dev server...
echo Open http://localhost:3000 in your browser.
echo Press Ctrl+C to stop.
npm run dev
endlocal