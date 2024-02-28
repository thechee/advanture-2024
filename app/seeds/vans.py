from app.models import db, Van, environment, SCHEMA
from sqlalchemy.sql import text
from .vans_seed_data import vans

def seed_vans():
  for van in vans:
    db.session.add(Van(

    ))

    db.session.commit()

def undo_vans():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.vans RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM vans"))
        
    db.session.commit()