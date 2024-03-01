from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy import ForeignKey
from datetime import datetime
from .van_features import van_features

class Van(db.Model):
  __tablename__ = "vans"

  if environment == "production":
    __table_args__ = {"schema": SCHEMA}

  id = db.Column(db.Integer, primary_key=True)
  user_id = db.Column(db.Integer, ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
  year = db.Column(db.Integer, nullable=False)
  make = db.Column(db.String(30), nullable=False)
  model = db.Column(db.String(30), nullable=False)
  miles = db.Column(db.Integer, nullable=False)
  address = db.Column(db.String(100), nullable=False)
  city = db.Column(db.String(30), nullable=False)
  state = db.Column(db.String(30), nullable=False)
  zip_code = db.Column(db.String(5), nullable=False)
  rental_rate = db.Column(db.Integer, nullable=False)
  description = db.Column(db.Text, nullable=False)
  distance_allowed = db.Column(db.Integer)
  mpg = db.Column(db.Integer)
  doors = db.Column(db.Integer, nullable=False)
  seats = db.Column(db.Integer, nullable=False)
  fuel_type_id = db.Column(db.Integer, ForeignKey(add_prefix_for_prod("fuel_types.id")), nullable=False)
  created_at = db.Column(db.DateTime, default=datetime.now)
  updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

  owner = db.relationship("User", back_populates="vans")
  fuel_type = db.relationship("FuelType", back_populates="vans")
  features = db.relationship("Feature", secondary=van_features, back_populates="vans")
  images = db.relationship("VanImage", back_populates="van", cascade='all, delete-orphan')

  def to_dict(self):
    owner = self.owner.to_dict()
    features = [feature.name for feature in self.features]
    fuel_type = self.fuel_type.fuel_type
    images = [image.to_dict() for image in self.images]

    return {
      "id": self.id,
      "owner": owner,
      "year": self.year,
      "make": self.make,
      "model": self.model,
      "miles": self.miles,
      "address": self.address,
      "city": self.city,
      "state": self.state,
      "zipCode": self.zip_code,
      "rentalRate": self.rental_rate,
      "description": self.description,
      "distanceAllowed": self.distance_allowed,
      "mpg": self.mpg,
      "doors": self.doors,
      "seats": self.seats,
      "fuelType": fuel_type,
      "fuelTypeId": self.fuel_type_id,
      "features": features,
      "images": images,
      "createdAt": self.created_at,
      "updatedAt": self.updated_at
    }