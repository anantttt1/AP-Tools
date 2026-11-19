@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is required. Install Node.js 22.12 or newer and restart this terminal.
  pause
  exit /b 1
)
echo AP TOOLS requires Node.js 22.12 or newer.
node -v
node -e "const [major,minor]=process.versions.node.split('.').map(Number);process.exit(major>22||(major===22&&minor>=12)?0:1)"
if errorlevel 1 (
  echo Please upgrade Node.js to version 22.12 or newer.
  pause
  exit /b 1
)
if not exist "node_modules\vite\bin\vite.js" goto install
if not exist "node_modules\react\package.json" goto install
if not exist "node_modules\pdfjs-dist\package.json" goto install
if not exist "node_modules\jszip\package.json" goto install
goto run
:install
echo Installing or repairing AP TOOLS dependencies. This requires an internet connection.
call npm install
if errorlevel 1 (
  echo.
  echo Dependency installation failed. Check your internet connection and Node.js/npm installation.
  pause
  exit /b 1
)
:run
echo Starting AP TOOLS on this computer only...
call npm run dev
pause
