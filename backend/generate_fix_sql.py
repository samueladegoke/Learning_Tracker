
import json
import sys

# Load seed data
with open('../seed_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Generate SQL UPDATE statements for weeks
update_sql = []

for week in data['weeks']:
    # Escape single quotes in label if any
    title = week['label'].replace("'", "''")
    week_num = week['week_number']
    # Use 'title' column instead of 'label'
    sql = f"UPDATE weeks SET title = '{title}' WHERE week_number = {week_num};"
    update_sql.append(sql)

# Write SQL to file
with open('fix_typos.sql', 'w', encoding='utf-8') as f:
    f.write("-- Fix week titles\n")
    for sql in update_sql:
        f.write(sql + "\n")

print(f"Generated {len(update_sql)} UPDATE statements.")
