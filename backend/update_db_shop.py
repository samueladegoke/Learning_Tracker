import sqlite3

def add_columns():
    conn = sqlite3.connect('learning_tracker_rpg_v2.db')
    cursor = conn.cursor()
    
    try:
        cursor.execute("ALTER TABLE users ADD COLUMN streak_freeze_count INTEGER DEFAULT 0")
        print("Added streak_freeze_count column")
    except sqlite3.OperationalError as e:
        print(f"Error adding streak_freeze_count: {e}")

    conn.commit()
    conn.close()

if __name__ == "__main__":
    add_columns()
