from flask import Blueprint, jsonify
from flask_login import login_required, current_user
from app.models import User, Favorite, db

user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}


@user_routes.route('/<int:id>')
@login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    return user.to_dict()


@user_routes.route('favorites/<int:vanId>', methods=["POST"])
@login_required
def add_favorite(vanId):
    """
    Add the vanId to current user's favorites
    """

    new_favorite = Favorite(
        user_id = current_user.id,
        van_id = vanId
    )

    db.session.add(new_favorite)
    db.session.commit()

    return new_favorite.to_dict()

@user_routes.route('favorites/<int:vanId>', methods=["DELETE"])
@login_required
def delete_favorite(vanId):
    """
    Remove the vanId from the current user's favorites
    """

    favorite = Favorite.query.filter(Favorite.user_id == current_user.id, Favorite.van_id == vanId).one()

    db.session.delete(favorite)
    db.session.commit()

    return {"message": "Favorite successfully deleted"}