from app.models import db, FuelType, environment, SCHEMA
from sqlalchemy.sql import text

def seed_fuel_types():
  db.session.add(FuelType(name="Gasoline"))
  db.session.add(FuelType(name="Diesel"))
  db.session.add(FuelType(name="Bio-Diesel"))
  db.session.add(FuelType(name="Electric"))
  db.session.add(FuelType(name="Hybrid"))

  db.session.commit()


def undo_fuel_types():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.fuel_types RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM vans"))
        
    db.session.commit()