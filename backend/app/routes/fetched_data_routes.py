from flask import Blueprint, jsonify, request
import pandas as pd
from ..utils.db_utils import fetch_top_records,get_db_connection
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
