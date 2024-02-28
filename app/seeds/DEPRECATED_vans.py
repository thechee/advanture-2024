from app.models import db, Van, environment, SCHEMA
from sqlalchemy.sql import text
from .vans_seed_data import vans

def seed_vans():
  for van in vans:
    db.session.add(Van(
      user_id=van['user_id'],
      year=van['year'],
      make=van['make'],
      model=van['model'],
      miles=van['miles'],
      address=van['address'],
      city=van['city'],
      state=van['state'],
      zip_code=van['zip_code'],
      rental_rate=van['rental_rate'],
      description=van['description'],
      distance_allowed=van['distance_allowed'],
      mpg=van['mpg'],
      doors=van['doors'],
      seats=van['seats'],
      fuel_type_id=van['fuel_type_id']
    ))

    db.session.commit()

def undo_vans():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.vans RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM vans"))
        
    db.session.commit()