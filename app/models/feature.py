from .db import db, environment, SCHEMA
from .van_features import van_features

class Feature(db.Model):
  __tablename__ = "features"

  if environment == "production":
    __table_args__ = {"schema": SCHEMA}

  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(50), nullable=False)

  vans = db.relationship("Van", secondary=van_features, back_populates="features")

  def to_dict(self):
    return {
      "id": self.id,
      "name": self.name
    }