import os
import joblib
from flask import Blueprint, jsonify, request
import pandas as pd
from ..utils.db_utils import fetch_top_records,get_db_connection,fetch_last_records_from_db
from ..config import Config
from flask_cors import CORS

fetched_data_routes = Blueprint('fetched_data_routes', __name__)
CORS(fetched_data_routes, resources={r"/api/*": {"origins": "*"}})
# Construct the absolute path to the model file
current_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(current_dir, 'ui_model.pkl')

# Load the model
model = joblib.load(model_path) 


try:
    model = joblib.load(model_path)
    print(f"Model loaded successfully from {model_path}")
except Exception as e:
    print(f"Error loading model: {e}")

@fetched_data_routes.route('/predict-final', methods=['GET'])
def final_predict():
    """
    API endpoint to predict the price based on input features using query parameters.
    """
    try:
        print("Final Predict API called")

        # Parse query parameters
        params = request.args.to_dict()  # Convert to a standard dictionary for easier handling
        print("Raw query parameters:", params)

        # Ensure all input parameters are present and properly cast
        input_data = [
            [
                float(params.get("latitude", "0") or 0),  # Handle missing or empty values
                float(params.get("longitude", "0") or 0),
                int(params.get("minimum_nights", "0") or 0),
                int(params.get("maximum_nights", "0") or 0),
                int(params.get("number_of_reviews", "0") or 0),
                int(params.get("review_scores_rating", "0") or 0),
                int(params.get("room_type_id", "0") or 0),
                int(params.get("cancellation_policy_id", "0") or 0),
                int(params.get("year", "0") or 0),
                int(params.get("day_of_week", "0") or 0),
            ]
        ]

        print("Sanitized input data:", input_data)

        # Perform prediction using the model
        prediction = model.predict(input_data)[0]  # Assuming the model outputs a single value
        print("Prediction result:", prediction)

        return jsonify({"message": "Prediction successful", "predicted_price": prediction, "status": True}), 200

    except ValueError as ve:
        print(f"ValueError in /predict-final route: {ve}")
        return jsonify({"error": f"Invalid input data: {ve}", "status": False}), 400

    except Exception as e:
        print(f"Error in /predict-final route: {e}")
        return jsonify({"error": str(e), "status": False}), 500


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


@fetched_data_routes.route('/append-end', methods=['POST'])
def append_record_at_end():
    """
    API endpoint to append a record to the end of the table.
    """
    data = request.json  # Data sent from the client

    # Remove the "type" field if it exists in the payload
    data.pop("type", None)

    try:
        # Establish a connection to the database
        conn = get_db_connection()

        # Dynamically generate the SQL INSERT query
        columns = ', '.join([f"`{key}`" for key in data.keys()])
        placeholders = ', '.join(['%s'] * len(data))
        sql = f"INSERT INTO `merged_data1` ({columns}) VALUES ({placeholders})"

        # Execute the query
        with conn.cursor() as cursor:
            cursor.execute(sql, tuple(data.values()))
            conn.commit()

        return jsonify({"message": "Record appended to the end successfully", "status": True}), 201

    except Exception as e:
        print(f"Error in /append-end route: {e}")
        return jsonify({"message": f"Error: {str(e)}", "status": False}), 500


@fetched_data_routes.route('/append-start', methods=['POST'])
def append_record_at_start():
    """
    API endpoint to append a record to the start of the table.
    """
    data = request.json  # Data sent from the client

    # Remove the "type" field if it exists in the payload
    data.pop("type", None)

    try:
        # Establish a connection to the database
        conn = get_db_connection()

        # Fetch the smallest `id_x` value
        with conn.cursor() as cursor:
            cursor.execute("SELECT MIN(id_x) as min_id FROM `merged_data1`")
            result = cursor.fetchone()
            min_id = result['min_id'] if result and result['min_id'] is not None else 0

        # Assign a new `id_x` value smaller than the current smallest
        data['id_x'] = min_id - 1

        # Dynamically generate the SQL INSERT query
        columns = ', '.join([f"`{key}`" for key in data.keys()])
        placeholders = ', '.join(['%s'] * len(data))
        sql = f"INSERT INTO `merged_data1` ({columns}) VALUES ({placeholders})"

        # Execute the query
        with conn.cursor() as cursor:
            cursor.execute(sql, tuple(data.values()))
            conn.commit()

        return jsonify({"message": "Record appended to the start successfully", "status": True}), 201

    except Exception as e:
        print(f"Error in /append-start route: {e}")
        return jsonify({"message": f"Error: {str(e)}", "status": False}), 500

