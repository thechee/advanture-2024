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
  ratings = db.relationship("Rating", back_populates="van", cascade='all, delete-orphan')

  def to_dict(self):
    owner = self.owner.to_dict()
    features = [feature.name for feature in self.features]
    fuel_type = self.fuel_type.fuel_type
    images = {image.id: image.to_dict() for image in self.images}
    ratings = {rating.id: rating.to_dict() for rating in self.ratings}
    num_ratings = len(ratings)

    van_avg_rating = 0
    van_avg_cleanliness = 0
    van_avg_maintenance = 0
    van_avg_communication = 0
    van_avg_convenience = 0
    van_avg_accuracy = 0
    for key in ratings:
      van_avg_rating += ratings[key]["avgRating"]
      van_avg_cleanliness += ratings[key]["cleanliness"]
      van_avg_maintenance += ratings[key]["maintenance"]
      van_avg_communication += ratings[key]["communication"]
      van_avg_convenience += ratings[key]["convenience"]
      van_avg_accuracy += ratings[key]["accuracy"]

    return_dict = dict()
    return_dict["id"] = self.id
    return_dict["owner"] = owner
    return_dict["year"] = self.year
    return_dict["make"] = self.make
    return_dict["model"] = self.model
    return_dict["miles"] = self.miles
    return_dict["address"] = self.address
    return_dict["city"] = self.city
    return_dict["state"] = self.state
    return_dict["zipCode"] = self.zip_code
    return_dict["rentalRate"] = self.rental_rate
    return_dict["description"] = self.description
    return_dict["distanceAllowed"] = self.distance_allowed
    return_dict["mpg"] = self.mpg
    return_dict["doors"] = self.doors
    return_dict["seats"] = self.seats
    return_dict["fuelType"] = fuel_type
    return_dict["fuelTypeId"] = self.fuel_type_id
    return_dict["features"] = features
    return_dict["images"] = images
    return_dict["ratings"] = ratings
    return_dict["numRatings"] = num_ratings
    return_dict["createdAt"] = self.created_at
    return_dict["updatedAt"] = self.updated_at
    if num_ratings is not 0:
      return_dict["vanAvgRating"] = float("{:3.2f}".format(van_avg_rating / num_ratings))
      return_dict["vanAvgCleanliness"] = float("{:2.1f}".format(van_avg_cleanliness / num_ratings))
      return_dict["vanAvgMaintenance"] = float("{:2.1f}".format(van_avg_maintenance / num_ratings))
      return_dict["vanAvgCommunication"] = float("{:2.1f}".format(van_avg_communication / num_ratings))
      return_dict["vanAvgConvenience"] = float("{:2.1f}".format(van_avg_convenience / num_ratings))
      return_dict["vanAvgAccuracy"] = float("{:2.1f}".format(van_avg_accuracy / num_ratings))

    return return_dict