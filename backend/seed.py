"""
Seed loader script - populates the database with data from seed_data.json
Run this script once to initialize the database with weeks, tasks, badges, and default user.
"""
import json
import os
import sys
from typing import Dict, List, Tuple
from datetime import datetime, timedelta
from sqlalchemy.orm import Session

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
    Question,
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
    db.query(Question).delete() # Added Question to clear existing data
    db.commit()


def seed_questions(db: Session):
    """Seed initial quiz questions."""
    # Check if questions exist
    if db.query(Question).first():
        print("Questions already exist, skipping seeding.")
        return

    print("Seeding questions...")

    day1_questions = [
        {
            "q": "What is the correct way to assign 10 to 'score'?",
            "options": ["score == 10", "score = 10", "10 = score", "int score = 10"],
            "answer": 1,
            "explanation": "In Python, '=' is the assignment operator. '==' is for comparison."
        },
        {
            "q": "What does input() return by default?",
            "options": ["Integer", "Float", "String", "Boolean"],
            "answer": 2,
            "explanation": "input() always returns a string, even if the user types a number."
        },
        {
            "q": "Which variable name is invalid?",
            "options": ["user_name", "total_score", "2nd_player", "player2"],
            "answer": 2,
            "explanation": "Variable names cannot start with a number."
        },
        {
            "q": "What is the output of: print('Hello' + ' ' + 'World')?",
            "options": ["Hello World", "Hello+ +World", "HelloWorld", "Error"],
            "answer": 0,
            "explanation": "The '+' operator concatenates (joins) strings together."
        },
        {
            "q": "How do you check the length of a string 'text'?",
            "options": ["'text'.length", "len('text')", "length('text')", "'text'.size()"],
            "answer": 1,
            "explanation": "len() is a built-in Python function to get the length of a sequence."
        }
    ]

    for q in day1_questions:
        db_question = Question(
            quiz_id="day-1-practice",
            text=q["q"],
            options=json.dumps(q["options"]),
            correct_index=q["answer"],
            explanation=q["explanation"]
        )
        db.add(db_question)

    db.commit()
    print(f"  Seeded {len(day1_questions)} questions for 'day-1-practice'.")

    day2_questions = [
        {
            "q": "What is the data type of the result for: a = int(\"5\") / int(2.7)",
            "options": ["int", "float", "str", "bool"],
            "answer": 1,
            "explanation": "Converting both values to int then dividing uses true division, which returns a float."
        },
        {
            "q": "Which expression correctly calculates BMI from weight_kg and height_m?",
            "options": [
                "weight_kg / (height_m ** 2)",
                "weight_kg * height_m ** 2",
                "weight_kg / height_m * 2",
                "weight_kg // height_m ** 2"
            ],
            "answer": 0,
            "explanation": "BMI is weight divided by height squared. Parentheses ensure the exponent applies before division."
        },
        {
            "q": "How do you format a number called share so it always shows exactly two decimal places?",
            "options": [
                "print(f\"{share:.2f}\")",
                "print(round(share))",
                "print(str(share)[:4])",
                "print(format(share, \".0f\"))"
            ],
            "answer": 0,
            "explanation": "An f-string with .2f keeps two digits after the decimal, matching the Day 2 tip calculator requirement."
        },
        {
            "q": "What is the result of 8 % 3?",
            "options": ["2", "2.66", "3", "1"],
            "answer": 0,
            "explanation": "Modulo returns the remainder of division. 8 divided by 3 leaves a remainder of 2."
        },
        {
            "q": "Why does this line raise a TypeError? print(\"You are \" + age + \" years old\") when age = 12",
            "options": [
                "You cannot concatenate a string and an integer without converting the integer.",
                "The variable name age is invalid.",
                "print() cannot handle numbers.",
                "Strings must use single quotes."
            ],
            "answer": 0,
            "explanation": "String concatenation requires both operands to be strings. Wrap age with str() or use an f-string."
        }
    ]

    for q in day2_questions:
        db_question = Question(
            quiz_id="day-2-practice",
            text=q["q"],
            options=json.dumps(q["options"]),
            correct_index=q["answer"],
            explanation=q["explanation"]
        )
        db.add(db_question)

    db.commit()
    print(f"  Seeded {len(day2_questions)} questions for 'day-2-practice'.")


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
            # Quiz achievements
            {"achievement_id": "a-quiz-master", "name": "Quiz Master", "description": "Score 100% on any quiz", "xp_value": 50, "difficulty": "hard"},
            {"achievement_id": "a-quiz-streak", "name": "Quiz Streak", "description": "Complete 5 quizzes", "xp_value": 30, "difficulty": "normal"},
            {"achievement_id": "a-code-ninja", "name": "Code Ninja", "description": "Get 25 coding questions correct", "xp_value": 40, "difficulty": "hard"},
            # Streak achievements
            {"achievement_id": "a-streak-legend", "name": "Streak Legend", "description": "Maintain a 30-day streak", "xp_value": 100, "difficulty": "epic"},
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

        # Create Boss Battle badges
        boss_badges = [
            {"badge_id": "b-boss-syntax-serpent", "name": "Syntax Serpent Slayer", "description": "Defeated the Syntax Serpent - Python Foundations Master", "xp_value": 50, "difficulty": "hard"},
            {"badge_id": "b-boss-oop-titan", "name": "OOP Titan Vanquisher", "description": "Defeated the OOP Titan - Object-Oriented Champion", "xp_value": 60, "difficulty": "hard"},
            {"badge_id": "b-boss-gui-golem", "name": "GUI Golem Crusher", "description": "Defeated the GUI Golem - Interface Architect", "xp_value": 70, "difficulty": "hard"},
            {"badge_id": "b-boss-api-hydra", "name": "API Hydra Hunter", "description": "Defeated the API Hydra - Automation Master", "xp_value": 80, "difficulty": "epic"},
            {"badge_id": "b-boss-flask-dragon", "name": "Flask Dragon Tamer", "description": "Defeated the Flask Dragon - Full-Stack Hero", "xp_value": 100, "difficulty": "epic"},
            {"badge_id": "b-boss-data-leviathan", "name": "Data Leviathan Conqueror", "description": "Defeated the Data Leviathan - Data Wizard", "xp_value": 120, "difficulty": "epic"},
            {"badge_id": "b-boss-portfolio-phoenix", "name": "Portfolio Phoenix Champion", "description": "Defeated the Portfolio Phoenix - Bootcamp Champion", "xp_value": 150, "difficulty": "legendary"},
        ]

        for badge_data in boss_badges:
            db.add(
                Badge(
                    badge_id=badge_data["badge_id"],
                    name=badge_data["name"],
                    description=badge_data.get("description"),
                    xp_value=badge_data.get("xp_value", 0),
                    difficulty=badge_data.get("difficulty", "normal"),
                )
            )

        # Create dynamic Boss Battle system based on curriculum milestones
        print("Creating milestone-based Boss Battles...")
        bosses_data = [
            {
                "name": "The Syntax Serpent",
                "description": "The first guardian of Python mastery. Defeat it by proving your command of variables, loops, functions, and basic data structures.",
                "boss_hp": 70,
                "reward_xp_bonus": 30,
                "reward_badge_id": "b-boss-syntax-serpent",
                "task_ids": ["w1-d1", "w1-d2", "w1-d3", "w1-d4", "w1-d5"]  # Week 1 (Beginner Foundations)
            },
            {
                "name": "The OOP Titan",
                "description": "A structured beast that tests your understanding of classes, objects, and inheritance. Only clean, encapsulated code can bring it down.",
                "boss_hp": 95,
                "reward_xp_bonus": 40,
                "reward_badge_id": "b-boss-oop-titan",
                "task_ids": ["w2-d1", "w2-d2", "w2-d3", "w2-d4", "w2-d5"]  # Week 2 (OOP Mastery)
            },
            {
                "name": "The GUI Golem",
                "description": "This boss demands mastery of Tkinter interfaces and API interactions. Build beautiful, functional applications to conquer it.",
                "boss_hp": 70,
                "reward_xp_bonus": 50,
                "reward_badge_id": "b-boss-gui-golem",
                "task_ids": ["w3-d1", "w3-d2", "w3-d3", "w3-d4", "w3-d5"]  # Week 3 (GUI & Automation)
            },
            {
                "name": "The API Hydra",
                "description": "A multi-headed beast representing complex API integrations, web scraping, and automation. Each task you complete severs one of its heads.",
                "boss_hp": 80,
                "reward_xp_bonus": 60,
                "reward_badge_id": "b-boss-api-hydra",
                "task_ids": ["w4-d1", "w4-d2", "w4-d3", "w4-d4", "w4-d5"]  # Week 4 (API & Automation)
            },
            {
                "name": "The Flask Dragon",
                "description": "The Flask Dragon breathes fire and serves dynamic web pages. Defeat it with full-stack development skills, from Selenium bots to complete Flask applications.",
                "boss_hp": 160,
                "reward_xp_bonus": 80,
                "reward_badge_id": "b-boss-flask-dragon",
                "task_ids": ["w5-d1", "w5-d2", "w5-d3", "w5-d4", "w5-d5", "w6-d1", "w6-d2", "w6-d3", "w6-d4", "w6-d5"]  # Weeks 5-6 (Web Dev)
            },
            {
                "name": "The Data Leviathan",
                "description": "A colossal beast swimming in oceans of data. Conquer it with pandas, matplotlib, and visualization prowess.",
                "boss_hp": 90,
                "reward_xp_bonus": 100,
                "reward_badge_id": "b-boss-data-leviathan",
                "task_ids": ["w7-d1", "w7-d2", "w7-d3", "w7-d4", "w7-d5"]  # Week 7 (Data Science)
            },
            {
                "name": "The Portfolio Phoenix",
                "description": "The ultimate test. This legendary Phoenix represents your complete transformation into a professional Python developer. Defeat it to earn your place among the masters.",
                "boss_hp": 200,
                "reward_xp_bonus": 150,
                "reward_badge_id": "b-boss-portfolio-phoenix",
                "task_ids": ["w8-d1", "w8-d2", "w8-d3", "w8-d4", "w8-d5"]  # Week 8 (Capstone)
            },
        ]

        quest_objects = []
        for boss_data in bosses_data:
            quest = Quest(
                name=boss_data["name"],
                description=boss_data["description"],
                boss_hp=boss_data["boss_hp"],
                reward_xp_bonus=boss_data["reward_xp_bonus"],
                reward_badge_id=boss_data["reward_badge_id"],
            )
            db.add(quest)
            db.flush()

            # Map tasks to quest
            for task_id in boss_data["task_ids"]:
                if task_id in task_lookup:
                    db.add(QuestTask(quest_id=quest.id, task_id=task_lookup[task_id].id))

            quest_objects.append(quest)
            print(f"  Created Boss: {boss_data['name']} ({boss_data['boss_hp']} HP)")

        # Assign first Boss to user
        db.add(
            UserQuest(
                user_id=default_user.id,
                quest_id=quest_objects[0].id,
                boss_hp_remaining=quest_objects[0].boss_hp,
            )
        )

        seed_questions(db)

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
        print("\nSummary:")
        print("  - Users: 1")
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
