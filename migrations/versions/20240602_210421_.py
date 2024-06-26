"""empty message

Revision ID: 37a19e7d40ba
Revises: a4113fcf6868
Create Date: 2024-06-02 21:04:21.937920

"""
from alembic import op
import sqlalchemy as sa

import os
environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")

# revision identifiers, used by Alembic.
revision = '37a19e7d40ba'
down_revision = 'a4113fcf6868'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    booking_status = sa.Enum('pending', 'approved', 'completed', 'denied', 'cancelled', name='booking_status', create_type=False)
    booking_status.create(op.get_bind(), checkfirst=False)

    with op.batch_alter_table('bookings', schema=None) as batch_op:
        batch_op.add_column(sa.Column('status', booking_status, server_default='pending', nullable=False))

    if environment == "production":
      op.execute(f"ALTER TABLE bookings SET SCHEMA {SCHEMA};")
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    booking_status = sa.Enum('pending', 'approved', 'completed', 'denied', 'cancelled', name='booking_status', create_type=False)

    with op.batch_alter_table('bookings', schema=None) as batch_op:
        batch_op.drop_column('status')

    booking_status.drop(op.get_bind(), checkfirst=False)
    # ### end Alembic commands ###
