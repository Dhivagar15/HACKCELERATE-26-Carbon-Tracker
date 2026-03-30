@echo off
echo Setting up Carbon Tracker Backend...
echo.
cd backend
echo Installing Python dependencies...
pip install -r requirements.txt
echo.
echo Initializing database...
python init_db.py
echo.
echo Backend setup complete!
echo You can now run: start-backend.bat
pause