from flask import Blueprint, jsonify, request
from ..utils.data_loader import load_csv

merged_data_routes = Blueprint('merged_data_routes', __name__)

@merged_data_routes.route('/merged_data', methods=['GET'])
def get_merged_data():
    try:
        nrows = int(request.args.get("nrows", 1000))
        file_name = "micro_merged.csv"
        df = load_csv(file_name, nrows=nrows)
        if df is not None:
            return jsonify(df.to_dict(orient="records")), 200
        else:
            return jsonify({"error": "Failed to load data"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500
