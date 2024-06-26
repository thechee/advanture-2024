from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from datetime import datetime


class User(db.Model, UserMixin):
    __tablename__ = "users"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(40), nullable=False)
    last_name = db.Column(db.String(40), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)
    profile_image_url = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

    vans = db.relationship("Van", back_populates="owner", cascade="all, delete-orphan")
    owned_ratings = db.relationship("Rating", back_populates="rater")
    favorites = db.relationship("Favorite", back_populates="user")
    bookings = db.relationship("Booking", back_populates="user", cascade="all, delete-orphan")

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        if password == 'OAUTH':
            self.hashed_password = 'OAUTH'
            return
        else:
          self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
      favorites = {favorite.van_id: favorite.van_id for favorite in self.favorites}

      return {
          'id': self.id,
          'firstName': self.first_name,
          'lastName': self.last_name,
          'profileImage': self.profile_image_url,
          'favorites': favorites,
          'createdAt': self.created_at,
          'updatedAt': self.updated_at
      }
