@echo off
echo Starting SIH Platform with Authentication...

cd /d "%~dp0"

echo Starting Frontend (React)...
start "Frontend" cmd /k "npm run dev"

echo Starting Backend with Auth...
cd backend
start "Backend-Auth" cmd /k "node auth-server.js"

echo.
echo ✅ SIH Platform with Authentication Started!
echo 📧 Email system active for password delivery
echo 🔐 Team login system enabled
echo 👑 Admin credentials: admin/admin123
echo.
echo Frontend: http://localhost:5173
echo Backend: http://localhost:5001
echo.
pause