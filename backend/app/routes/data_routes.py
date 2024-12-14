from flask import Blueprint, jsonify
from ..utils.data_loader import load_csv

api_routes = Blueprint('api_routes', __name__)

@api_routes.route('/data', methods=['GET'])
def get_data():
    calendar_data = load_csv("calendar.csv", nrows=50).to_dict(orient="records")
    listings_data = load_csv("listings.csv", nrows=50).to_dict(orient="records")
    reviews_data = load_csv("reviews.csv", nrows=50).to_dict(orient="records")
    return jsonify({
        'calendar': calendar_data,
        'listings': listings_data,
        'reviews': reviews_data
    })
