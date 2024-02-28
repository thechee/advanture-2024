from app.models import db, FuelType, environment, SCHEMA
from sqlalchemy.sql import text

def seed_fuel_types():
  db.session.add(FuelType(fuel_type="Gasoline"))
  db.session.add(FuelType(fuel_type="Diesel"))
  db.session.add(FuelType(fuel_type="Bio-Diesel"))
  db.session.add(FuelType(fuel_type="Electric"))
  db.session.add(FuelType(fuel_type="Hybrid"))

  db.session.commit()


def undo_fuel_types():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.fuel_types RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM fuel_types"))
        
    db.session.commit()