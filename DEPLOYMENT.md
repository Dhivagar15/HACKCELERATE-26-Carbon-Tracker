# 🚀 Deployment Guide

## Backend → Render

### Steps:
1. **Create GitHub repo** with your code
2. **Go to render.com** → New Web Service
3. **Connect GitHub** → Select your repo
4. **Settings**:
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. **Deploy** → Get URL: `https://your-app.onrender.com`

## Frontend → Vercel

### Steps:
1. **Update API URL** in `src/config/api.ts`:
   ```typescript
   const API_BASE_URL = 'https://your-backend-app.onrender.com'
   ```
2. **Go to vercel.com** → Import Project
3. **Connect GitHub** → Select your repo
4. **Settings**:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. **Deploy** → Get URL: `https://your-app.vercel.app`

## Quick Commands

### Test Build Locally:
```bash
# Frontend
npm run build
npm run preview

# Backend  
cd backend
uvicorn main:app --host 0.0.0.0 --port 8001
```

### Environment Variables:
- **Render**: Auto-detects Python
- **Vercel**: Auto-detects Vite/React

## URLs After Deployment:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-app.onrender.com`
- **API Docs**: `https://your-app.onrender.com/docs`

## Files Created:
✅ `backend/render.yaml` - Render config  
✅ `vercel.json` - Vercel config  
✅ `src/config/api.ts` - API endpoints  
✅ Updated CORS for production