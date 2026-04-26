import pandas as pd
import mysql.connector
import re

print("🚀 Script started")

# Load CSV
df = pd.read_csv("all_villages_cleaned.csv", low_memory=False)
print("✅ CSV loaded")

# Remove unwanted columns
df = df.loc[:, ~df.columns.str.contains('^unnamed')]

# ✅ Clean function (define BEFORE loop)
def clean(text):
    if pd.isna(text):
        return ""
    text = str(text).strip()              # remove spaces
    text = re.sub(r"\(.*?\)", "", text)   # remove (numbers)
    text = text.replace("'", "")          # remove quotes
    return text

# Connect to MySQL
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Mosin098123@12",
    database="villages_db"
)

print("✅ Connected to MySQL")

cursor = conn.cursor()

count = 0

# ✅ LOOP STARTS HERE
for _, row in df.iterrows():
    query = """
    INSERT INTO villages (state, district, sub_district, village)
    VALUES (%s, %s, %s, %s)
    """

    values = (
        clean(row.get("state_name", "")),
        clean(row.get("district_name", "")),
        clean(row.get("sub-district_name", "")),
        clean(row.get("area_name", ""))
    )

    cursor.execute(query, values)
    count += 1

    if count % 1000 == 0:
        print(f"Inserted {count} rows...")

# Save changes
conn.commit()

print("✅ Data inserted successfully!")