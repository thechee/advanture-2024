from flask import Blueprint, jsonify


map_routes = Blueprint('maps', __name__)

@map_routes.route('/key', methods=["POST"])
def get_key():
