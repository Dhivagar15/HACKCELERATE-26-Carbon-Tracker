from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
import csv
import io
from datetime import datetime

from database import get_db, create_tables, init_emission_factors
from models import Dataset, SupplyChainRecord, EmissionFactor, Emission, Mitigation
from schemas import *

app = FastAPI(title="ScopeZero Carbon Intelligence API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    create_tables()
    db = next(get_db())
    init_emission_factors(db)

def calculate_emissions(record: SupplyChainRecord, db: Session) -> tuple:
    """Calculate emissions for a record using database emission factors"""
    
    # Get material emission factor
    material_factor = db.query(EmissionFactor).filter(
        EmissionFactor.category == "material",
        EmissionFactor.name == record.material
    ).first()
    
    if not material_factor:
        material_factor_value = 1.0  # Default fallback
    else:
        material_factor_value = material_factor.factor
    
    # Get transport emission factor
    transport_factor = db.query(EmissionFactor).filter(
        EmissionFactor.category == "transport",
        EmissionFactor.name == record.transport_mode
    ).first()
    
    if not transport_factor:
        transport_factor_value = 0.05  # Default fallback
    else:
        transport_factor_value = transport_factor.factor
    
    # Calculate emissions: (Weight × Material Factor) + (Weight × Distance × Transport Factor)
    material_emission = record.quantity_kg * material_factor_value
    transport_emission = record.quantity_kg * (record.distance_km or 0) * transport_factor_value
    total_emission = material_emission + transport_emission
    
    return material_emission, transport_emission, total_emission

def generate_mitigations(db: Session):
    """Generate rule-based mitigations based on current data"""
    
    # Clear existing mitigations
    db.query(Mitigation).delete()
    
    # Get transport emissions by mode
    transport_emissions = db.query(
        SupplyChainRecord.transport_mode,
        func.sum(Emission.transport_emission).label('total_transport')
    ).join(Emission).group_by(SupplyChainRecord.transport_mode).all()
    
    # Get material emissions
    material_emissions = db.query(
        SupplyChainRecord.material,
        func.sum(Emission.material_emission).label('total_material')
    ).join(Emission).group_by(SupplyChainRecord.material).all()
    
    mitigations = []
    priority = 1
    
    # Air cargo mitigation
    air_emissions = sum(t.total_transport for t in transport_emissions if 'Air' in t.transport_mode)
    if air_emissions > 1000:
        mitigations.append(Mitigation(
            trigger_reason="High air cargo emissions detected",
            action="Switch from air cargo to ocean freight for non-urgent shipments",
            reduction_absolute=air_emissions * 0.85,
            reduction_percentage=85.0,
            feasibility="High",
            confidence="High",
            priority_rank=priority,
            cost_estimate="$12,000",
            savings_estimate="$95,000"
        ))
        priority += 1
    
    # Steel recycling mitigation
    steel_emissions = sum(m.total_material for m in material_emissions if m.material == 'Steel')
    if steel_emissions > 2000:
        mitigations.append(Mitigation(
            trigger_reason="High steel material emissions",
            action="Integrate recycled steel components to reduce primary extraction footprint",
            reduction_absolute=steel_emissions * 0.25,
            reduction_percentage=25.0,
            feasibility="Medium",
            confidence="High",
            priority_rank=priority,
            cost_estimate="$18,000",
            savings_estimate="$7,000"
        ))
        priority += 1
    
    # Aluminum optimization
    aluminum_emissions = sum(m.total_material for m in material_emissions if m.material == 'Aluminum')
    if aluminum_emissions > 1500:
        mitigations.append(Mitigation(
            trigger_reason="High aluminum emissions detected",
            action="Source aluminum from suppliers using renewable energy in smelting process",
            reduction_absolute=aluminum_emissions * 0.30,
            reduction_percentage=30.0,
            feasibility="Medium",
            confidence="Medium",
            priority_rank=priority,
            cost_estimate="$25,000",
            savings_estimate="$15,000"
        ))
        priority += 1
    
    for mitigation in mitigations:
        db.add(mitigation)
    
    db.commit()

@app.post("/api/upload", response_model=UploadResponse)
async def upload_dataset(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Upload and process CSV dataset"""
    
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")
    
    # Create dataset record
    dataset = Dataset(filename=file.filename)
    db.add(dataset)
    db.commit()
    db.refresh(dataset)
    
    # Read and parse CSV
    content = await file.read()
    csv_text = content.decode('utf-8')
    csv_reader = csv.DictReader(io.StringIO(csv_text))
    
    # Normalize column names
    fieldnames = [name.strip().lower() for name in csv_reader.fieldnames or []]
    
    # Column mapping
    column_map = {
        'date': ['date', 'time', 'timestamp', 'period'],
        'supplier': ['supplier', 'vendor', 'entity', 'company', 'name'],
        'material': ['material', 'material type', 'type', 'item'],
        'weight': ['weight', 'weight (kg)', 'kgs', 'mass', 'quantity'],
        'distance': ['distance', 'distance (km)', 'km', 'length', 'trip'],
        'transport_mode': ['transportmode', 'transport mode', 'mode', 'method', 'logistics'],
        'region': ['region', 'location', 'country', 'origin']
    }
    
    def find_column(variants):
        for field in fieldnames:
            if field in variants:
                return field
        return None
    
    # Map columns
    mapped_cols = {}
    for key, variants in column_map.items():
        mapped_cols[key] = find_column(variants)
    
    records_processed = 0
    suppliers = set()
    materials = set()
    
    # Reset CSV reader
    csv_reader = csv.DictReader(io.StringIO(csv_text))
    
    for row in csv_reader:
        try:
            # Normalize row keys
            row_normalized = {k.strip().lower(): v for k, v in row.items()}
            
            # Extract data with fallbacks
            supplier = str(row_normalized.get(mapped_cols['supplier'], 'Unknown Supplier'))
            material = str(row_normalized.get(mapped_cols['material'], 'Other'))
            weight = float(row_normalized.get(mapped_cols['weight'], 0))
            distance = float(row_normalized.get(mapped_cols['distance'], 0))
            transport_mode = str(row_normalized.get(mapped_cols['transport_mode'], 'Heavy Duty Truck'))
            region = str(row_normalized.get(mapped_cols['region'], 'Global'))
            date = str(row_normalized.get(mapped_cols['date'], datetime.now().strftime('%Y-%m-%d')))
            
            if weight <= 0:
                continue
            
            # Create record
            record = SupplyChainRecord(
                dataset_id=dataset.id,
                invoice_id=f"INV-{records_processed + 1}",
                supplier=supplier,
                supplier_region=region,
                material=material,
                quantity_kg=weight,
                transport_mode=transport_mode,
                distance_km=distance,
                invoice_date=date
            )
            
            db.add(record)
            db.flush()  # Get the ID
            
            # Calculate emissions
            material_emission, transport_emission, total_emission = calculate_emissions(record, db)
            
            # Create emission record
            emission = Emission(
                record_id=record.id,
                material_emission=material_emission,
                transport_emission=transport_emission,
                total_emission=total_emission
            )
            
            db.add(emission)
            
            suppliers.add(supplier)
            materials.add(material)
            records_processed += 1
            
        except Exception as e:
            continue
    
    db.commit()
    
    # Generate mitigations based on new data
    generate_mitigations(db)
    
    return UploadResponse(
        message="Dataset uploaded successfully",
        dataset_id=dataset.id,
        records_processed=records_processed,
        suppliers_detected=len(suppliers),
        materials_detected=len(materials)
    )

@app.get("/api/dashboard", response_model=DashboardResponse)
def get_dashboard(db: Session = Depends(get_db)):
    """Get dashboard analytics"""
    
    # Total emissions
    total_emissions = db.query(func.sum(Emission.total_emission)).scalar() or 0
    
    # Supplier breakdown
    supplier_data = db.query(
        SupplyChainRecord.supplier,
        SupplyChainRecord.supplier_region,
        func.sum(Emission.total_emission).label('emissions')
    ).join(Emission).group_by(
        SupplyChainRecord.supplier, 
        SupplyChainRecord.supplier_region
    ).order_by(func.sum(Emission.total_emission).desc()).all()
    
    suppliers = [
        SupplierSummary(
            name=s.supplier,
            emissions=round(s.emissions, 1),
            contribution=round((s.emissions / total_emissions) * 100, 1) if total_emissions > 0 else 0,
            region=s.supplier_region
        ) for s in supplier_data
    ]
    
    # Material breakdown
    material_data = db.query(
        SupplyChainRecord.material,
        func.sum(Emission.material_emission).label('emissions')
    ).join(Emission).group_by(SupplyChainRecord.material).order_by(
        func.sum(Emission.material_emission).desc()
    ).all()
    
    materials = [
        MaterialSummary(
            name=m.material,
            emissions=round(m.emissions, 1),
            percentage=round((m.emissions / total_emissions) * 100, 1) if total_emissions > 0 else 0
        ) for m in material_data
    ]
    
    # Transport breakdown
    transport_data = db.query(
        SupplyChainRecord.transport_mode,
        func.sum(Emission.transport_emission).label('emissions')
    ).join(Emission).group_by(SupplyChainRecord.transport_mode).order_by(
        func.sum(Emission.transport_emission).desc()
    ).all()
    
    transport_modes = [
        TransportSummary(
            mode=t.transport_mode,
            emissions=round(t.emissions, 1),
            percentage=round((t.emissions / total_emissions) * 100, 1) if total_emissions > 0 else 0
        ) for t in transport_data
    ]
    
    # Category breakdown
    material_total = sum(m.emissions for m in materials)
    transport_total = sum(t.emissions for t in transport_modes)
    other_total = total_emissions * 0.1  # Assume 10% other
    
    category_breakdown = [
        CategoryBreakdown(
            name="Materials",
            value=round(material_total, 1),
            percentage=round((material_total / total_emissions) * 100, 1) if total_emissions > 0 else 0
        ),
        CategoryBreakdown(
            name="Logistics",
            value=round(transport_total, 1),
            percentage=round((transport_total / total_emissions) * 100, 1) if total_emissions > 0 else 0
        ),
        CategoryBreakdown(
            name="Others",
            value=round(other_total, 1),
            percentage=10.0
        )
    ]
    
    # Latest dataset timestamp
    latest_dataset = db.query(Dataset).order_by(Dataset.upload_timestamp.desc()).first()
    
    return DashboardResponse(
        total_emissions=round(total_emissions, 1),
        suppliers=suppliers,
        materials=materials,
        transport_modes=transport_modes,
        category_breakdown=category_breakdown,
        dataset_timestamp=latest_dataset.upload_timestamp if latest_dataset else None
    )

@app.get("/api/recommendations", response_model=List[RecommendationResponse])
def get_recommendations(db: Session = Depends(get_db)):
    """Get mitigation recommendations"""
    
    mitigations = db.query(Mitigation).order_by(Mitigation.priority_rank).all()
    
    return [
        RecommendationResponse(
            title=f"Priority {m.priority_rank}: {m.action.split('.')[0]}",
            description=m.action,
            reduction_absolute=round(m.reduction_absolute, 1),
            reduction_percentage=m.reduction_percentage,
            feasibility=m.feasibility,
            confidence=m.confidence,
            priority_rank=m.priority_rank,
            cost_estimate=m.cost_estimate,
            savings_estimate=m.savings_estimate
        ) for m in mitigations
    ]

@app.get("/api/audit", response_model=AuditResponse)
def get_audit_info(db: Session = Depends(get_db)):
    """Get audit and verification information"""
    
    total_records = db.query(SupplyChainRecord).count()
    datasets_count = db.query(Dataset).count()
    
    # Calculate data quality scores
    records_with_emissions = db.query(Emission).count()
    completeness_score = (records_with_emissions / total_records * 100) if total_records > 0 else 0
    
    # Factor coverage
    unique_materials = db.query(SupplyChainRecord.material).distinct().count()
    materials_with_factors = db.query(EmissionFactor).filter(EmissionFactor.category == "material").count()
    factor_coverage = min(100, (materials_with_factors / unique_materials * 100)) if unique_materials > 0 else 100
    
    data_quality_score = (completeness_score + factor_coverage) / 2
    
    latest_dataset = db.query(Dataset).order_by(Dataset.upload_timestamp.desc()).first()
    
    return AuditResponse(
        total_records=total_records,
        datasets_count=datasets_count,
        data_quality_score=round(data_quality_score, 1),
        completeness_score=round(completeness_score, 1),
        factor_coverage=round(factor_coverage, 1),
        last_updated=latest_dataset.upload_timestamp if latest_dataset else None
    )

@app.get("/api/records", response_model=List[RecordResponse])
def get_records(limit: int = 100, db: Session = Depends(get_db)):
    """Get supply chain records with emissions"""
    
    records = db.query(SupplyChainRecord).join(Emission).limit(limit).all()
    
    return [
        RecordResponse(
            id=r.id,
            supplier=r.supplier,
            material=r.material,
            quantity_kg=r.quantity_kg,
            transport_mode=r.transport_mode,
            distance_km=r.distance_km or 0,
            total_emission=round(r.emissions.total_emission, 1)
        ) for r in records
    ]

@app.get("/api/emission-factors")
def get_emission_factors(db: Session = Depends(get_db)):
    """Get all emission factors"""
    
    factors = db.query(EmissionFactor).all()
    
    return {
        "materials": [
            {"name": f.name, "factor": f.factor, "source": f.source}
            for f in factors if f.category == "material"
        ],
        "transport": [
            {"name": f.name, "factor": f.factor, "source": f.source}
            for f in factors if f.category == "transport"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)