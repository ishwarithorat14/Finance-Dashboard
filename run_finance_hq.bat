@echo off
title FINANCE HQ - Personal Finance Learning & Market Intelligence Dashboard
echo ======================================================================
echo       FINANCE HQ: Personal Finance Learning & Market Intelligence      
echo ======================================================================
echo.

:: Ensure portable node is accessible if installed
if exist "%LOCALAPPDATA%\Programs\nodejs" (
    set "PATH=%LOCALAPPDATA%\Programs\nodejs;%PATH%"
)

cd /d "%~dp0"

echo Starting FastAPI Backend and Serving Finance HQ Workspace...
echo.
echo Application URLs:
echo   - Finance HQ Terminal : http://127.0.0.1:8000
echo   - Interactive API Docs : http://127.0.0.1:8000/docs
echo.
echo Opening browser in 2 seconds...
echo.

:: Automatically open browser after 2 seconds
start "" cmd /c "timeout /t 2 /nobreak >nul & start http://127.0.0.1:8000"

:: Start FastAPI backend
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload

if errorlevel 1 (
    echo.
    echo [ERROR] Python failed to start uvicorn. Trying py launcher...
    py -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
)

pause
