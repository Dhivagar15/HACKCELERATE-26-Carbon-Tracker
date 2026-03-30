# Carbon Tracker - Startup Guide

## Quick Start Options

### Option 1: Run Both Servers Together (Recommended)
```bash
# Double-click or run:
start-both.bat
```
This will start both frontend (port 3000) and backend (port 8001) simultaneously.

### Option 2: Run Servers Separately

#### Frontend Only
```bash
# Double-click or run:
start-frontend.bat

# Or manually:
npm run frontend
```
- Frontend: http://localhost:3000

#### Backend Only
```bash
# Double-click or run:
start-backend.bat

# Or manually:
cd backend
python main.py
```
- Backend API: http://localhost:8001
- API Documentation: http://localhost:8001/docs

## First Time Setup

### 1. Install Frontend Dependencies
```bash
npm install
```

### 2. Setup Backend
```bash
# Double-click or run:
setup-backend.bat

# Or manually:
cd backend
pip install -r requirements.txt
python init_db.py
```

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `npm run frontend` | Start React frontend | Port 3000 |
| `npm run backend` | Start FastAPI backend | Port 8001 |
| `npm run start:dev` | Start both servers | Concurrent mode |
| `npm run build` | Build for production | Creates dist/ folder |

## URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8001
- **API Docs**: http://localhost:8001/docs
- **API Schema**: http://localhost:8001/openapi.json

## Architecture

```
Frontend (React + Vite)  ←→  Backend (FastAPI + SQLite)
     Port 3000                    Port 8001
```

## Features Available

✅ **Dashboard**: Emissions overview and analytics  
✅ **Data Upload**: CSV file processing  
✅ **Hotspot Analysis**: Supplier and material breakdowns  
✅ **Recommendations**: AI-driven mitigation strategies  
✅ **Carbon Calculator**: Interactive emissions calculator  
✅ **Audit & Trust**: Data lineage and verification  

## Troubleshooting

### Frontend Issues
- Ensure Node.js 16+ is installed
- Run `npm install` if dependencies are missing
- Check port 3000 is not in use

### Backend Issues
- Ensure Python 3.8+ is installed
- Run `pip install -r requirements.txt` in backend folder
- Check port 8001 is not in use
- Verify database file `scopezero.db` exists in backend folder

### CORS Issues
- Backend is configured for frontend ports 3000 and 5173
- If using different ports, update CORS settings in `backend/main.py`

## Development

### Hot Reload
Both servers support hot reload:
- Frontend: Vite automatically reloads on file changes
- Backend: FastAPI reloads on Python file changes

### Database
- SQLite database: `backend/scopezero.db`
- Reset database: Delete the file and run `python init_db.py`

---

🚀 **Ready to track carbon emissions!**