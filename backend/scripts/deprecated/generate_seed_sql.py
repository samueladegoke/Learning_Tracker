import json

# Load seed data
with open('../seed_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Generate SQL INSERT statements for weeks
weeks_sql = []
tasks_sql = []

for week in data['weeks']:
    week_sql = f"""INSERT INTO weeks (week_number, label, notes) VALUES ({week['week_number']}, '{week['label'].replace("'", "''")}', '{week.get('notes', '').replace("'", "''")}');"""
    weeks_sql.append(week_sql)

    for task in week['tasks']:
        bootcamp_days_json = json.dumps(task['bootcamp_days']).replace("'", "''")
        bootcamp_titles_json = json.dumps(task['bootcamp_day_titles']).replace("'", "''")
        task_sql = f"""INSERT INTO tasks (task_id, week_number, calendar_slot, bootcamp_days, bootcamp_day_titles, type, xp_reward, description)
VALUES ('{task['task_id']}', {week['week_number']}, '{task['calendar_slot']}', '{bootcamp_days_json}', '{bootcamp_titles_json}', '{task['type']}', {task['xp_reward']}, '{task['description'].replace("'", "''")}');"""
        tasks_sql.append(task_sql)

# Write SQL to file
with open('seed_production.sql', 'w', encoding='utf-8') as f:
    f.write("-- Seed weeks\n")
    for sql in weeks_sql:
        f.write(sql + "\n")
    f.write("\n-- Seed tasks\n")
    for sql in tasks_sql:
        f.write(sql + "\n")

print(f"Generated {len(weeks_sql)} weeks and {len(tasks_sql)} tasks SQL statements")
