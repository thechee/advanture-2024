from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy import ForeignKey
from datetime import datetime

class VanImage(db.Model):
  __tablename__ = "van_images"

  if environment == "production":
    __table_args__ = {"schema": SCHEMA}

  id = db.Column(db.Integer, primary_key=True)
  van_id = db.Column(db.Integer, ForeignKey(add_prefix_for_prod("vans.id")), nullable=False)
  image_url = db.Column(db.Text, nullabe=False)
  preview = db.Column(db.Boolean, nullable=False)
  created_at = db.Column(db.DateTime, default=datetime.now)
  updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

  van = db.relationship("Van", back_populates="images")

  def to_dict(self):
    return {
      "id": self.id,
      "vanId": self.van_id,
      "imageUrl": self.image_url,
      "preview": self.preview,
      "createdAt": self.created_at,
      "updatedAt": self.updated_at
    }