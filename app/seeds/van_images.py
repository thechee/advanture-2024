from app.models import db, VanImage, environment, SCHEMA
from sqlalchemy.sql import text
from .van_image_seed_data import van_images

def seed_van_images():
  for image in van_images:
    db.session.add(VanImage(
      van_id=image['van_id'],
      image_url=image['image_url'],
      preview=image['preview']
    ))

    db.session.commit()

def undo_van_images():
  if environment == "production":
    db.session.execute(f"TRUNCATE table {SCHEMA}.van_images RESTART IDENTITY CASCADE;")
  else:
    db.session.execute(text("DELETE FROM van_images"))
      
  db.session.commit()