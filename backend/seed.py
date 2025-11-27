"""
Seed loader script - populates the database with data from seed_data.json
Run this script once to initialize the database with weeks, tasks, badges, and default user.
"""
import json
import os
import sys
from typing import Dict, List, Tuple
from datetime import datetime, timedelta

# Add the app directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import engine, SessionLocal, Base
from app.models import (
    User,
    Week,
    Task,
    Badge,
    UserBadge,
    UserTaskStatus,
    Reflection,
    Quest,
    QuestTask,
    UserQuest,
    Challenge,
    UserChallenge,
    UserInventory,
    Achievement,
    UserAchievement,
)


def load_seed_data() -> Dict:
    """Load seed data from JSON file."""
    seed_path = os.path.join(os.path.dirname(__file__), "..", "seed_data.json")

    with open(seed_path, "r", encoding="utf-8") as f:
        return json.load(f)


def sanitize_text(value):
    """Normalize unicode punctuation to ASCII-friendly characters."""
    if not isinstance(value, str):
        return value
    return value.replace("\u2013", "-").replace("\u2014", "-")


def normalize_week(week_data: Dict) -> Tuple[Dict, List[Dict]]:
    """
    Adapt the new seed_data.json structure to the Week/Task schema.
    The new JSON uses `label`/`notes`/`calendar_slot` keys instead of the older names.
    """
    title = sanitize_text(
        week_data.get("title") or week_data.get("label") or f"Week {week_data.get('week_number')}"
    )
    focus = sanitize_text(week_data.get("focus") or week_data.get("notes"))

    tasks = []
    for idx, task_data in enumerate(week_data.get("tasks", [])):
        tasks.append(
            {
                "task_id": task_data["task_id"],
                "day": sanitize_text(task_data.get("day") or task_data.get("calendar_slot") or f"Day {idx + 1}"),
                "description": sanitize_text(task_data.get("description", "")),
                "type": sanitize_text(task_data.get("type")),
                "xp_reward": task_data.get("xp_reward", 10),
                "badge_reward": sanitize_text(task_data.get("badge_reward")),
            }
        )

    # Build a default reflection prompt if one is not provided in the seed
    bootcamp_days = [d for task in week_data.get("tasks", []) for d in task.get("bootcamp_days", [])]
    if bootcamp_days:
        span = f"{min(bootcamp_days)}-{max(bootcamp_days)}"
        default_prompt = (
            f"What were your wins and blockers during Bootcamp days {span}? "
            "What needs a revisit next week?"
        )
    else:
        default_prompt = f"What did you accomplish in {title}? What will you focus on next?"

    week_payload = {
        "week_number": week_data["week_number"],
        "title": title,
        "focus": focus,
        "milestone": sanitize_text(week_data.get("milestone")),
        "checkin_prompt": sanitize_text(week_data.get("checkin_prompt") or default_prompt),
    }

    return week_payload, tasks


def clear_existing_data(db):
    """Remove existing rows so reseeding picks up the latest seed file."""
    db.query(UserInventory).delete()
    db.query(UserChallenge).delete()
    db.query(Challenge).delete()
    db.query(UserQuest).delete()
    db.query(QuestTask).delete()
    db.query(UserAchievement).delete()
    db.query(Achievement).delete()
    db.query(Quest).delete()
    db.query(UserBadge).delete()
    db.query(UserTaskStatus).delete()
    db.query(Reflection).delete()
    db.query(Task).delete()
    db.query(Badge).delete()
    db.query(Week).delete()
    db.query(User).delete()
    db.commit()


