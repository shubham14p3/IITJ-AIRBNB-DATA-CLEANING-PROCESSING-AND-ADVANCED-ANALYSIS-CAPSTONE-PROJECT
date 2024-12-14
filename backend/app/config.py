class Config:
    DEBUG = True
    SECRET_KEY = 'your_secret_key'
    BUCKET_NAME = "iitj-data-ingestion-bucket"
    LOCAL_USE = True  # Set to False to use S3 data
    CSV_FOLDER = "./csv"  # Folder for local CSV files
