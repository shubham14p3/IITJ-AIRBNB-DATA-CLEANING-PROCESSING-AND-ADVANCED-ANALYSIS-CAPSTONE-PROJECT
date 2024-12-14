import boto3
import pandas as pd
from ..secrets import AWS_CREDENTIALS
from ..config import Config

# Initialize S3 client
try:
    s3 = boto3.client('s3', **AWS_CREDENTIALS)
    print("S3 client initialized successfully.")
except Exception as e:
    print(f"Error initializing S3 client: {e}")
    s3 = None

def load_csv_from_s3(file_name, bucket_name=None, nrows=100):
    """
    Loads a limited number of rows from a CSV file in an S3 bucket.
    """
    bucket_name = Config.BUCKET_NAME

    # Validate bucket_name type
    if not isinstance(bucket_name, str):
        raise ValueError(f"Invalid bucket_name: Expected a string, got {type(bucket_name)}.")

    try:
        print(f"bucket_name={bucket_name} (type={type(bucket_name)})")
        print(f"Trying to load {file_name} from bucket {bucket_name}")

        if s3 is None:
            raise ValueError("S3 client is not initialized.")

        # Fetch the object from S3
        obj = s3.get_object(Bucket=bucket_name, Key=file_name)
        print(f"Successfully fetched {file_name} from S3.")

        # Read the CSV with a row limit
        return pd.read_csv(obj['Body'], nrows=nrows, low_memory=False)

    except Exception as e:
        print(f"Error loading {file_name} from S3: {e}")
        return None


def load_csv_from_s3_merged(file_name, bucket_name=None, nrows=None):
    """
    Load a CSV file from S3 into a pandas DataFrame.
    """
    try:
        obj = s3.get_object(Bucket=bucket_name, Key=file_name)
        print(f"Successfully fetched {file_name} from S3.")
        return pd.read_csv(obj['Body'], nrows=nrows, low_memory=False)
    except Exception as e:
        print(f"Error loading {file_name} from S3: {e}")
        return None