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

    return {
      "id": self.id,
      "rater": self.rater.to_dict(),
      "vanId": self.van_id,
      "review": self.review,
      "overallStars": self.overall_stars,
      "cleanliness": self.cleanliness,
      "maintenance": self.maintenance,
      "communication": self.communication,
      "convenience": self.convenience,
      "accuracy": self.accuracy,
      "createdAt": self.created_at,
      "updatedAt": self.updated_at
    }