@echo off
title F1 Pit Wall Dashboard - Local Control Room
echo ========================================================
echo   SCUDERIA FERRARI // PIT WALL COMMAND DASHBOARD
echo   Formula 1 Live Timing Daemon + Web Dashboard
echo ========================================================
echo.
echo [1/2] Starting F1 Live API SignalR Daemon (Port 3001)...
start "F1 Live API Daemon" cmd /k "cd f1-live-api && node src/index.js"
echo [2/2] Starting Vite Frontend Server (Port 5173)...
start "F1 Pit Wall Frontend" cmd /k "npm run dev"
echo.
echo Dashboard URL: http://localhost:5173/
echo API Daemon URL: http://localhost:3001/
echo.
echo Opening browser in 3 seconds...
timeout /t 3 /nobreak >nul
start http://localhost:5173/
