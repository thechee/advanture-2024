from flask import Blueprint, request
from flask_login import current_user, login_required
from app.models import Van, VanImage, Rating, Booking, db
from .aws_helpers import upload_file_to_s3, get_unique_filename, remove_file_from_s3
from app.forms import VanForm, VanImageForm, RatingForm, BookingForm
from sqlalchemy import or_

van_routes = Blueprint('vans', __name__)

#! VANS
@van_routes.route('/')
def vans():
  """
  Query for all vans and returns them in a list of van dicts
  Applies filters to the query if they exist
  Sorts the query if there is a sort specified
  """
  sort = request.args.get("sort")
  make = request.args.get("make")

  price = request.args.get("price")
  if price:
    price = [int(p) for p in price.split(",")]

  years = request.args.get("years")
  if years:
    years = [int(year) for year in years.split(",")]

  seats = request.args.get("seats")
  if seats:
    seats = int(seats)

  fuel_types = request.args.get("fuelTypes")
  if fuel_types:
    fuel_types = [int(fuel_type) for fuel_type in fuel_types.split(",")]

  miles = request.args.get("miles")
  if miles:
    miles = int(miles)

  query = Van.query

  if make:
      query = query.filter(Van.make.ilike(f"%{make}%"))
  if price:
      query = query.filter(Van.rental_rate.between(price[0], price[1]))
  if years:
      query = query.filter(Van.year.between(years[0], years[1]))
  if seats:
      query = query.filter(Van.seats >= seats)
  if fuel_types:
      query = query.filter(Van.fuel_type_id.in_(fuel_types))
  if miles:
      query = query.filter(or_(Van.distance_allowed >= miles, Van.distance_allowed == None))
  if sort:
    if sort == "low":
      query = query.order_by(Van.rental_rate.asc())
    if sort == "high":
      query = query.order_by(Van.rental_rate.desc())

  vans = query.all()

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
      fuel_type_id = form.data['fuel_type_id'],
      lat = form.data['lat'],
      lng = form.data['lng']
    )

    db.session.add(new_van)
    db.session.commit()
    return new_van.to_dict()
  return form.errors, 400


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
    van.lat = form.data["lat"] or van.lat
    van.lng = form.data["lng"] or van.lng
    
    db.session.commit()
    return van.to_dict()
  return form.errors, 400


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
def new_van_images(vanId):

  images = request.files.getlist("image")
  if not images:
    return {"errors": {"image": "image required"}}, 400

  previews = request.form.getlist("preview")

  for i, image in enumerate(images):
    image.filename = get_unique_filename(image.filename)
    upload = upload_file_to_s3(image)
    print(upload)

    if "url" not in upload:
      return upload
  
    new_van_image = VanImage(
      van_id = vanId,
      image_url = upload["url"],
      preview = previews[i] == "true"
    )
    db.session.add(new_van_image)

  db.session.commit()

  van_images = VanImage.query.filter(VanImage.van_id == vanId).all()
  return [image.to_dict() for image in van_images]

@login_required
@van_routes.route('/<int:vanId>/images', methods=["PUT"])
def update_van_images(vanId):

  images = request.files.getlist("image")
  image_ids_to_keep = [int(id) for id in request.form.getlist("imageId")]

  if not images and not image_ids_to_keep:
    return {"errors": {"image": "image required"}}, 400
  
  old_images = VanImage.query.filter(VanImage.van_id == int(vanId)).all()

  for image in old_images:
    if image.id not in image_ids_to_keep:
      remove_file_from_s3(image.image_url)
      db.session.delete(image)
  
  previews = request.form.getlist("preview")

  for i, image in enumerate(images):
      image.filename = get_unique_filename(image.filename)
      upload = upload_file_to_s3(image)
      print(upload)

      if "url" not in upload:
        return upload
    
      new_van_image = VanImage(
        van_id = vanId,
        image_url = upload["url"],
        preview = previews[i] == "true"
      )
      db.session.add(new_van_image)

  db.session.commit()

  van_images = VanImage.query.filter(VanImage.van_id == vanId).all()
  return [image.to_dict() for image in van_images]
  

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
  
#! VAN BOOKINGS
@van_routes.route('/<int:vanId>/bookings')
def get_van_bookings(vanId):
  """
  Query for all of the bookings of the van from the URL params
  """

  bookings = Booking.query.filter(Booking.van_id == vanId).all()

  if bookings:
    return [booking.to_dict() for booking in bookings]
  else:
    return []

