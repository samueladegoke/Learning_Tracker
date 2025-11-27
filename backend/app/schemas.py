from datetime import datetime
from typing import Optional, List
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


# RPG schemas
class RPGQuestState(BaseModel):
    id: int
    name: str
    boss_hp: int
    boss_hp_remaining: int
    reward_badge_id: Optional[str] = None


class RPGChallengeState(BaseModel):
    id: int
    name: str
    progress: int
    goal: int
    ends_at: Optional[datetime]


class RPGState(BaseModel):
    xp: int
    level: int
    next_level_xp: int
    gold: int
    streak: int
    focus_points: int
    focus_cap: int
    active_quest: Optional[RPGQuestState] = None
    active_challenges: List[RPGChallengeState] = []


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

