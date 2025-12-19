import sqlite3
import datetime
import os

# Database path relative to this script or current directory
db_path = 'learning_tracker_rpg_v2.db'

if not os.path.exists(db_path):
    print(f"Database not found at {db_path}")
    exit(1)

try:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # SQLite datetime format is usually 'YYYY-MM-DD HH:MM:SS.SSS'
    past_date = (datetime.datetime.now() - datetime.timedelta(days=1)).strftime('%Y-%m-%d %H:%M:%S.%f')
    
    print(f"Updating reviews to be due at {past_date}")
    
    cursor.execute("UPDATE user_question_reviews SET due_date = ?", (past_date,))
    
    print(f"Rows affected: {cursor.rowcount}")
    
    conn.commit()
    conn.close()
    print("Successfully updated database.")
except Exception as e:
    print(f"Error: {e}")
