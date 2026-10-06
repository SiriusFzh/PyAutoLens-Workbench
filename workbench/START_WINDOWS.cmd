@echo off
setlocal
cd /d "%~dp0"
where py >nul 2>nul || (
  echo Python 3.12 or newer and the Python Launcher are required.
  echo Download Python from https://www.python.org/downloads/
  pause
  exit /b 1
)
py -3.12 -c "import sys" >nul 2>nul
if errorlevel 1 (
  py -3 "..\start.py"
) else (
  py -3.12 "..\start.py"
)
if errorlevel 1 pause
