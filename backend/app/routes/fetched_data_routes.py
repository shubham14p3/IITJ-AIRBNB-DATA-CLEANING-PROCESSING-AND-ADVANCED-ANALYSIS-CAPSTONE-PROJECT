from flask import Blueprint, jsonify, request
import pandas as pd
from ..utils.db_utils import fetch_top_records
from ..config import Config

fetched_data_routes = Blueprint('fetched_data_routes', __name__)

@fetched_data_routes.route('/fetch-unique-values', methods=['GET'])
def fetch_unique_values():
    """
    API route to fetch unique values dynamically for all columns in a dataset from RDS.
    """
    try:
        # Get the table name and limit the number of rows via query parameters
        table_name = "merged_data1"  # Table name is mandatory
        if not table_name:
            return jsonify({"message": "Table name is required", "status": False}), 400

        limit = int(request.args.get("limit", 80000))  # Default limit on the number of rows

        # Fetch the data from the RDS table
        records = fetch_top_records(table_name, limit=limit)

        if records:
            # Convert records to a DataFrame for easier processing
            df = pd.DataFrame(records)

            # Dynamically prepare unique values for all columns
            unique_values = {
                column: df[column].dropna().unique().tolist() for column in df.columns
            }
            return jsonify({
                "message": "Unique values fetched successfully",
                "data": unique_values,
                "status": True
            }), 200
        else:
            return jsonify({
                "message": "No records found or table is empty",
                "data": {},
                "status": False
            }), 404
    except Exception as e:
        print(f"Error in /fetch-unique-values route: {e}")
        return jsonify({
            "error": str(e),
            "status": False
        }), 500
