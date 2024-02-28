from app.models import db, van_features, environment, SCHEMA
from sqlalchemy.sql import text
from .vans_seed_data import vans
import random

def seed_van_features():
  for van in vans:
    for i in random.sample(range(13), 6):
      db.session.add(van_features(
          van_id=van['id'],
          feature_id=i
          ))
      db.session.commit()


def undo_van_features():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.van_features RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM van_features"))
        
    db.session.commit()