#come back to this one, doesn't want to let me access mysql.
import os
import sqlite3
import csv
import mysql.connector

def export_sqlite_to_csv(sqlite_file, table_names, csv_output_directory):
    conn = sqlite3.connect(sqlite_file)
    cursor = conn.cursor()

    for table_name in table_names:
        csv_file = os.path.join(csv_output_directory, f"{table_name}.csv")
        cursor.execute(f"SELECT * FROM {table_name}")
        with open(csv_file, 'w', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            writer.writerow([i[0] for i in cursor.description])
            writer.writerows(cursor.fetchall())

    conn.close()

def import_csv_to_mysql(csv_files, mysql_host, mysql_user, mysql_password, mysql_database, mysql_tables):
    cnx = mysql.connector.connect(host=mysql_host,
                                  user=mysql_user,
                                  password=mysql_password,
                                  database=mysql_database)
    cursor = cnx.cursor()

    for csv_file, mysql_table in zip(csv_files, mysql_tables):
        with open(csv_file, 'r', encoding='utf-8') as file:
            reader = csv.reader(file)
            next(reader)  # Skip header row
            for row in reader:
                cursor.execute(f"INSERT INTO {mysql_table} VALUES ({', '.join('%s' for _ in range(len(row)))})", row)

    cnx.commit()
    cursor.close()
    cnx.close()

if __name__ == "__main__":
    # SQLite settings
    sqlite_file = r'C:\Users\naiya\Documents\GitHub\Zuozhuan-Map-Beta\Database.sqlite'
    table_names = ['locales_corrected', 'personae']

    # CSV output directory
    csv_output_directory = r'C:\Users\naiya\Documents\GitHub\Zuozhuan-Map-Beta\csv'

    # Create the output directory if it doesn't exist
    os.makedirs(csv_output_directory, exist_ok=True)

    # MySQL/MariaDB settings
    mysql_host = 'localhost'
    mysql_user = 'root'
    mysql_password = 'Sc242hdF'
    mysql_database = 'maindb'
    mysql_tables = ['locales', 'personae']

    # Export from SQLite to CSV
    export_sqlite_to_csv(sqlite_file, table_names, csv_output_directory)

    # Specify CSV files
    csv_files = [os.path.join(csv_output_directory, f"{table}.csv") for table in table_names]

    # Import from CSV to MySQL/MariaDB
    import_csv_to_mysql(csv_files, mysql_host, mysql_user, mysql_password, mysql_database, mysql_tables)

    print("Migration completed successfully!")
