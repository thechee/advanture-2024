from flask import Blueprint, request
from flask_login import current_user, login_required
from app.models import Van, VanImage, db
from .aws_helpers import upload_file_to_s3, get_unique_filename, remove_file_from_s3
from app.forms import VanForm, VanImageForm

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
@van_routes.route('/new', methods=["POST"])
def new_van():
  form = VanForm()
  form['csrf_token'].data = request.cookies['csrf_token']

  if form.validate_on_submit():
    new_van = Van(
      user_id = current_user.id,
      year = form.data['year'],
      make = form.data['make'],
      model = form.data['model'],
      miles = form.data['miles'],
      address = form.data['address'],
      city = form.data['city'],
      state = form.data['state'],
      zip_code = form.data['zip_code'],
      rental_rate = form.data['rental_rate'],
      description = form.data['description'],
      distance_allowed = form.data['distance_allowed'],
      mpg = form.data['mpg'],
      doors = form.data['doors'],
      seats = form.data['seats'],
      fuel_type_id = form.data['fuel_type_id']
    )

    db.session.add(new_van)
    db.session.commit()
    return new_van.to_dict()
  return form.errors, 401

@login_required
@van_routes.route('/vans/<int:vanId>/images', methods=["POST"])
def new_van_image():
  pass