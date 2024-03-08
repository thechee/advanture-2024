from flask import Blueprint, jsonify
from ..config import Config

maps_api_key = Config.MAPS_API_KEY
map_id = Config.MAP_ID

map_routes = Blueprint('maps', __name__)

@map_routes.route('/key', methods=["POST"])
def get_key():
  return {"key": maps_api_key, "mapId": map_id}
