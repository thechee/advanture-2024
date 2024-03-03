from flask import Blueprint, request
from flask_login import current_user, login_required
from app.models import Rating

rating_routes = Blueprint('ratings', __name__)

@login_required
@rating_routes.route('/manage')
def user_ratings():
  ratings = Rating.query.filter(current_user.id == Rating.user_id).all()
  if ratings:
    return [rating.to_dict() for rating in ratings]
  else: 
    return []