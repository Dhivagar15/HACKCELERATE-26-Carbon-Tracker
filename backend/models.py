from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class Dataset(Base):
    __tablename__ = "datasets"
    
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    upload_timestamp = Column(DateTime, default=datetime.utcnow)
    
    records = relationship("SupplyChainRecord", back_populates="dataset")

class SupplyChainRecord(Base):
    __tablename__ = "supply_chain_records"
    
    id = Column(Integer, primary_key=True, index=True)
    dataset_id = Column(Integer, ForeignKey("datasets.id"))
    invoice_id = Column(String)
    supplier = Column(String, nullable=False)
    supplier_region = Column(String)
    material = Column(String, nullable=False)
    material_type = Column(String)
    quantity_kg = Column(Float, nullable=False)
    transport_mode = Column(String)
    distance_km = Column(Float)
    shipment_weight_ton = Column(Float)
    energy_source = Column(String)
    invoice_date = Column(String)
    
    dataset = relationship("Dataset", back_populates="records")
    emissions = relationship("Emission", back_populates="record", uselist=False)

class EmissionFactor(Base):
    __tablename__ = "emission_factors"
    
    id = Column(Integer, primary_key=True, index=True)
    category = Column(String, nullable=False)  # 'material' or 'transport'
    name = Column(String, nullable=False)
    factor = Column(Float, nullable=False)
    source = Column(String, default="Ecoinvent 3.8")
    year = Column(Integer, default=2024)

class Emission(Base):
    __tablename__ = "emissions"
    
    id = Column(Integer, primary_key=True, index=True)
    record_id = Column(Integer, ForeignKey("supply_chain_records.id"))
    material_emission = Column(Float, nullable=False)
    transport_emission = Column(Float, nullable=False)
    total_emission = Column(Float, nullable=False)
    
    record = relationship("SupplyChainRecord", back_populates="emissions")

class Mitigation(Base):
    __tablename__ = "mitigations"
    
    id = Column(Integer, primary_key=True, index=True)
    trigger_reason = Column(String, nullable=False)
    action = Column(Text, nullable=False)
    reduction_absolute = Column(Float, nullable=False)
    reduction_percentage = Column(Float, nullable=False)
    feasibility = Column(String, nullable=False)  # 'High', 'Medium', 'Low'
    confidence = Column(String, nullable=False)   # 'High', 'Medium', 'Low'
    priority_rank = Column(Integer, nullable=False)
    cost_estimate = Column(String)
    savings_estimate = Column(String)