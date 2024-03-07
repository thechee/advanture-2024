from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy import ForeignKey
from sqlalchemy.schema import UniqueConstraint

class Favorite(db.Model):
  __tablename__ = "favorites"
  __table_args__ = (UniqueConstraint('user_id', 'van_id', name='user_van_favorite'),)

  if environment == "production":
    __table_args__ = (
                      UniqueConstraint('user_id', 'van_id', name='user_van_favorite'),
                      {"schema": SCHEMA}
                      )

  id = db.Column(db.Integer, primary_key=True)
  user_id = db.Column(db.Integer, ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
  van_id = db.Column(db.Integer, ForeignKey(add_prefix_for_prod("vans.id")), nullable=False)

  user = db.relationship("User", back_populates="favorites")
  van = db.relationship("Van", back_populates="favorites")

  def to_dict(self):
    return {
      "id": self.id,
      "userId": self.user_id,
      "vanId": self.van_id
    }