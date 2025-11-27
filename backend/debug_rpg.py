from app.database import SessionLocal
from app.routers.rpg import get_rpg_state, check_penalty
from app.models import User

def debug_rpg():
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == 1).first()
        print(f"User found: {user.username}")
        print(f"Hearts: {user.hearts}")
        print(f"Last Checkin: {user.last_checkin_at}")
        
        print("Checking penalty...")
        check_penalty(user)
        print("Penalty checked.")
        
        print("Getting state...")
        # Mock dependency
        state = get_rpg_state(db)
        print("State retrieved:", state)
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    debug_rpg()
