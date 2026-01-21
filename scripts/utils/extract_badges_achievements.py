import sqlite3

conn = sqlite3.connect('backend/learning_tracker_rpg_v2.db')
c = conn.cursor()

# Get badges
c.execute('SELECT id, badge_id, name, description, xp_value, difficulty FROM badges')
badges = c.fetchall()
print('-- BADGES SQL --')
for b in badges:
    desc = b[3].replace("'", "''") if b[3] else ''
    name = b[2].replace("'", "''") if b[2] else ''
    print(f"INSERT INTO badges (id, badge_id, name, description, xp_value, difficulty) VALUES ({b[0]}, '{b[1]}', '{name}', '{desc}', {b[4]}, '{b[5]}');")

# Get achievements  
c.execute('SELECT id, achievement_id, name, description, xp_value, difficulty FROM achievements')
achievements = c.fetchall()
print()
print('-- ACHIEVEMENTS SQL --')
for a in achievements:
    desc = a[3].replace("'", "''") if a[3] else ''
    name = a[2].replace("'", "''") if a[2] else ''
    print(f"INSERT INTO achievements (id, achievement_id, name, description, xp_value, difficulty) VALUES ({a[0]}, '{a[1]}', '{name}', '{desc}', {a[4]}, '{a[5]}');")

conn.close()
