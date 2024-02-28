from app.models import db, van_features, environment, SCHEMA
from sqlalchemy.sql import text
from .vans_seed_data import vans

def seed_van_features():
  for van in vans:
    


def undo_features():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.van_features RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM van_features"))
        
    db.session.commit()