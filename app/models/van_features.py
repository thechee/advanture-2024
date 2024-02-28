from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.schema import Column, ForeignKey, Table
from sqlalchemy.types import Integer, String

Base = declarative_base()

van_features = Table(
  "van_features",
  Base.metadata,
  Column("van_id", ForeignKey("vans.id"), primary_key=True),
  Column("feature_id", ForeignKey("features.id"), primary_key=True)
)