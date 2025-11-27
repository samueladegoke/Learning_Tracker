import sqlite3

def add_columns():
    conn = sqlite3.connect('learning_tracker_rpg_v2.db')
    cursor = conn.cursor()
    
    try:
        cursor.execute("ALTER TABLE users ADD COLUMN hearts INTEGER DEFAULT 3")
        print("Added hearts column")
    except sqlite3.OperationalError as e:
        print(f"Error adding hearts: {e}")

    try:
        cursor.execute("ALTER TABLE users ADD COLUMN last_heart_loss DATETIME")
        print("Added last_heart_loss column")
    except sqlite3.OperationalError as e:
        print(f"Error adding last_heart_loss: {e}")

    conn.commit()
    conn.close()

if __name__ == "__main__":
    add_columns()
