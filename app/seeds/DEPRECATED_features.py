from app.models import db, Feature, environment, SCHEMA
from sqlalchemy.sql import text
from .features_seed_data import features

def seed_features():
  for feature in features:
    db.session.add(Feature(name=feature['name']))

    db.session.commit()


def undo_features():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.features RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM features"))
        
    db.session.commit()