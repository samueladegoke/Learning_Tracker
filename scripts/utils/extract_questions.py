import sqlite3
import json

conn = sqlite3.connect('backend/learning_tracker_rpg_v2.db')
c = conn.cursor()

# Get all questions
c.execute('SELECT id, quiz_id, text, options, correct_index, explanation FROM questions ORDER BY id')
questions = c.fetchall()

print('-- ALL QUESTIONS SQL --')
for q in questions:
    qid = q[0]
    quiz_id = q[1]
    text = str(q[2]).replace("'", "''")
    options = str(q[3]).replace("'", "''")
    correct_idx = q[4]
    explanation = str(q[5]).replace("'", "''") if q[5] else None
    expl_val = f"'{explanation}'" if explanation else 'NULL'
    
    print(f"({qid}, '{quiz_id}', '{text}', '{options}', {correct_idx}, {expl_val}),")

conn.close()
