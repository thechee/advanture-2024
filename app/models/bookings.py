from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy import ForeignKey
from datetime import datetime

class Booking(db.Model):
  __tablename__ = "bookings"

  if environment == "production":
    __table_args__ = {"schema": SCHEMA}

  id = db.Column(db.Integer, primary_key=True)
  user_id = db.Column(db.Integer, ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
  van_id = db.Column(db.Integer, ForeignKey(add_prefix_for_prod("vans.id")), nullable=False)
  start_date = db.Column(db.Date, nullable=False)
  end_date = db.Column(db.Date, nullable=False)
  status = db.Column(db.Enum("pending", "approved", "completed", "denied", "cancelled", name="booking_status"), default="pending", nullable=False)
  created_at = db.Column(db.DateTime, default=datetime.now)
  updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

  user = db.relationship("User", back_populates="bookings")
  van = db.relationship("Van", back_populates="bookings")

  def to_dict(self):

    owner = self.van.owner.to_dict()
    previewImage = [image for image in self.van.images if image.preview == True][0].to_dict()["imageUrl"]

    vanInfo = {
      "make": self.van.make,
      "model": self.van.model,
      "year": self.van.year,
      "previewImage": previewImage,
      "city": self.van.city,
      "state": self.van.state
    }

    ownerInfo = {
      "firstName": owner["firstName"],
      "lastName": owner["lastName"],
      "profileImage": owner["profileImage"]
    }

    return {
      "id": self.id,
      "userId": self.user_id,
      "ownerInfo": ownerInfo,
      "vanInfo": vanInfo,
      "startDate": self.start_date,
      "endDate": self.end_date,
      "status": self.status,
      "createdAt": self.created_at,
      "updatedAt": self.updated_at
    }