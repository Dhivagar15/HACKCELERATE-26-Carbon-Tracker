# ScopeZero Backend API

Complete FastAPI backend that supports all existing UI features with PostgreSQL database.

## Features

✅ **Data Ingestion**: CSV upload, parsing, and storage
✅ **Carbon Calculations**: Server-side emission calculations using database factors
✅ **Dashboard Analytics**: Supplier, material, and transport breakdowns
✅ **Hotspot Analysis**: Dynamic ranking and contribution analysis
✅ **Recommendations**: Rule-based mitigation suggestions
✅ **Audit & Trust**: Data lineage, quality scores, and verification

## Quick Start

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Database Setup

Ensure PostgreSQL is running with your credentials:
- Username: `default`
- Password: `Ajay@2005`
- Host: `localhost`

### 3. Start Backend

**Windows:**
```bash
start.bat
```

**Linux/Mac:**
```bash
chmod +x start.sh
./start.sh
```

**Manual:**
```bash
python init_db.py
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 4. Verify Installation

- API Documentation: http://localhost:8000/docs
- Health Check: http://localhost:8000/api/dashboard

## API Endpoints

### Data Ingestion
- `POST /api/upload` - Upload CSV dataset
- `GET /api/records` - Get supply chain records

### Analytics
- `GET /api/dashboard` - Dashboard data (suppliers, materials, transport)
- `GET /api/recommendations` - Mitigation recommendations
- `GET /api/audit` - Audit and verification data

### Configuration
- `GET /api/emission-factors` - View emission factors database

## Database Schema

### Tables Created Automatically:
- `datasets` - Uploaded file metadata
- `supply_chain_records` - Raw supply chain data
- `emission_factors` - Material and transport factors
- `emissions` - Calculated emissions per record
- `mitigations` - Generated recommendations

## Emission Calculation Formula

```
Total Emissions = (Weight × Material Factor) + (Weight × Distance × Transport Factor)
```

### Material Factors (kg CO2e per kg):
- Steel: 1.85
- Aluminum: 12.5
- Plastic: 6.0
- Cotton: 8.2
- Industrial Parts: 2.4

### Transport Factors (kg CO2e per kg per km):
- Heavy Duty Truck: 0.1
- Cargo Ship: 0.015
- Air Cargo: 0.6
- Rail Freight: 0.03

## Frontend Integration

Update your React app to use backend APIs instead of local calculations:

```typescript
// Replace DataContext calculations with API calls
const uploadData = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('http://localhost:8000/api/upload', {
    method: 'POST',
    body: formData
  });
  
  return response.json();
};

const getDashboard = async () => {
  const response = await fetch('http://localhost:8000/api/dashboard');
  return response.json();
};
```

## Troubleshooting

### Database Connection Issues:
1. Ensure PostgreSQL is running
2. Verify credentials in `.env` file
3. Check if `scopezero` database exists

### Port Conflicts:
- Backend runs on port 8000
- Frontend should run on port 3000 or 5173
- Update CORS origins in `.env` if needed

### CSV Upload Issues:
- Ensure CSV has headers: Date, Supplier, Material, Weight, Distance, TransportMode, Region
- Backend handles flexible column naming and missing values

## Production Deployment

1. Update `.env` with production database URL
2. Set `DATABASE_URL=postgresql://user:pass@host:port/dbname`
3. Use production WSGI server: `gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker`

## Data Flow

1. **Upload**: CSV → Database (raw records)
2. **Calculate**: Apply emission factors → Store emissions
3. **Analyze**: Aggregate data → Generate insights
4. **Recommend**: Rule-based triggers → Create mitigations
5. **Serve**: API endpoints → Frontend dashboards