from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.schema import Column, ForeignKey, Table
from sqlalchemy.types import Integer, String

# Base = declarative_base()

# van_features = Table(
#   "van_features",
#   Base.metadata,
#   Column("van_id", ForeignKey(add_prefix_for_prod("vans.id")), primary_key=True),
#   Column("feature_id", ForeignKey(add_prefix_for_prod("features.id")), primary_key=True)
# )
van_features = db.Table(
  "van_features",
  db.Column("van_id", db.Integer, ForeignKey(add_prefix_for_prod("vans.id")), primary_key=True),
  db.Column("feature_id", db.Integer, ForeignKey(add_prefix_for_prod("features.id")), primary_key=True)
)

if environment == "production":
  van_features.schema = SCHEMA