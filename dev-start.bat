@echo off
REM PENA AMEEN — Dev Start (alias for run-server.bat)
REM Single-click: starts DB + Web together via scripts/start-all.mjs
setlocal
cd /d "%~dp0"
call "%~dp0run-server.bat"
endlocal
