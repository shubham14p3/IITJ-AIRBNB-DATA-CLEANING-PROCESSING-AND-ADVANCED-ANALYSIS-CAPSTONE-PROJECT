from flask import Flask, jsonify, request
from flask_cors import CORS
import boto3
import pandas as pd
import mysql.connector

# Initialize Flask app
app = Flask(__name__)

# Enable CORS
CORS(app, resources={r"/api/*": {"origins": "*"}})

# AWS S3 Configuration
BUCKET_NAME = "iitj-data-ingestion-bucket"
s3 = boto3.client("s3")

# RDS MySQL Database Configuration
db_config = {
    'host': 'iitj.cdwiqug4cpvx.us-east-1.rds.amazonaws.com',
    'user': 'g23ai2028',      # Replace with your RDS username
    'password': 'g23ai2028',  # Replace with your RDS password
    'database': 'iitj'
}

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
        print(f"Error loading {file_name}: {e}")
        return None

# Function to query the database
def query_db(query):
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)
        cursor.execute(query)
        results = cursor.fetchall()
        cursor.close()
        connection.close()
        return results
    except Exception as e:
        print(f"Database query error: {e}")
        return []

# Preload data from S3
calendar_data = load_csv_from_s3("calendar.csv", nrows=50).to_dict(orient="records")
listings_data = load_csv_from_s3("listings.csv", nrows=50).to_dict(orient="records")
reviews_data = load_csv_from_s3("reviews.csv", nrows=50).to_dict(orient="records")

# Flask Routes
@app.route('/api/data', methods=['GET'])
def get_data():
    """Endpoint to return a sample of data from S3 bucket."""
    return jsonify({
        'calendar': calendar_data,
        'listings': listings_data,
        'reviews': reviews_data
    })

@app.route('/api/db-query', methods=['GET'])
def get_db_data():
    """Endpoint to return data from the MySQL database."""
    query = request.args.get('query', 'SELECT * FROM your_table LIMIT 10')  # Replace 'your_table'
    data = query_db(query)
    return jsonify(data)

@app.route("/api/merged_data", methods=["GET"])
def get_merged_data():
    """Endpoint to return merged data from S3."""
    file_name = "micro_merged.csv"
    try:
        nrows = int(request.args.get("nrows", 1000))  # Default to 1000 rows
        df = load_csv_from_s3(file_name, nrows=nrows)
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
