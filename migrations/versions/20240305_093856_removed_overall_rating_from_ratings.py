"""removed overall rating from ratings

Revision ID: 009d4642c95f
Revises: 77a7e2739b8a
Create Date: 2024-03-05 09:38:56.352175

"""
from alembic import op
import sqlalchemy as sa

import os
environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")

# revision identifiers, used by Alembic.
revision = '009d4642c95f'
down_revision = '77a7e2739b8a'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('ratings', schema=None) as batch_op:
        batch_op.drop_column('overall_stars')
        
    if environment == "production":
      op.execute(f"ALTER TABLE ratings SET SCHEMA {SCHEMA};")
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('ratings', schema=None) as batch_op:
        batch_op.add_column(sa.Column('overall_stars', sa.INTEGER(), nullable=False))

    # ### end Alembic commands ###
