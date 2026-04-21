@echo off
cd /d "%~dp0"
call npm install
echo.
echo Installation complete! To start the dev server, run:
echo npm run dev
pause
