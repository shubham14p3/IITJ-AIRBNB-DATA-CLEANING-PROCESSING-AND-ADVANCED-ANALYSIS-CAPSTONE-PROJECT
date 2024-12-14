import pymysql
import pandas as pd
from ..secrets import DB_CREDENTIALS

def get_db_connection():
    """
    Establish a connection to the Amazon RDS database.
    """
    try:
        # Create a connection to the RDS database
        conn = pymysql.connect(
            host=DB_CREDENTIALS['host'],
            user=DB_CREDENTIALS['user'],
            password=DB_CREDENTIALS['password'],
            database=DB_CREDENTIALS['database'],
            port=3306,
            connect_timeout=30,  # Connection timeout (seconds)
            read_timeout=60,     # Read operation timeout (seconds)
            write_timeout=60,    # Write operation timeout (seconds)
            cursorclass=pymysql.cursors.DictCursor  # Fetch results as dictionaries
        )
        print("Database connection established.")  # Connection successful
        return conn
    except pymysql.MySQLError as e:
        # Handle any errors during connection
        print(f"Error connecting to the database: {e}")
        raise  # Propagate the exception for debugging


def check_table_exists_and_clear(conn, table_name):
    """
    Check if the table exists in the database. If it exists, clear its data.
    """
    try:
        with conn.cursor() as cursor:
            # Query to check if the table exists
            cursor.execute(f"SHOW TABLES LIKE '{table_name}'")
            table_exists = cursor.fetchone()

            if table_exists:
                # If the table exists, clear its data
                print(f"Table {table_name} exists. Clearing data.")
                cursor.execute(f"DELETE FROM `{table_name}`")  # Clear all rows in the table
                conn.commit()  # Commit the changes
                print(f"Table {table_name} cleared successfully.")
                return True
            else:
                # If the table does not exist
                print(f"Table {table_name} does not exist.")
                return False
    except Exception as e:
        # Handle any errors during the table check
        print(f"Error checking table {table_name}: {e}")
        raise


def create_table(conn, table_name, dataframe):
    """
    Create a new table in the database based on the structure of the DataFrame.
    """
    try:
        with conn.cursor() as cursor:
            # Dynamically generate the CREATE TABLE SQL statement based on the DataFrame's columns
            print(f"Creating table {table_name}.")
            columns = ", ".join([f"`{col}` VARCHAR(255)" for col in dataframe.columns])  # Set all columns to VARCHAR(255)
            create_table_sql = f"CREATE TABLE `{table_name}` ({columns})"
            cursor.execute(create_table_sql)
            conn.commit()  # Commit the changes
            print(f"Table {table_name} created successfully.")
    except Exception as e:
        # Handle any errors during table creation
        print(f"Error creating table {table_name}: {e}")
        raise


def upload_csv_to_db(dataframe, table_name):
    """
    Upload a pandas DataFrame to a specific table in the database and fetch 10-20 records for the UI.
    """
    conn = None
    try:
        # Step 1: Establish the database connection
        conn = get_db_connection()

        # Step 2: Check if the table exists
        table_exists = check_table_exists_and_clear(conn, table_name)

        if not table_exists:
            # If the table does not exist, create a new one
            create_table(conn, table_name, dataframe)

        # Step 3: Replace NaN values with None for MySQL compatibility
        dataframe = dataframe.where(pd.notnull(dataframe), None)

        # Step 4: Prepare the SQL INSERT query
        placeholders = ', '.join(['%s'] * len(dataframe.columns))  # Generate placeholders for the columns
        columns = ', '.join([f"`{col}`" for col in dataframe.columns])  # Use backticks for column names
        sql = f"INSERT INTO `{table_name}` ({columns}) VALUES ({placeholders})"

        # Step 5: Convert DataFrame rows into a list of tuples for insertion
        data_tuples = [tuple(row) for row in dataframe.itertuples(index=False, name=None)]

        # Step 6: Execute the INSERT query in batch
        with conn.cursor() as cursor:
            cursor.executemany(sql, data_tuples)

        # Step 7: Commit the changes to the database
        conn.commit()
        print(f"Data successfully inserted into {table_name}. Rows affected: {len(data_tuples)}.")

        # Step 8: Fetch 10-20 records for the UI
        records = fetch_records(conn, table_name, limit=20, offset=10)
        return {
            "message": "Data uploaded successfully",
            "status": True,
            "data": records
        }

    except Exception as e:
        # Handle any errors during data upload
        print(f"Error uploading data to the database: {e}")
        return {
            "message": f"Error uploading data: {str(e)}",
            "status": False,
            "data": None
        }
    finally:
        # Close the database connection
        if conn:
            conn.close()


def fetch_records(conn, table_name, limit=20, offset=0):
    """
    Fetch a subset of records from the table for the UI.
    """
    try:
        with conn.cursor() as cursor:
            # SQL query to fetch records with limit and offset
            sql = f"SELECT * FROM `{table_name}` LIMIT {limit} OFFSET {offset}"
            cursor.execute(sql)
            records = cursor.fetchall()  # Fetch all the rows returned by the query
            print(f"Fetched {len(records)} records from {table_name}.")
            return records  # Return the records for the UI
    except Exception as e:
        print(f"Error fetching records from {table_name}: {e}")
        raise


def fetch_top_records(table_name, limit=5):
    """
    Fetch the top N records from the specified table.
    """
    conn = None
    try:
        # Establish the database connection
        conn = get_db_connection()

        # Fetch the top N records
        records = fetch_records(conn, table_name, limit=limit, offset=0)
        return records
    except Exception as e:
        print(f"Error fetching top records from {table_name}: {e}")
        raise
    finally:
        if conn:
            conn.close()
