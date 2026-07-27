@echo off
title AuraStudy Launcher
echo ==========================================
echo       AuraStudy Project Launcher
echo ==========================================
echo.
echo Launching Backend Server on http://localhost:5000...
start "AuraStudy Backend" cmd /k "cd backend && npm run dev"

echo Launching Frontend Server on http://localhost:5173...
start "AuraStudy Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ==========================================
echo Both servers have been launched in separate windows!
echo - Keep them running while you use the application.
echo - Open your browser and go to: http://localhost:5173
echo ==========================================
echo.
pause
