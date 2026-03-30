from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base
import os
from dotenv import load_dotenv

load_dotenv()

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./scopezero.db")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create_tables():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_emission_factors(db):
    from models import EmissionFactor
    
    # Check if factors already exist
    if db.query(EmissionFactor).first():
        return
    
    # Material emission factors (kg CO2e per kg)
    material_factors = [
        ("Steel", 1.85, "material"),
        ("Aluminum", 12.5, "material"),
        ("Plastic", 6.0, "material"),
        ("Cotton", 8.2, "material"),
        ("Industrial Parts", 2.4, "material"),
        ("Packaging", 0.8, "material"),
        ("Wood", 0.5, "material"),
        ("Glass", 1.2, "material"),
        ("Copper", 3.7, "material")
    ]
    
    # Transport emission factors (kg CO2e per kg per km)
    transport_factors = [
        ("Heavy Duty Truck", 0.1, "transport"),
        ("Cargo Ship", 0.015, "transport"),
        ("Ocean Vessel", 0.012, "transport"),
        ("Rail Freight", 0.03, "transport"),
        ("Air Cargo", 0.6, "transport"),
        ("Express Air", 0.8, "transport"),
        ("Intermodal Rail", 0.025, "transport")
    ]
    
    all_factors = material_factors + transport_factors
    
    for name, factor, category in all_factors:
        ef = EmissionFactor(
            name=name,
            factor=factor,
            category=category,
            source="Ecoinvent 3.8 / DEPA",
            year=2024
        )
        db.add(ef)
    
    db.commit()