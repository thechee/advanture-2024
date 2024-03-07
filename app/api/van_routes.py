from flask import Blueprint, request
from flask_login import current_user, login_required
from app.models import Van, VanImage, Rating, db
from .aws_helpers import upload_file_to_s3, get_unique_filename, remove_file_from_s3
from app.forms import VanForm, VanImageForm, RatingForm

van_routes = Blueprint('vans', __name__)

#! VANS
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
    return {"errors": {"message": "Van not found"}}, 404


@login_required
@van_routes.route('/new', methods=["POST"])
def create_van():
  """
  Create a new van linked to the current user and submit to the database
  """
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
    print("******************* NEW VAN =>", new_van)

    db.session.add(new_van)
    db.session.commit()
    return new_van.to_dict()
  return form.errors, 401


@login_required
@van_routes.route('/<int:vanId>/update', methods=["PUT"])
def update_van(vanId):
  van = Van.query.get(vanId)

  if not van:
    return {"errors": {"message": "Van not found"}}, 404
  
  if current_user.id is not van.user_id:
    return {"errors": {"message": "Unauthorized"}}, 401

  form = VanForm()

  form['csrf_token'].data = request.cookies['csrf_token']

  if form.validate_on_submit():
    van.year = form.data["year"] or van.year
    van.make = form.data["make"] or van.make
    van.model = form.data["model"] or van.model
    van.miles = form.data["miles"] or van.miles
    van.address = form.data["address"] or van.address
    van.city = form.data["city"] or van.city
    van.state = form.data["state"] or van.state
    van.zip_code = form.data["zip_code"] or van.zip_code
    van.rental_rate = form.data["rental_rate"] or van.rental_rate
    van.description = form.data["description"] or van.description
    van.distance_allowed = form.data["distance_allowed"]
    van.mpg = form.data["mpg"]
    van.doors = form.data["doors"] or van.doors
    van.seats = form.data["seats"] or van.seats
    van.fuel_type_id = form.data["fuel_type_id"] or van.fuel_type_id
    
    db.session.commit()
    return van.to_dict()
  return form.errors, 401


@login_required
@van_routes.route('/<int:vanId>', methods=["DELETE"])
def delete_van(vanId):
  """
  Query for the van and delete it from the database

  Returns 401 Unauthorized if the current user's id does not match the van's user id

  Returns 404 Not Found if the van is not in the database
  """
  van = Van.query.get(vanId)

  if current_user.id is not van.user_id:
    return {'errors': {'message': "Unauthorized"}}, 401
  
  if not van:
    return {"errors": {"message": "Van not found"}}, 404

  db.session.delete(van)
  db.session.commit()

  return {"message": "Van successfully deleted"}


#! VAN IMAGES
@login_required
@van_routes.route('/<int:vanId>/images', methods=["POST"])
def new_van_image(vanId):
  form = VanImageForm()

  form['csrf_token'].data = request.cookies['csrf_token']

  if form.validate_on_submit():
    image = form.data["image"]
    image.filename = get_unique_filename(image.filename)
    upload = upload_file_to_s3(image)
    print(upload)

    if "url" not in upload:
      return upload
    
    new_van_image = VanImage(
      van_id = form.data["van_id"],
      image_url = upload["url"],
      preview = form.data["preview"]
    )

    db.session.add(new_van_image)
    db.session.commit()
    return new_van_image.to_dict()
  return form.errors, 401

@login_required
@van_routes.route('/<int:vanId>/images', methods=["PUT"])
def update_van_image(vanId):
  preview_image = VanImage.query.filter(VanImage.van_id == vanId, VanImage.preview == True).one()

  form = VanImageForm()

  form['csrf_token'].data = request.cookies['csrf_token']

  if form.validate_on_submit():
    image = form.data["image"]
    image.filename = get_unique_filename(image.filename)
    upload = upload_file_to_s3(image)
    print(upload)

    if "url" not in upload:
      return upload

    remove_file_from_s3(preview_image.image_url)

    updated_van_image = VanImage(
      van_id = vanId,
      image_url = upload["url"],
      preview = True
    )

    db.session.delete(preview_image)
    db.session.add(updated_van_image)
    db.session.commit()
    return updated_van_image.to_dict()
  return form.errors, 401

#! VAN RATINGS
@login_required
@van_routes.route('/<int:vanId>/ratings')
def get_van_ratings(vanId):
  """
  Query for all of the ratings of the van from the URL params
  """

  ratings = Rating.query.filter(Rating.van_id == vanId).all()

  if ratings:
    return [rating.to_dict() for rating in ratings]
  else:
    return []
  
@login_required
@van_routes.route('/<int:vanId>/ratings', methods=["POST"])
def create_rating(vanId):
  """
  Create a new rating linked to a van and the current user and submit to the database
  """
  form = RatingForm()
  form['csrf_token'].data = request.cookies['csrf_token']

  if form.validate_on_submit():
    new_rating = Rating(
      user_id = current_user.id,
      van_id = vanId,
      review = form.data["review"],
      cleanliness = form.data["cleanliness"],
      maintenance = form.data["maintenance"],
      communication = form.data["communication"],
      convenience = form.data["convenience"],
      accuracy = form.data["accuracy"]
    )

    db.session.add(new_rating)
    db.session.commit()

    return new_rating.to_dict()
  return form.errors, 401

#! MANAGE VANS
@login_required
@van_routes.route('/manage')
def user_vans():
  vans = Van.query.filter(current_user.id == Van.user_id).all()
  if vans:
    return [van.to_dict() for van in vans]
  else:
    return []
  