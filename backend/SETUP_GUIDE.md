# ScopeZero Backend Setup Guide

## Complete Backend & Database Implementation

This backend provides full support for all existing UI features with no placeholders or missing logic.

## 🚀 Quick Setup (5 minutes)

### Step 1: Install Python Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### Step 2: Ensure PostgreSQL is Running
- Username: `default`
- Password: `Ajay@2005`
- Host: `localhost`
- Port: `5432` (default)

### Step 3: Start Backend
```bash
# Windows
start.bat

# Linux/Mac
chmod +x start.sh && ./start.sh

# Manual
python init_db.py
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Step 4: Verify Installation
```bash
python test_api.py
```

## 📊 Database Schema (Auto-Created)

### Tables:
1. **datasets** - File upload metadata
2. **supply_chain_records** - Raw CSV data
3. **emission_factors** - Material & transport factors
4. **emissions** - Calculated emissions per record
5. **mitigations** - Generated recommendations

### Emission Factors (Pre-loaded):
- **Materials**: Steel (1.85), Aluminum (12.5), Plastic (6.0), Cotton (8.2)
- **Transport**: Truck (0.1), Ship (0.015), Air (0.6), Rail (0.03)

## 🔗 API Endpoints

### Data Ingestion
- `POST /api/upload` - Upload CSV, parse, calculate emissions
- `GET /api/records` - Get processed records

### Dashboard Analytics
- `GET /api/dashboard` - Complete dashboard data
  - Total emissions
  - Supplier breakdown with contributions
  - Material lifecycle analysis
  - Transport mode emissions
  - Category breakdown (Materials/Logistics/Others)

### Hotspot Analysis
- Supplier ranking by emissions
- Material intensity percentages
- Transport mode comparisons
- Regional attribution

### Recommendations Engine
- `GET /api/recommendations` - Rule-based mitigations
  - Air cargo → Ocean freight (85% reduction)
  - Steel recycling (25% reduction)
  - Aluminum renewable sourcing (30% reduction)

### Audit & Verification
- `GET /api/audit` - Data quality metrics
  - Completeness scores
  - Factor coverage
  - Record traceability

## 🧮 Emission Calculation Engine

### Formula (Server-Side):
```
Total Emissions = (Weight × Material Factor) + (Weight × Distance × Transport Factor)
```

### Example:
- 1000kg Steel, 500km by Truck
- Material: 1000 × 1.85 = 1,850 kg CO2e
- Transport: 1000 × 500 × 0.1 = 50,000 kg CO2e
- **Total: 51,850 kg CO2e**

## 🔄 Frontend Integration

Replace your DataContext with API calls:

```typescript
// Install in src/services/api.ts
import { apiService } from './services/api';

// Upload CSV
const result = await apiService.uploadDataset(file);

// Get dashboard data
const dashboard = await apiService.getDashboard();

// Get recommendations
const recommendations = await apiService.getRecommendations();
```

## ✅ Features Implemented

### ✅ Data Ingestion & Intelligence Intake
- CSV upload with flexible column mapping
- Server-side parsing and validation
- Row/supplier/material counting
- Ingestion timestamps
- Raw data preservation

### ✅ Carbon Calculation Engine
- Database-driven emission factors
- Deterministic calculations
- Material + transport emissions
- Separate storage of calculated values
- Source attribution

### ✅ Overview Dashboard
- Total Scope 3 emissions
- Supplier contribution percentages
- Material lifecycle breakdown
- Transport mode analysis
- Dynamic updates on data changes

### ✅ Hotspot Intelligence
- Supplier ranking by emissions
- Material intensity analysis
- Transport efficiency metrics
- Regional emission attribution
- Real-time recalculation

### ✅ Recommendations & Mitigation
- Rule-based trigger system
- Threshold-based activation
- Before/after emission calculations
- Feasibility and confidence scoring
- Priority ranking
- Cost/ROI estimates

### ✅ Audit & Verification Suite
- Complete data lineage
- Record-level traceability
- Emission factor sources
- Data quality indicators
- Calculation transparency

## 🎯 Validation Results

Every number in your UI now comes from:
1. **Uploaded CSV data** (stored in database)
2. **Server-side calculations** (using database factors)
3. **Real-time aggregations** (via SQL queries)
4. **Rule-based recommendations** (triggered by thresholds)

## 🔧 Troubleshooting

### Database Issues:
```bash
# Check PostgreSQL status
pg_ctl status

# Restart PostgreSQL
pg_ctl restart

# Create database manually
createdb -U default scopezero
```

### API Issues:
```bash
# Check if backend is running
curl http://localhost:8000/api/dashboard

# View logs
uvicorn main:app --log-level debug
```

### CSV Upload Issues:
- Ensure headers include: Date, Supplier, Material, Weight
- Backend handles flexible naming (case-insensitive)
- Missing values get defaults

## 🚀 Production Deployment

1. Update database URL in `.env`
2. Use production WSGI server
3. Configure CORS for your domain
4. Set up SSL certificates
5. Monitor with logging

## 📈 Performance

- **Database**: Indexed queries for fast aggregations
- **API**: Async FastAPI with connection pooling
- **Calculations**: Batch processing for large datasets
- **Caching**: SQLAlchemy query optimization

Your backend is now complete and production-ready! 🎉