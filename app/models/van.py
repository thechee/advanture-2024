from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy import ForeignKey
from datetime import datetime
from .van_features import van_features
from statistics import mean

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
  lat = db.Column(db.Numeric(scale=10, asdecimal=False), nullable=False)
  lng = db.Column(db.Numeric(scale=10, asdecimal=False), nullable=False)
  created_at = db.Column(db.DateTime, default=datetime.now)
  updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

  owner = db.relationship("User", back_populates="vans")
  fuel_type = db.relationship("FuelType", back_populates="vans")
  features = db.relationship("Feature", secondary=van_features, back_populates="vans")
  images = db.relationship("VanImage", back_populates="van", cascade='all, delete-orphan')
  ratings = db.relationship("Rating", back_populates="van", cascade='all, delete-orphan')
  favorites = db.relationship("Favorite", back_populates="van", cascade='all, delete-orphan')
  bookings = db.relationship("Booking", back_populates="van", cascade='all, delete-orphan')

  def to_dict(self):
    ratings = {rating.id: rating.to_dict() for rating in self.ratings}
    num_ratings = len(ratings)

    if num_ratings > 0:
        van_avg_rating = mean(rating["avgRating"] for rating in ratings.values())
        van_avg_cleanliness = mean(rating["cleanliness"] for rating in ratings.values())
        van_avg_maintenance = mean(rating["maintenance"] for rating in ratings.values())
        van_avg_communication = mean(rating["communication"] for rating in ratings.values())
        van_avg_convenience = mean(rating["convenience"] for rating in ratings.values())
        van_avg_accuracy = mean(rating["accuracy"] for rating in ratings.values())
    else:
        van_avg_rating = van_avg_cleanliness = van_avg_maintenance = van_avg_communication = van_avg_convenience = van_avg_accuracy = 0

    return {
        "id": self.id,
        "owner": self.owner.to_dict(),
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
        "features": [feature.name for feature in self.features],
        "fuelType": self.fuel_type.fuel_type,
        "images": {image.id: image.to_dict() for image in self.images},
        "bookings": {booking.id: booking.to_dict() for booking in self.bookings},
        "ratings": ratings,
        "numRatings": num_ratings,
        "avgRating": round(van_avg_rating, 2),
        "avgCleanliness": round(van_avg_cleanliness, 2),
        "avgMaintenance": round(van_avg_maintenance, 2),
        "avgCommunication": round(van_avg_communication, 2),
        "avgConvenience": round(van_avg_convenience, 2),
        "avgAccuracy": round(van_avg_accuracy, 2),
        "doors": self.doors,
        "seats": self.seats,
        "mpg": self.mpg,
        "lat": self.lat,
        "lng": self.lng,
        "createdAt": self.created_at,
        "updatedAt": self.updated_at
    }