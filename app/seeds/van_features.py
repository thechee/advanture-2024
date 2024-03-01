from app.models import db, Van, Feature, environment, SCHEMA
from sqlalchemy.sql import text
from .vans_seed_data import vans
from .features_seed_data import features
import random

def seed_van_features():
  newVans = []
  for van in vans:
    newVan = Van(
    id=van['id'],
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
    )

    newVans.append(newVan)

  newFeatures = []
  for feature in features:
    newFeature = Feature(
      name=feature['name']
    )
    newFeatures.append(newFeature)

  for van in newVans:
    for i in random.sample(range(13), 6):
      van.features.append(newFeatures[i])
  
  db.session.add_all(newVans)
  db.session.add_all(newFeatures)

  db.session.commit()

def undo_van_features():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.van_features RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.vans RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.features RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM van_features"))
        db.session.execute(text("DELETE FROM vans"))
        db.session.execute(text("DELETE FROM features"))
        
    db.session.commit()

