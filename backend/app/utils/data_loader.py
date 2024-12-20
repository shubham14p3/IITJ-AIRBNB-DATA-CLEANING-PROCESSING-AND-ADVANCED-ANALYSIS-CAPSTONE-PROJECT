import os
import pandas as pd
from .s3_utils import load_csv_from_s3
from ..config import Config

def load_csv_from_local(file_name, nrows=None):
    try:
        file_path = os.path.join(Config.CSV_FOLDER, file_name)
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File {file_name} not found in {Config.CSV_FOLDER}")
        
        return pd.read_csv(file_path, nrows=nrows, low_memory=False)
    except Exception as e:
        print(f"Error loading {file_name} from local storage: {e}")
        return None

def load_csv(file_name, nrows=None):
    try:
        if Config.LOCAL_USE:
            data = load_csv_from_local(file_name, nrows)
        else:
            data = load_csv_from_s3(file_name, nrows)
        if data is None:
            raise ValueError(f"Failed to load {file_name}")
        return data
    except Exception as e:
        print(f"Error in load_csv: {e}")
        return None