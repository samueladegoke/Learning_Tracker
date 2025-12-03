"""
Manual test for Boss Battle logic and penalty system.
Tests:
1. Boss HP calculation and damage dealing
2. Boss defeat and auto-progression
3. Penalty system (single penalty per streak break)
"""
from datetime import datetime, timedelta, date
from app.database import SessionLocal
from app.models import User, Quest, UserQuest, Task, UserTaskStatus
from app.routers.rpg import check_penalty
from app.routers.tasks import complete_task, apply_quest_damage

def test_penalty_logic():
    """Test that penalty is only applied once per streak break."""
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == 1).first()
        
        print("\n=== PENALTY LOGIC TEST ===")
        print(f"Initial state: Hearts={user.hearts}, Streak={user.streak}")
        
        # Scenario 1: User was active 3 days ago, lost a heart 2 days ago
        # Should NOT lose another heart today
        user.last_checkin_at = datetime.utcnow() - timedelta(days=3)
        user.last_heart_loss = datetime.utcnow() - timedelta(days=2)
        user.hearts = 2
        initial_hearts = user.hearts
        
        check_penalty(user)
        
        print(f"\nScenario 1: Active 3 days ago, penalized 2 days ago")
        print(f"Days since checkin: 3, Days since penalty: 2")
        print(f"Hearts before: {initial_hearts}, Hearts after: {user.hearts}")
        print(f"Expected: No penalty (already penalized for this break)")
        print(f"Result: {'✅ PASS' if user.hearts == initial_hearts else '❌ FAIL'}")
        
        # Scenario 2: User was active yesterday, no previous penalty
        # Should NOT lose a heart (1-day grace)
        user.last_checkin_at = datetime.utcnow() - timedelta(days=1)
        user.last_heart_loss = None
        user.hearts = 3
        initial_hearts = user.hearts
        
        check_penalty(user)
        
        print(f"\nScenario 2: Active yesterday, no previous penalty")
        print(f"Days since checkin: 1")
        print(f"Hearts before: {initial_hearts}, Hearts after: {user.hearts}")
        print(f"Expected: No penalty (1-day grace period)")
        print(f"Result: {'✅ PASS' if user.hearts == initial_hearts else '❌ FAIL'}")
        
        # Scenario 3: User was active 2 days ago, no previous penalty
        # Should lose 1 heart (first penalty for this break)
        user.last_checkin_at = datetime.utcnow() - timedelta(days=2)
        user.last_heart_loss = None
        user.hearts = 3
        initial_hearts = user.hearts
        
        check_penalty(user)
        
        print(f"\nScenario 3: Active 2 days ago, no previous penalty")
        print(f"Days since checkin: 2")
        print(f"Hearts before: {initial_hearts}, Hearts after: {user.hearts}")
        print(f"Expected: Lose 1 heart (first penalty)")
        print(f"Result: {'✅ PASS' if user.hearts == initial_hearts - 1 else '❌ FAIL'}")
        
    finally:
        db.rollback()  # Don't save test changes
        db.close()


def test_boss_battle_logic():
    """Test Boss HP damage and progression."""
    db = SessionLocal()
    try:
        print("\n=== BOSS BATTLE LOGIC TEST ===")
        
        # Get active boss
        user_quest = db.query(UserQuest).filter(
            UserQuest.user_id == 1,
            UserQuest.completed_at.is_(None)
        ).first()
        
        if not user_quest or not user_quest.quest:
            print("❌ No active boss found")
            return
        
        boss = user_quest.quest
        print(f"\nActive Boss: {boss.name}")
        print(f"Boss HP: {boss.boss_hp}")
        print(f"Remaining HP: {user_quest.boss_hp_remaining}")
        
        # Test damage calculation
        test_damage = 15
        initial_hp = user_quest.boss_hp_remaining
        new_hp, defeated = apply_quest_damage(db, user_quest, test_damage)
        
        print(f"\nDamage Test:")
        print(f"Dealt: {test_damage} damage")
        print(f"HP: {initial_hp} → {new_hp}")
        print(f"Expected: {initial_hp - test_damage}")
        print(f"Result: {'✅ PASS' if new_hp == initial_hp - test_damage else '❌ FAIL'}")
        
        # Check if boss would be defeated with enough damage
        if initial_hp <= test_damage:
            print(f"\nDefeat Test:")
            print(f"Boss defeated: {defeated}")
            print(f"Expected: True")
            print(f"Result: {'✅ PASS' if defeated else '❌ FAIL'}")
        
        # Test task-to-quest mapping
        tasks = db.query(Task).filter(Task.task_id.in_(["w1-d1", "w1-d2"])).all()
        print(f"\nTask Mapping Test:")
        print(f"Found {len(tasks)} tasks for Week 1")
        
        for task in tasks:
            print(f"  - {task.task_id}: {task.xp_reward} XP")
        
        print(f"Result: {'✅ PASS' if len(tasks) > 0 else '❌ FAIL'}")
        
    finally:
        db.rollback()
        db.close()


if __name__ == "__main__":
    print("Starting manual tests...")
    test_penalty_logic()
    test_boss_battle_logic()
    print("\n=== ALL TESTS COMPLETE ===")
