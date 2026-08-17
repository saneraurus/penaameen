@echo off
setlocal
set "PATH=C:\Program Files\nodejs;%PATH%"
cd /d "%~dp0"
echo Starting PENA AMEEN dev server (foundation only)...
echo Open http://localhost:3000 in your browser.
echo Press Ctrl+C to stop.
npm run dev
endlocal
