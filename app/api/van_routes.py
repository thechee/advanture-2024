from flask import Blueprint
from flask_login import login_required
from app.models import Van

van_routes = Blueprint('vans', __name__)

@van_routes.route('/')
def vans():
  """
  Query for all vans and returns them in a list of van dicts
  """
  vans = Van.query.all()
  return [van.to_dict() for van in vans]

@van_routes.route('/<int:vanId>')
def van(vanId):
  """
  Query for the van from the params and return a dict of that van
  """
  van = Van.query.get(vanId)

  if van:
    return van.to_dict()
  else:
    return {"errors": {"message": "Van not found"}}

@login_required  
@van.routes.route('/new', methods=["POST"])
def new_van():
  form = 