@echo off
echo Starting Carbon Tracker - Full Stack...
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:8001
echo.
npm install
echo.
echo Starting both servers...
start "Frontend" cmd /k "npm run frontend"
start "Backend" cmd /k "cd backend && python main.py"
echo.
echo Both servers are starting in separate windows...
echo Frontend: http://localhost:3000
echo Backend: http://localhost:8001
pause