@echo off
echo Starting SIH 2025 Auto-Builder...
echo.

echo Starting Backend Server...
start "Backend" cmd /k "cd backend && node server.js"

timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
start "Frontend" cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
pause