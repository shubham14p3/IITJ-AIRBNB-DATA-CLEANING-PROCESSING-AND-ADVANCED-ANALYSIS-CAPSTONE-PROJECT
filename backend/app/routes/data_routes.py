from flask import Blueprint, jsonify
from ..utils.data_loader import load_csv

api_routes = Blueprint('api_routes', __name__)

@api_routes.route('/data', methods=['GET'])
def get_data():
    """
    API route to fetch limited rows from calendar, listings, and reviews datasets.
    """
    try:
        # Fetch calendar data
        calendar_data = load_csv("calendar.csv", nrows=100)
        if calendar_data is None:
            return jsonify({"error": "Failed to load calendar.csv"}), 500
        calendar_data = calendar_data.to_dict(orient="records")

        # Fetch listings data
        listings_data = load_csv("listings.csv", nrows=100)
        if listings_data is None:
            return jsonify({"error": "Failed to load listings.csv"}), 500
        listings_data = listings_data.to_dict(orient="records")

        # Fetch reviews data
        reviews_data = load_csv("reviews.csv", nrows=100)
        if reviews_data is None:
            return jsonify({"error": "Failed to load reviews.csv"}), 500
        reviews_data = reviews_data.to_dict(orient="records")

        # Return only lightweight data
        return jsonify({
            'calendar': calendar_data[:10],  # Limit to 10 rows for debugging
            'listings': listings_data[:10],  # Limit to 10 rows for debugging
            'reviews': reviews_data[:10]    # Limit to 10 rows for debugging
        })
    except Exception as e:
        print(f"Error in get_data route: {e}")
        return jsonify({"error": str(e)}), 500
