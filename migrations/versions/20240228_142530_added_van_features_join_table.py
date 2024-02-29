"""empty message

Revision ID: 71b91b1f7951
Revises: d4b0bd85a4e8
Create Date: 2024-02-28 14:25:30.695056

"""
from alembic import op
import sqlalchemy as sa

import os
environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")

# revision identifiers, used by Alembic.
revision = '71b91b1f7951'
down_revision = 'd4b0bd85a4e8'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('van_features',
    sa.Column('van_id', sa.Integer(), nullable=False),
    sa.Column('feature_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['feature_id'], ['features.id'], ),
    sa.ForeignKeyConstraint(['van_id'], ['vans.id'], ),
    sa.PrimaryKeyConstraint('van_id', 'feature_id')
    )

    if environment == "production":
      op.execute(f"ALTER TABLE van_features SET SCHEMA {SCHEMA};")
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('van_features')
    # ### end Alembic commands ###
