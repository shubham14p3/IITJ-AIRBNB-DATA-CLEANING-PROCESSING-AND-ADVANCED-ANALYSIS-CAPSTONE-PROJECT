import mysql.connector
from ..secrets import DB_CREDENTIALS

def upload_to_rds_batch(table_name, columns, data):
    connection = mysql.connector.connect(**DB_CREDENTIALS)
    cursor = connection.cursor()

    placeholders = ", ".join(["%s"] * len(columns))
    query = f"INSERT INTO {table_name} ({', '.join(columns)}) VALUES ({placeholders})"

    cursor.executemany(query, data)
    connection.commit()
    cursor.close()
    connection.close()
