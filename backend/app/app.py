from flask import Flask, jsonify, request
from flask_cors import CORS
import boto3
import pandas as pd
import os

# Initialize Flask app
app = Flask(__name__)

# Enable CORS
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Configuration
BUCKET_NAME = "iitj-data-ingestion-bucket"  # S3 bucket name
CSV_FOLDER = os.path.join(os.getcwd(), "csv")  # Local CSV folder path

# Make it false when using awssa
LOCAL_USE = True  # Flag to toggle between local and S3 data sources

# AWS S3 Client
s3 = boto3.client("s3")

# Function to load a CSV file from S3
def load_csv_from_s3(file_name, nrows=None):
    try:
        obj = s3.get_object(Bucket=BUCKET_NAME, Key=file_name)
        if nrows:
            df = pd.read_csv(obj["Body"], nrows=nrows, low_memory=False)
        else:
            df = pd.read_csv(obj["Body"], low_memory=False)
        return df
    except Exception as e:
        print(f"Error loading {file_name} from S3: {e}")
        return None

# Function to load a CSV file from local storage
def load_csv_from_local(file_name, nrows=None):
    try:
        file_path = os.path.join(CSV_FOLDER, file_name)
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File {file_name} not found in {CSV_FOLDER}")
        
        if nrows:
            df = pd.read_csv(file_path, nrows=nrows, low_memory=False)
        else:
            df = pd.read_csv(file_path, low_memory=False)
        return df
    except Exception as e:
        print(f"Error loading {file_name} from local storage: {e}")
        return None

# Dynamic data loading based on `localuse` flag
def load_csv(file_name, nrows=None):
    if LOCAL_USE:
        print(f"Loading {file_name} from local storage...")
        return load_csv_from_local(file_name, nrows)
    else:
        print(f"Loading {file_name} from S3...")
        return load_csv_from_s3(file_name, nrows)

# Preload data
calendar_data = load_csv("calendar.csv", nrows=50).to_dict(orient="records")
listings_data = load_csv("listings.csv", nrows=50).to_dict(orient="records")
reviews_data = load_csv("reviews.csv", nrows=50).to_dict(orient="records")

# Flask Routes
@app.route('/api/data', methods=['GET'])
def get_data():
    """Endpoint to return a sample of data."""
    return jsonify({
        'calendar': calendar_data,
        'listings': listings_data,
        'reviews': reviews_data
    })

@app.route("/api/merged_data", methods=["GET"])
def get_merged_data():
    """Endpoint to return merged data."""
    file_name = "micro_merged.csv"
    try:
        nrows = int(request.args.get("nrows", 1000))  # Default to 1000 rows
        df = load_csv(file_name, nrows=nrows)
        if df is not None:
            return jsonify(df.to_dict(orient="records")), 200
        else:
            return jsonify({"error": "Failed to load data"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.after_request
def add_headers(response):
    """Add headers for CORS and content type."""
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response

# Run the Flask app
if __name__ == '__main__':
    # Use the development server for testing. Use Gunicorn for production.
    app.run(host='0.0.0.0', port=5000)
