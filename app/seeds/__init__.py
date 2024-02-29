from flask.cli import AppGroup
from .users import seed_users, undo_users
from .fuel_types import seed_fuel_types, undo_fuel_types
from .DEPRECATED_vans import seed_vans, undo_vans
from .DEPRECATED_features import seed_features, undo_features
from .van_features import seed_van_features, undo_van_features
from .van_images import seed_van_images, undo_van_images

from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo 
        # command, which will  truncate all tables prefixed with 
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_users()
        undo_fuel_types()
        # undo_features()
        # undo_vans()
        undo_van_features()
        undo_van_images()
    seed_users()
    seed_fuel_types()
    # seed_features()
    # seed_vans()
    seed_van_features()
    seed_van_images()
    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_users()
    undo_fuel_types()
    # undo_features()
    # undo_vans()
    undo_van_features()
    undo_van_images()
    # Add other undo functions here
