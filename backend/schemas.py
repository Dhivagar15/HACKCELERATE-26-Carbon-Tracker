from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class DatasetCreate(BaseModel):
    filename: str

class DatasetResponse(BaseModel):
    id: int
    filename: str
    upload_timestamp: datetime
    record_count: int

class RecordCreate(BaseModel):
    invoice_id: Optional[str] = None
    supplier: str
    supplier_region: Optional[str] = "Global"
    material: str
    material_type: Optional[str] = None
    quantity_kg: float
    transport_mode: Optional[str] = "Heavy Duty Truck"
    distance_km: Optional[float] = 0
    shipment_weight_ton: Optional[float] = None
    energy_source: Optional[str] = None
    invoice_date: Optional[str] = None

class RecordResponse(BaseModel):
    id: int
    supplier: str
    material: str
    quantity_kg: float
    transport_mode: str
    distance_km: float
    total_emission: float

class SupplierSummary(BaseModel):
    name: str
    emissions: float
    contribution: float
    region: str

class MaterialSummary(BaseModel):
    name: str
    percentage: float
    emissions: float

class TransportSummary(BaseModel):
    mode: str
    emissions: float
    percentage: float

class CategoryBreakdown(BaseModel):
    name: str
    value: float
    percentage: float

class DashboardResponse(BaseModel):
    total_emissions: float
    suppliers: List[SupplierSummary]
    materials: List[MaterialSummary]
    transport_modes: List[TransportSummary]
    category_breakdown: List[CategoryBreakdown]
    dataset_timestamp: Optional[datetime]

class RecommendationResponse(BaseModel):
    title: str
    description: str
    reduction_absolute: float
    reduction_percentage: float
    feasibility: str
    confidence: str
    priority_rank: int
    cost_estimate: Optional[str]
    savings_estimate: Optional[str]

class AuditResponse(BaseModel):
    total_records: int
    datasets_count: int
    data_quality_score: float
    completeness_score: float
    factor_coverage: float
    last_updated: Optional[datetime]

class UploadResponse(BaseModel):
    message: str
    dataset_id: int
    records_processed: int
    suppliers_detected: int
    materials_detected: int