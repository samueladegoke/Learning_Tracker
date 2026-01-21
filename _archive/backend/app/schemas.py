from datetime import datetime
from typing import Optional, List, Any, Union, Dict
from pydantic import BaseModel


# Task schemas
class TaskBase(BaseModel):
    task_id: str
    day: str
    description: str
    type: Optional[str] = None
    xp_reward: int = 10
    badge_reward: Optional[str] = None
    difficulty: Optional[str] = None
    category: Optional[str] = None
    is_boss_task: Optional[bool] = False

    class Config:
        from_attributes = True



class TaskResponse(TaskBase):
    id: int
    week_id: int
    completed: bool = False
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Week schemas
class WeekBase(BaseModel):
    week_number: int
    title: str
    focus: Optional[str] = None
    milestone: Optional[str] = None
    checkin_prompt: Optional[str] = None


class WeekResponse(WeekBase):
    id: int
    tasks: List[TaskResponse] = []
    tasks_completed: int = 0
    tasks_total: int = 0

    class Config:
        from_attributes = True


class WeekSummary(WeekBase):
    id: int
    tasks_completed: int = 0
    tasks_total: int = 0

    class Config:
        from_attributes = True


# Reflection schemas
class ReflectionCreate(BaseModel):
    week_id: int
    content: str


class ReflectionResponse(BaseModel):
    id: int
    week_id: int
    week_number: int
    week_title: str
    content: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Badge schemas
class BadgeResponse(BaseModel):
    id: int
    badge_id: str
    name: str
    description: Optional[str] = None
    xp_value: int
    difficulty: Optional[str] = None
    unlocked: bool = False
    earned_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class AchievementResponse(BaseModel):
    id: int
    achievement_id: str
    name: str
    description: Optional[str] = None
    xp_value: int
    difficulty: Optional[str] = None
    unlocked: bool = False
    earned_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Progress schemas
class ProgressResponse(BaseModel):
    total_xp: int
    level: int
    streak: int
    current_week: int
    tasks_completed: int
    tasks_total: int
    completion_percentage: float
    badges_earned: int
    badges_total: int
    achievements_earned: int = 0
    achievements_total: int = 0
    xp_to_next_level: int = 100
    level_progress: float = 0.0

    class Config:
        from_attributes = True



# RPG schemas
class RPGQuestState(BaseModel):
    id: int
    name: str
    boss_hp: int
    boss_hp_remaining: int
    reward_badge_id: Optional[str] = None

    class Config:
        from_attributes = True



class RPGChallengeState(BaseModel):
    id: int
    name: str
    progress: int
    goal: int
    ends_at: Optional[datetime]

    class Config:
        from_attributes = True



class RPGState(BaseModel):
    xp: int
    level: int
    next_level_xp: int
    gold: int
    streak: int
    focus_points: int
    focus_cap: int
    hearts: int
    streak_freeze_count: int
    active_quest: Optional[RPGQuestState] = None
    active_challenges: List[RPGChallengeState] = []

    class Config:
        from_attributes = True



class TaskCompletionResult(TaskResponse):
    xp_gained: int = 0
    gold_gained: int = 0
    xp_bonus: int = 0
    gold_bonus: int = 0
    level_up: bool = False
    new_level: int = 1
    streak: int = 0
    focus_points: int = 0
    boss_damage: int = 0
    boss_hp_remaining: Optional[int] = None
    challenge_updates: List[dict] = []
    badges_unlocked: List[str] = []
    achievements_unlocked: List[str] = []


# User schemas
class UserResponse(BaseModel):
    id: int
    username: str
    xp: int
    level: int
    streak: int
    current_week: int

    class Config:
        from_attributes = True


# Quiz schemas
class QuestionResponse(BaseModel):
    id: int
    quiz_id: str
    question_type: str = "mcq"  # mcq, coding, code-correction
    text: str
    code: Optional[str] = None  # For code-correction questions
    options: List[str] = []  # For MCQ/code-correction
    correct_index: Optional[int] = None # For immediate feedback
    starter_code: Optional[str] = None  # For coding questions
    test_cases: Optional[Union[List[Dict[str, Any]], str]] = None  # List for structured, str for assertions
    explanation: Optional[str] = None  # Shown after submission
    difficulty: Optional[str] = None
    topic_tag: Optional[str] = None

    class Config:
        from_attributes = True

class QuizSubmission(BaseModel):
    quiz_id: str
    answers: dict[str, Any]  # question_id -> answer (int for MCQ, dict for coding)


class QuestionPublicResponse(BaseModel):
    """Question data without answers - safe to expose publicly."""
    id: int
    quiz_id: str
    question_type: str = "mcq"  # mcq, coding, code-correction
    text: str
    code: Optional[str] = None  # For code-correction questions
    options: List[str] = []  # For MCQ/code-correction
    starter_code: Optional[str] = None  # For coding questions
    test_cases: Optional[Union[List[Dict[str, Any]], str]] = None  # Required for client-side test runner
    difficulty: Optional[str] = None
    topic_tag: Optional[str] = None

    class Config:
        from_attributes = True


class AnswerSubmission(BaseModel):
    """Single answer submission for verification."""
    question_id: int
    answer: Any  # int for MCQ, dict for coding


class AnswerVerifyResponse(BaseModel):
    """Response after verifying an answer."""
    question_id: int
    is_correct: bool
    correct_index: Optional[int] = None  # For MCQ/code-correction
    explanation: Optional[str] = None

