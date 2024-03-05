from app.models import db, Rating, environment, SCHEMA
from sqlalchemy.sql import text
from .ratings_seed_data import ratings

def seed_ratings():
  for rating in ratings:
    db.session.add(Rating(
      user_id = rating["user_id"],
      van_id = rating["van_id"],
      review = rating["review"],
      cleanliness = rating["cleanliness"],
      maintenance = rating["maintenance"],
      communication = rating["communication"],
      convenience = rating["convenience"], 
      accuracy = rating["accuracy"]
    ))

    db.session.commit()

def undo_ratings():
  if environment == "production":
    db.session.execute(f"TRUNCATE table {SCHEMA}.ratings RESTART IDENTITY CASCADE;")
  else:
      db.session.execute(text("DELETE FROM ratings"))
      
  db.session.commit()