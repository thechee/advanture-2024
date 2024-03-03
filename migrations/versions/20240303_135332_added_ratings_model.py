"""added ratings model

Revision ID: 77a7e2739b8a
Revises: 71b91b1f7951
Create Date: 2024-03-03 13:53:32.583184

"""
from alembic import op
import sqlalchemy as sa

import os
environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")

# revision identifiers, used by Alembic.
revision = '77a7e2739b8a'
down_revision = '71b91b1f7951'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('ratings',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('van_id', sa.Integer(), nullable=False),
    sa.Column('review', sa.Text(), nullable=True),
    sa.Column('overall_stars', sa.Integer(), nullable=False),
    sa.Column('cleanliness', sa.Integer(), nullable=False),
    sa.Column('maintenance', sa.Integer(), nullable=False),
    sa.Column('communication', sa.Integer(), nullable=False),
    sa.Column('convenience', sa.Integer(), nullable=False),
    sa.Column('accuracy', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.ForeignKeyConstraint(['van_id'], ['vans.id'], ),
    sa.PrimaryKeyConstraint('id')
    )

    if environment == "production":
      op.execute(f"ALTER TABLE ratings SET SCHEMA {SCHEMA};")
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('ratings')
    # ### end Alembic commands ###
