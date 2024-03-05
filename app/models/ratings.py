from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy import ForeignKey
from datetime import datetime

class Rating(db.Model):
  __tablename__ = "ratings"

  if environment == "production":
    __table_args__ = {"schema": SCHEMA}

  id = db.Column(db.Integer, primary_key=True)
  user_id = db.Column(db.Integer, ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
  van_id = db.Column(db.Integer, ForeignKey(add_prefix_for_prod("vans.id")), nullable=False)
  review = db.Column(db.Text)
  overall_stars = db.Column(db.Integer, nullable=False)
  cleanliness = db.Column(db.Integer, nullable=False)
  maintenance = db.Column(db.Integer, nullable=False)
  communication = db.Column(db.Integer, nullable=False)
  convenience = db.Column(db.Integer, nullable=False)
  accuracy = db.Column(db.Integer, nullable=False)
  created_at = db.Column(db.DateTime, default=datetime.now)
  updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

  rater = db.relationship("User", back_populates="owned_ratings")
  van = db.relationship("Van", back_populates="ratings")

  def to_dict(self):
    avg_rating = (self.cleanliness + self.maintenance + self.communication + self.convenience + self.accuracy) / 5
    van_preview_image = [image.image_url for image in self.van.images if image.preview is True][0]

    return {
      "id": self.id,
      "rater": self.rater.to_dict(),
      "vanId": self.van_id,
      "vanMake": self.van.make,
      "vanModel": self.van.model,
      "vanYear": self.van.year,
      "vanOwner": self.van.owner.first_name,
      "vanOwnerProfileImg": self.van.owner.profile_image_url,
      "vanPreviewImage": van_preview_image,
      "review": self.review,
      "avgRating": avg_rating,
      "cleanliness": self.cleanliness,
      "maintenance": self.maintenance,
      "communication": self.communication,
      "convenience": self.convenience,
      "accuracy": self.accuracy,
      "createdAt": self.created_at,
      "updatedAt": self.updated_at
    }