from flask import Blueprint, jsonify, request
from ..utils.data_loader import load_csv
from ..utils.s3_utils import load_csv_from_s3_merged
from ..utils.db_utils import upload_csv_to_db, fetch_top_records
from ..config import Config

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


@merged_data_routes.route('/upload-merged-data', methods=['GET'])
def upload_merged_data():
    """
    API route to fetch the merged_all.csv file from S3 and upload it to RDS.
    """
    try:
        # Load the CSV from S3
        file_name = "merged_all.csv"
        bucket_name = Config.BUCKET_NAME
        dataframe = load_csv_from_s3_merged(file_name, bucket_name=bucket_name)

        if dataframe is None:
            return jsonify({"error": f"Failed to load {file_name} from S3"}), 500

        # Upload the data to RDS
        table_name = "merged_data1"  # Replace with your actual table name
        upload_csv_to_db(dataframe, table_name)

        return jsonify({"message": "Data uploaded successfully", "status": True}), 200
    except Exception as e:
        print(f"Error in /upload-merged-data route: {e}")
        return jsonify({"error": str(e), "status": False}), 500


@merged_data_routes.route('/fetch-from-rds', methods=['GET'])
def fetch_from_rds():
    """
    API route to fetch top N records from the RDS table.
    """
    try:
        # Get the table name from the query parameters
        table_name = request.args.get("table_name", "merged_data1")  # Default table name
        limit = int(request.args.get("limit", 500000))  # Default to fetch top 5 records

        # Fetch top records from the table
        records = fetch_top_records(table_name, limit=limit)

        if records:
            return jsonify({"message": "Records fetched successfully", "data": records, "status": True}), 200
        else:
            return jsonify({"message": "No records found", "data": [], "status": False}), 404
    except Exception as e:
        print(f"Error in /fetch-from-rds route: {e}")
        return jsonify({"error": str(e), "status": False}), 500
