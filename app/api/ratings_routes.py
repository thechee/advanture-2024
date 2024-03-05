from flask import Blueprint, request
from flask_login import current_user, login_required
from app.models import Rating, db
from app.forms import RatingForm

rating_routes = Blueprint('ratings', __name__)

@login_required
@rating_routes.route('/manage')
def user_ratings():
  ratings = Rating.query.filter(current_user.id == Rating.user_id).all()
  if ratings:
    return [rating.to_dict() for rating in ratings]
  else: 
    return []
  
@login_required
@rating_routes.route('/<int:ratingId>', methods=["DELETE"])
def delete_rating(ratingId):
  rating = Rating.query.get(ratingId)

  if not rating:
    return {"errors": {"message": "Rating not found"}}, 404

  if current_user.id is not rating.rater.id:
    return {"errors": {"message": "Unauthorized"}}, 401
  
  db.session.delete(rating)
  db.session.commit()

  return {"message": "Rating successfully deleted"}
