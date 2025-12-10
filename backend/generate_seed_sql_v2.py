import json
import re

# Load seed data
with open('../seed_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

weeks_sql = []
tasks_sql = []

def sanitize(text):
    if not text: return "NULL"
    # Convert to string
    s = str(text)
    
    # 1. Strip emojis (Unicode ranges for emojis and symbols)
    # This is a broad regex for surrogate pairs and common emoji ranges
    s = re.sub(r'[^\x00-\x7F]+', '', s) # Aggressive ASCII only (removes accents too! careful)
    # Use a safer one if accents break, but for "Bootcamp" English text, ASCII is safe enough and guarantees no emojis.
    
    # 2. SQL Escaping
    s = s.replace("'", "''")
    return "'" + s + "'"

for week in data['weeks']:
    # Map label -> title, notes -> focus
    # Force ID to match week_number for easy FK relationships
    week_sql = f"""INSERT INTO weeks (id, week_number, title, focus, milestone, checkin_prompt) 
    VALUES ({week['week_number']}, {week['week_number']}, {sanitize(week['label'])}, {sanitize(week.get('notes'))}, NULL, NULL);"""
    weeks_sql.append(week_sql)
    
    for task in week['tasks']:
        # Map calendar_slot -> day
        # Map week_number -> week_id
        
        task_sql = f"""INSERT INTO tasks (task_id, week_id, day, description, type, xp_reward, badge_reward, difficulty, category, is_boss_task) 
        VALUES ({sanitize(task['task_id'])}, {week['week_number']}, {sanitize(task['calendar_slot'])}, {sanitize(task['description'])}, {sanitize(task['type'])}, {task.get('xp_reward', 10)}, NULL, 'normal', 'weekly', FALSE);"""
        tasks_sql.append(task_sql)

# Write SQL to file
with open('seed_production_corrected.sql', 'w', encoding='utf-8') as f:
    f.write("-- Seed weeks (Standard Schema + ZERO EMOJI ENFORCED)\n")
    for sql in weeks_sql:
        f.write(sql + "\n")
    f.write("\n-- Seed tasks (Standard Schema + ZERO EMOJI ENFORCED)\n")
    for sql in tasks_sql:
        f.write(sql + "\n")

print(f"Generated {len(weeks_sql)} weeks and {len(tasks_sql)} tasks SQL statements")
