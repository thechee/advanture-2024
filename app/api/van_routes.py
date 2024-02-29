from flask import Blueprint
from flask_login import login_required
from app.models import Van

van_routes = Blueprint('vans', __name__)

@van_routes.route('/')
def vans():
  """
  Query for all vans and retursn them in a list of van dicts
  """
  vans = Van.query.all()
  return [van.to_dict() for van in vans]