@van_routes.route('/<int:vanId>/bookings', methods=["POST"])
@login_required
def create_booking(vanId):
  """
  Create a new booking linked to a van and the current user and submit to the database
  """
  form = BookingForm()
  form['csrf_token'].data = request.cookies['csrf_token']

  if form.validate_on_submit():
    # check for overlapping bookings
    overlapping_bookings_for_van = Booking.query.filter(
      Booking.van_id == vanId,
      Booking.start_date <= form.data["end_date"],
      Booking.end_date >= form.data["start_date"]
    ).first()
    
    if overlapping_bookings_for_van:
      return {"errors": {"message": "Booking conflicts with existing booking"}}, 400

    overlapping_bookings_for_user = Booking.query.filter(
      Booking.user_id == current_user.id,
      Booking.start_date <= form.data["end_date"],
      Booking.end_date >= form.data["start_date"]
    ).first()

    if overlapping_bookings_for_user:
      return {"errors": {"message": "Booking conflicts with existing booking"}}, 400

    new_booking = Booking(
      user_id = current_user.id,
      van_id = vanId,
      start_date = form.data["start_date"],
      end_date = form.data["end_date"]
    )

    db.session.add(new_booking)
    db.session.commit()

    return new_booking.to_dict()
  return form.errors, 401

@login_required
@van_routes.route('/<int:vanId>/bookings/<int:bookingId>', methods=["PUT"])
def update_booking_dates(vanId, bookingId):
  """
  Update the booking with the given id
  """
  booking = Booking.query.get(bookingId)

  if not booking:
    return {"errors": {"message": "Booking not found"}}, 404
  
  if current_user.id is not booking.user_id:
    return {"errors": {"message": "Unauthorized"}}, 401

  form = BookingForm()
  form['csrf_token'].data = request.cookies['csrf_token']

  if form.validate_on_submit():
    booking.start_date = form.data["start_date"] or booking.start_date
    booking.end_date = form.data["end_date"] or booking.end_date
    booking.status = "pending"
    
    db.session.commit()
    return booking.to_dict()
  return form.errors, 400

@login_required
@van_routes.route('/<int:vanId>/bookings/<int:bookingId>/approve', methods=["PUT"])
def approve_booking(vanId, bookingId):
    """
    Query for the booking and update its status to 'approved'

    Returns 401 Unauthorized if the current user's id does not match the van's owner id

    Returns 404 Not Found if the booking is not in the database
    """
    booking = Booking.query.get(bookingId)
    van = Van.query.get(vanId)

    if not booking:
        return {"errors": {"message": "Booking not found"}}, 404

    if current_user.id is not van.user_id:
        return {'errors': {'message': "Unauthorized"}}, 401

    booking.status = 'approved'

    db.session.commit()

    return {"message": "Booking successfully approved"}

@login_required
@van_routes.route('/<int:vanId>/bookings/<int:bookingId>/deny', methods=["PUT"])
def deny_booking(vanId, bookingId):
    """
    Query for the booking and update its status to 'denied'

    Returns 401 Unauthorized if the current user's id does not match the van's owner id

    Returns 404 Not Found if the booking is not in the database
    """
    booking = Booking.query.get(bookingId)
    van = Van.query.get(vanId)

    if not booking:
        return {"errors": {"message": "Booking not found"}}, 404

    if current_user.id is not van.user_id:
        return {'errors': {'message': "Unauthorized"}}, 401

    booking.status = 'denied'

    db.session.commit()

    return {"message": "Booking successfully denied"}

@login_required
@van_routes.route('/<int:vanId>/bookings/<int:bookingId>/cancel', methods=["PUT"])
def cancel_booking(vanId, bookingId):
  """
  Query for the booking and update the status to cancelled

  Returns 401 Unauthorized if the current user's id does not match the booking's user id

  Returns 404 Not Found if the booking is not in the database
  """
  booking = Booking.query.get(bookingId)
  van = Van.query.get(vanId)

  if not booking:
    return {"errors": {"message": "Booking not found"}}, 404

  if current_user.id is not booking.user_id and current_user.id is not van.user_id:
    return {'errors': {'message': "Unauthorized"}}, 401
  
  if current_user.id is booking.user_id or current_user.id is van.user_id:
    booking.status = "cancelled"
    
  db.session.commit()

  return {"message": "Booking successfully cancelled"}

@login_required
@van_routes.route('/<int:vanId>/bookings/<int:bookingId>/complete', methods=["PUT"])
def complete_booking(vanId, bookingId):
  """
  Query for the booking and update the status to completed

  Returns 401 Unauthorized if the current user's id does not match the booking's user id

  Returns 404 Not Found if the booking is not in the database
  """
  booking = Booking.query.get(bookingId)

  if not booking:
    return {"errors": {"message": "Booking not found"}}, 404

  if current_user.id is not booking.user_id and current_user.id is not van.user_id:
    return {'errors': {'message': "Unauthorized"}}, 401
  
  if current_user.id is booking.user_id or current_user.id is van.user_id:
    booking.status = "completed"
    
  db.session.commit()

  return {"message": "Booking successfully completed"}