def seed_database():
    """Seed the database with initial data."""
    # Recreate tables to match current models
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        print("Resetting existing data...")
        clear_existing_data(db)

        print("Loading seed data...")
        data = load_seed_data()

        # Create default user
        print("Creating default user...")
        default_user = User(
            id=1,
            username="learner",
            xp=0,
            level=1,
            streak=0,
            current_week=1,
        )
        db.add(default_user)
        db.flush()

        # Insert weeks and tasks
        print("Inserting weeks and tasks...")
        task_lookup = {}
        for raw_week in data.get("weeks", []):
            week_payload, tasks_payload = normalize_week(raw_week)
            week = Week(**week_payload)
            db.add(week)
            db.flush()  # Get the week.id

            # Insert tasks for this week
            for task_data in tasks_payload:
                task = Task(week_id=week.id, **task_data)
                db.add(task)
                task_lookup[task.task_id] = task

            print(
                f"  Week {week_payload['week_number']}: {week_payload['title']} - {len(tasks_payload)} tasks"
            )

        # Insert badges (preset)
        print("Inserting badges and achievements...")
        preset_badges = [
            # Week completion (normal)
            {"badge_id": "b-week-1", "name": "Week 1: Core Foundations", "description": "Complete all tasks in Week 1 (Days 1-11)", "xp_value": 20, "difficulty": "normal"},
            {"badge_id": "b-week-2", "name": "Week 2: OOP & Games", "description": "Complete all tasks in Week 2 (Days 12-25)", "xp_value": 20, "difficulty": "normal"},
            {"badge_id": "b-week-3", "name": "Week 3: GUI & Automation", "description": "Complete all tasks in Week 3 (Days 26-35)", "xp_value": 20, "difficulty": "normal"},
            {"badge_id": "b-week-4", "name": "Week 4: APIs & Web", "description": "Complete all tasks in Week 4 (Days 36-45)", "xp_value": 20, "difficulty": "normal"},
            {"badge_id": "b-week-5", "name": "Week 5: Automation Sprint", "description": "Complete all tasks in Week 5 (Days 46-55)", "xp_value": 20, "difficulty": "normal"},
            {"badge_id": "b-week-6", "name": "Week 6: Flask Builder", "description": "Complete all tasks in Week 6 (Days 56-65)", "xp_value": 20, "difficulty": "normal"},
            {"badge_id": "b-week-7", "name": "Week 7: Data & Viz", "description": "Complete all tasks in Week 7 (Days 66-75)", "xp_value": 20, "difficulty": "normal"},
            {"badge_id": "b-week-8", "name": "Week 8: Portfolio Push", "description": "Complete all tasks in Week 8 (Days 76-80)", "xp_value": 20, "difficulty": "hard"},
            {"badge_id": "b-bootcamp-finish", "name": "Bootcamp Finisher", "description": "Finish the entire 80-day bootcamp", "xp_value": 120, "difficulty": "epic"},
            # Streaks (difficulty scales)
            {"badge_id": "b-streak-3", "name": "3-Day Streak", "description": "Complete tasks 3 days in a row", "xp_value": 5, "difficulty": "trivial"},
            {"badge_id": "b-streak-7", "name": "7-Day Streak", "description": "Complete tasks 7 days in a row", "xp_value": 12, "difficulty": "normal"},
            {"badge_id": "b-streak-14", "name": "14-Day Streak", "description": "Complete tasks 14 days in a row", "xp_value": 25, "difficulty": "hard"},
            {"badge_id": "b-streak-30", "name": "30-Day Streak", "description": "Complete tasks 30 days in a row", "xp_value": 60, "difficulty": "epic"},
            # Quests & challenges
            {"badge_id": "b-quest-fundamentals", "name": "Boss Slayer: Fundamentals", "description": "Defeat the Fundamentals boss quest", "xp_value": 40, "difficulty": "hard"},
            {"badge_id": "b-challenge-7day", "name": "7-Day Consistency", "description": "Finish the 7-day consistency challenge", "xp_value": 30, "difficulty": "normal"},
        ]
        for badge_data in preset_badges:
            db.add(
                Badge(
                    badge_id=badge_data["badge_id"],
                    name=badge_data["name"],
                    description=badge_data.get("description"),
                    xp_value=badge_data.get("xp_value", 0),
                    difficulty=badge_data.get("difficulty", "normal"),
                )
            )
            print(f"  Badge: {badge_data['name']}")

        # Achievements (broader milestones)
        achievements = [
            {"achievement_id": "a-first-task", "name": "First Step Taken", "description": "Complete your first task", "xp_value": 10, "difficulty": "trivial"},
            {"achievement_id": "a-ten-tasks", "name": "Warming Up", "description": "Complete 10 tasks", "xp_value": 20, "difficulty": "normal"},
            {"achievement_id": "a-fifty-tasks", "name": "Task Grinder", "description": "Complete 50 tasks", "xp_value": 50, "difficulty": "hard"},
            {"achievement_id": "a-hundred-tasks", "name": "Century Club", "description": "Complete 100 tasks", "xp_value": 100, "difficulty": "epic"},
            {"achievement_id": "a-boss-first", "name": "First Boss Down", "description": "Defeat any quest boss", "xp_value": 30, "difficulty": "hard"},
            {"achievement_id": "a-all-weeks", "name": "Roadmap Master", "description": "Complete all weeks in the roadmap", "xp_value": 120, "difficulty": "epic"},
        ]
        for a in achievements:
            db.add(
                Achievement(
                    achievement_id=a["achievement_id"],
                    name=a["name"],
                    description=a.get("description"),
                    xp_value=a.get("xp_value", 0),
                    difficulty=a.get("difficulty", "normal"),
                )
            )
            print(f"  Achievement: {a['name']}")

        # Sample quest (bootcamp boss)
        print("Creating sample quest...")
        quest = Quest(
            name="Bootcamp Boss: Fundamentals",
            description="Defeat the fundamentals boss by clearing core review tasks.",
            boss_hp=200,
            reward_xp_bonus=50,
            reward_badge_id="b-quest-fundamentals",
        )
        db.add(quest)
        db.flush()

        # Map first three tasks to quest
        for task_id in ["w1-d1", "w1-d2", "w1-d3"]:
            if task_id in task_lookup:
                db.add(QuestTask(quest_id=quest.id, task_id=task_lookup[task_id].id))

        db.add(
            UserQuest(
                user_id=default_user.id,
                quest_id=quest.id,
                boss_hp_remaining=quest.boss_hp,
            )
        )

        # Sample 7-day consistency challenge
        print("Creating sample challenge...")
        challenge = Challenge(
            name="7-Day Consistency",
            description="Complete any task each day for a week.",
            goal_count=7,
            ends_at=datetime.utcnow() + timedelta(days=7),
            reward_badge_id="b-challenge-7day",
            reward_item="streak_shield_basic",
        )
        db.add(challenge)
        db.flush()

        db.add(
            UserChallenge(
                user_id=default_user.id,
                challenge_id=challenge.id,
                progress=0,
            )
        )

        # Starter inventory: 1 streak shield
        db.add(
            UserInventory(
                user_id=default_user.id,
                item_type="streak_shield",
                item_key="streak_shield_basic",
                quantity=1,
            )
        )

        db.commit()
        print("\nDatabase seeded successfully!")

        # Print summary
        weeks_count = db.query(Week).count()
        tasks_count = db.query(Task).count()
        badges_count = db.query(Badge).count()
        print(f"\nSummary:")
        print(f"  - Users: 1")
        print(f"  - Weeks: {weeks_count}")
        print(f"  - Tasks: {tasks_count}")
        print(f"  - Badges: {badges_count}")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()

