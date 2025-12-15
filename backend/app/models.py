from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    xp = Column(Integer, default=0)
    level = Column(Integer, default=1)
    streak = Column(Integer, default=0)
    best_streak = Column(Integer, default=0)
    gold = Column(Integer, default=0)
    focus_points = Column(Integer, default=5)
    focus_refreshed_at = Column(DateTime, default=datetime.utcnow)
    hearts = Column(Integer, default=3)
    last_heart_loss = Column(DateTime, nullable=True)
    streak_freeze_count = Column(Integer, default=0)
    last_checkin_at = Column(DateTime, nullable=True)
    current_week = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    task_statuses = relationship("UserTaskStatus", back_populates="user")
    reflections = relationship("Reflection", back_populates="user")
    badges = relationship("UserBadge", back_populates="user")
    inventories = relationship("UserInventory", back_populates="user")
    challenges = relationship("UserChallenge", back_populates="user")
    user_quests = relationship("UserQuest", back_populates="user")
    quiz_results = relationship("QuizResult", back_populates="user")


class Week(Base):
    __tablename__ = "weeks"

    id = Column(Integer, primary_key=True, index=True)
    week_number = Column(Integer, unique=True, nullable=False)
    title = Column(String(200), nullable=False)
    focus = Column(String(500))
    milestone = Column(String(500))
    checkin_prompt = Column(Text)

    # Relationships
    tasks = relationship("Task", back_populates="week", order_by="Task.id")
    reflections = relationship("Reflection", back_populates="week")


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(String(50), unique=True, nullable=False)  # e.g., "w1-d1"
    week_id = Column(Integer, ForeignKey("weeks.id"), nullable=False)
    day = Column(String(20), nullable=False)  # e.g., "Monday"
    description = Column(Text, nullable=False)
    type = Column(String(50))  # e.g., "lesson", "practice", "coding"
    xp_reward = Column(Integer, default=10)
    badge_reward = Column(String(50), nullable=True)  # badge_id if completing unlocks badge
    difficulty = Column(String(20), default="normal")  # trivial/normal/hard/boss
    category = Column(String(20), default="weekly")  # daily/weekly/quest/challenge
    due_date = Column(DateTime, nullable=True)
    is_boss_task = Column(Boolean, default=False)

    # Relationships
    week = relationship("Week", back_populates="tasks")
    user_statuses = relationship("UserTaskStatus", back_populates="task")
    quest_tasks = relationship("QuestTask", back_populates="task")


class UserTaskStatus(Base):
    __tablename__ = "user_task_statuses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    task_id = Column(Integer, ForeignKey("tasks.id"), nullable=False)
    completed = Column(Boolean, default=False)
    completed_at = Column(DateTime, nullable=True)

    # Relationships
    user = relationship("User", back_populates="task_statuses")
    task = relationship("Task", back_populates="user_statuses")


class Reflection(Base):
    __tablename__ = "reflections"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    week_id = Column(Integer, ForeignKey("weeks.id"), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="reflections")
    week = relationship("Week", back_populates="reflections")


class Badge(Base):
    __tablename__ = "badges"

    id = Column(Integer, primary_key=True, index=True)
    badge_id = Column(String(50), unique=True, nullable=False)  # e.g., "b-week-1"
    name = Column(String(100), nullable=False)
    description = Column(Text)
    xp_value = Column(Integer, default=0)
    difficulty = Column(String(20), default="normal")  # trivial/normal/hard/epic

    # Relationships
    user_badges = relationship("UserBadge", back_populates="badge")


class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    achievement_id = Column(String(50), unique=True, nullable=False)
    name = Column(String(120), nullable=False)
    description = Column(Text)
    xp_value = Column(Integer, default=0)
    difficulty = Column(String(20), default="normal")

    user_achievements = relationship("UserAchievement", back_populates="achievement")


class UserBadge(Base):
    __tablename__ = "user_badges"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    badge_id = Column(Integer, ForeignKey("badges.id"), nullable=False)
    earned_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="badges")
    badge = relationship("Badge", back_populates="user_badges")


class UserAchievement(Base):
    __tablename__ = "user_achievements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    achievement_id = Column(Integer, ForeignKey("achievements.id"), nullable=False)
    earned_at = Column(DateTime, default=datetime.utcnow)

    achievement = relationship("Achievement", back_populates="user_achievements")


class Quest(Base):
    __tablename__ = "quests"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    description = Column(Text)
    boss_hp = Column(Integer, default=100)
    reward_xp_bonus = Column(Integer, default=0)
    reward_badge_id = Column(String(50), nullable=True)

    quest_tasks = relationship("QuestTask", back_populates="quest")
    user_quests = relationship("UserQuest", back_populates="quest")


class QuestTask(Base):
    __tablename__ = "quest_tasks"

    id = Column(Integer, primary_key=True, index=True)
    quest_id = Column(Integer, ForeignKey("quests.id"), nullable=False)
    task_id = Column(Integer, ForeignKey("tasks.id"), nullable=False)

    quest = relationship("Quest", back_populates="quest_tasks")
    task = relationship("Task", back_populates="quest_tasks")


class UserQuest(Base):
    __tablename__ = "user_quests"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    quest_id = Column(Integer, ForeignKey("quests.id"), nullable=False)
    boss_hp_remaining = Column(Integer, default=0)
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="user_quests")
    quest = relationship("Quest", back_populates="user_quests")


class Challenge(Base):
    __tablename__ = "challenges"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    description = Column(Text)
    goal_count = Column(Integer, default=0)
    ends_at = Column(DateTime, nullable=True)
    reward_badge_id = Column(String(50), nullable=True)
    reward_item = Column(String(50), nullable=True)

    user_challenges = relationship("UserChallenge", back_populates="challenge")


class UserChallenge(Base):
    __tablename__ = "user_challenges"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    challenge_id = Column(Integer, ForeignKey("challenges.id"), nullable=False)
    progress = Column(Integer, default=0)
    completed_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="challenges")
    challenge = relationship("Challenge", back_populates="user_challenges")


class UserInventory(Base):
    __tablename__ = "user_inventory"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    item_type = Column(String(50), nullable=False)  # streak_shield, cosmetic, etc.
    item_key = Column(String(100), nullable=False)
    quantity = Column(Integer, default=0)

    user = relationship("User", back_populates="inventories")


class QuizResult(Base):
    __tablename__ = "quiz_results"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    quiz_id = Column(String(50), nullable=False)
    score = Column(Integer, default=0)
    total_questions = Column(Integer, default=0)
    completed_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="quiz_results")



class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(String(50), index=True, nullable=False)  # e.g., "day-1-practice"
    question_type = Column(String(20), default="mcq")  # mcq, coding, code-correction
    text = Column(Text, nullable=False)
    options = Column(Text, nullable=True)  # JSON string of options list (for MCQ/code-correction)
    correct_index = Column(Integer, nullable=True)  # For MCQ/code-correction
    explanation = Column(Text)