@fetched_data_routes.route('/fetch-latest-record', methods=['GET'])
def fetch_latest_record():
    """
    API route to fetch the most recently added record from the table.
    """
    try:
        # Specify the table name
        table_name = "merged_data1"

        # Establish the database connection
        conn = get_db_connection()

        # Query to fetch the most recently added record (assuming auto-increment ID or date column)
        query = f"SELECT * FROM `{table_name}` ORDER BY id_x DESC LIMIT 1"

        with conn.cursor() as cursor:
            cursor.execute(query)
            record = cursor.fetchone()  # Fetch the latest record

        if record:
            return jsonify({
                "message": "Latest record fetched successfully",
                "data": record,
                "status": True
            }), 200
        else:
            return jsonify({
                "message": "No records found in the table",
                "data": {},
                "status": False
            }), 404

    except Exception as e:
        print(f"Error in /fetch-latest-record route: {e}")
        return jsonify({
            "error": str(e),
            "status": False
        }), 500

@fetched_data_routes.route('/fetch-record-count', methods=['GET'])
def fetch_record_count():
    """
    API route to fetch the total count of records in the table.
    """
    try:
        # Specify the table name
        table_name = "merged_data1"

        # Establish the database connection
        conn = get_db_connection()

        # Query to count the total number of records in the table
        query = f"SELECT COUNT(*) as record_count FROM `{table_name}`"

        with conn.cursor() as cursor:
            cursor.execute(query)
            result = cursor.fetchone()  # Fetch the count

        if result:
            return jsonify({
                "message": "Record count fetched successfully",
                "data": {"count": result['record_count']},
                "status": True
            }), 200
        else:
            return jsonify({
                "message": "Unable to fetch record count",
                "data": {"count": 0},
                "status": False
            }), 404

    except Exception as e:
        print(f"Error in /fetch-record-count route: {e}")
        return jsonify({
            "error": str(e),
            "status": False
        }), 500

@fetched_data_routes.route('/fetch-last-records', methods=['GET'])
def fetch_last_records():
    """
    API route to fetch the last 1000 records for specified features from the dataset in RDS.
    """
    try:
        # Define the target table name and features to fetch
        table_name = "merged_data1"
        features = [
            'latitude', 'longitude', 'minimum_nights', 'maximum_nights',
            'number_of_reviews', 'review_scores_rating', 'room_type_id',
            'cancellation_policy_id','name'
        ]

        # Limit the number of records to fetch
        limit = 1000

        # Fetch the data from the RDS table, ordered by an insertion column (e.g., id or timestamp)
        records = fetch_last_records_from_db(table_name, limit=limit, order_by="id DESC")  # Adjust 'id' to your column name

        if records:
            # Convert records to a DataFrame for easier processing
            df = pd.DataFrame(records)

            # Filter only the specified features
            filtered_data = df[features]

            # Create unique values list for each feature
            unique_values = {
                column: filtered_data[column].dropna().unique().tolist() for column in filtered_data.columns
            }

            return jsonify({
                "message": "Last records fetched successfully",
                "data": unique_values,
                "status": True
            }), 200
        else:
            return jsonify({
                "message": "No records found or table is empty",
                "data": [],
                "status": False
            }), 404
    except Exception as e:
        print(f"Error in /fetch-last-records route: {e}")
        return jsonify({
            "error": str(e),
            "status": False
        }), 500

