from flask import Blueprint, request
from ..config import Config
from flask import jsonify

maps_api_key = Config.MAPS_API_KEY

maps_routes = Blueprint('maps', __name__)

@maps_routes.route('/key', methods=["POST"])
def get_map_key():
  return jsonify(maps_api_key)