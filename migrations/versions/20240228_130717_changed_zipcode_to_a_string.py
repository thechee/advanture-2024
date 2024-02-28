"""changed zipcode to a string

Revision ID: d4b0bd85a4e8
Revises: 8931130cbc53
Create Date: 2024-02-28 13:07:17.349674

"""
from alembic import op
import sqlalchemy as sa

import os
environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")

# revision identifiers, used by Alembic.
revision = 'd4b0bd85a4e8'
down_revision = '8931130cbc53'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('vans', schema=None) as batch_op:
        batch_op.alter_column('zip_code',
               existing_type=sa.INTEGER(),
               type_=sa.String(length=5),
               existing_nullable=False)


    if environment == "production":
      op.execute(f"ALTER TABLE vans SET SCHEMA {SCHEMA};")
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('vans', schema=None) as batch_op:
        batch_op.alter_column('zip_code',
               existing_type=sa.String(length=5),
               type_=sa.INTEGER(),
               existing_nullable=False)

    # ### end Alembic commands ###