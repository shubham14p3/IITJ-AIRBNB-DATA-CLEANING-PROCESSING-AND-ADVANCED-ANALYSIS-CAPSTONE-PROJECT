import boto3
from ..secrets import AWS_CREDENTIALS

s3 = boto3.client('s3', **AWS_CREDENTIALS)

def load_csv_from_s3(file_name, bucket_name=None, nrows=None):
    bucket_name = bucket_name or Config.BUCKET_NAME
    try:
        obj = s3.get_object(Bucket=bucket_name, Key=file_name)
        return pd.read_csv(obj["Body"], nrows=nrows, low_memory=False)
    except Exception as e:
        print(f"Error loading {file_name} from S3: {e}")
        return None
