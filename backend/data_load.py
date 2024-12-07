import boto3
import pandas as pd
import mysql.connector

# AWS S3 Configuration
BUCKET_NAME = "iitj-data-ingestion-bucket"
s3 = boto3.client('s3')

# MySQL Database Configuration
db_config = {
    'host': 'iitj.cdwiqug4cpvx.us-east-1.rds.amazonaws.com',
    'user': 'g23ai2028',
    'password': 'g23ai2028',
    'database': 'ml_project'
}

def upload_to_rds_batch(table_name, columns, data):
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()

    placeholders = ", ".join(["%s"] * len(columns))
    query = f"INSERT INTO {table_name} ({', '.join(columns)}) VALUES ({placeholders})"

    cursor.executemany(query, data)
    connection.commit()
    cursor.close()
    connection.close()

def load_and_upload_chunked(file_name, table_name, columns, chunk_size=1000):
    obj = s3.get_object(Bucket=BUCKET_NAME, Key=file_name)
    chunk_iter = pd.read_csv(obj['Body'], chunksize=chunk_size, low_memory=False)

    for chunk in chunk_iter:
        # Normalize column names
        chunk.columns = chunk.columns.str.strip().str.lower()

        # Add missing columns
        for col in columns:
            if col not in chunk.columns:
                chunk[col] = None

        # Keep only relevant columns
        chunk = chunk[columns]

        # Replace missing values with defaults
        chunk.fillna("Unknown", inplace=True)

        # Convert to tuples for batch insert
        data_tuples = [tuple(row) for row in chunk.to_numpy()]
        upload_to_rds_batch(table_name, columns, data_tuples)

# Table configurations
configs = [
    {"file_name": "calendar.csv", "table_name": "calendar", "columns": ["date", "availability"]},
    {"file_name": "listings.csv", "table_name": "listings", "columns": ["id", "listing_url", "scrape_id", "last_scraped", "name", "host_id", "host_name", "host_since", "neighbourhood", "latitude", "longitude", "room_type", "price", "number_of_reviews", "review_scores_rating", "instant_bookable", "cancellation_policy"]},
    {"file_name": "reviews.csv", "table_name": "reviews", "columns": ["reviewer_id", "reviewer_name", "comments", "date"]}
]

# Process each configuration
for config in configs:
    load_and_upload_chunked(config["file_name"], config["table_name"], config["columns"])

