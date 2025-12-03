from datetime import datetime, date
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from ..database import get_db
from ..models import (
    Task,
    UserTaskStatus,
    User,
    UserQuest,
    UserChallenge,
    Challenge,
    Badge,
    UserBadge,
    Week,
    Achievement,
    UserAchievement,
)
from ..schemas import TaskResponse, TaskCompletionResult

router = APIRouter()

DEFAULT_USER_ID = 1
FOCUS_CAP = 5
DIFFICULTY_MULTIPLIER = {
    "trivial": 0.5,
    "normal": 1.0,
    "hard": 1.5,
    "boss": 2.0,
}
STREAK_BADGES = {
    3: "b-streak-3",
    7: "b-streak-7",
    14: "b-streak-14",
    30: "b-streak-30",
}
REWARD_MULTIPLIER = {
    "trivial": 1.0,
    "normal": 1.0,
    "hard": 1.5,
    "epic": 2.0,
}


from ..utils.gamification import level_from_xp, xp_for_next_level as xp_needed_for_level


def refresh_focus_points(user: User) -> None:
    today = date.today()
    if not user.focus_refreshed_at or user.focus_refreshed_at.date() < today:
        user.focus_points = FOCUS_CAP
        user.focus_refreshed_at = datetime.utcnow()


def update_streak(user: User) -> None:
    today = date.today()
    if user.last_checkin_at:
        last = user.last_checkin_at.date()
        if last == today:
            return
        if (today - last).days == 1:
            user.streak += 1
        else:
            user.streak = 1
    else:
        user.streak = 1

    user.best_streak = max(user.best_streak, user.streak)
    user.last_checkin_at = datetime.utcnow()


def active_user_quest(db: Session) -> UserQuest | None:
    return (
        db.query(UserQuest)
        .options(joinedload(UserQuest.quest))
        .filter(UserQuest.user_id == DEFAULT_USER_ID, UserQuest.completed_at.is_(None))
        .first()
    )


def apply_quest_damage(db: Session, user_quest: UserQuest, damage: int) -> tuple[int, bool]:
    """Apply damage to the active quest boss; return remaining HP and completion flag."""
    if not user_quest or not user_quest.quest:
        return 0, False
    if user_quest.boss_hp_remaining is None:
        user_quest.boss_hp_remaining = user_quest.quest.boss_hp

    new_hp = max(0, user_quest.boss_hp_remaining - damage)
    user_quest.boss_hp_remaining = new_hp
    boss_defeated = new_hp == 0
    if boss_defeated and not user_quest.completed_at:
        user_quest.completed_at = datetime.utcnow()
    db.add(user_quest)
    return new_hp, boss_defeated


def apply_challenge_progress(db: Session) -> list[dict]:
    """Increment progress for all active challenges; return progress snapshots."""
    updates = []
    active = (
        db.query(UserChallenge)
        .options(joinedload(UserChallenge.challenge))
        .filter(UserChallenge.user_id == DEFAULT_USER_ID)
        .all()
    )
    for uc in active:
        if uc.completed_at or not uc.challenge:
            continue
        uc.progress = min(uc.challenge.goal_count, uc.progress + 1)
        if uc.progress >= uc.challenge.goal_count:
            uc.completed_at = datetime.utcnow()
        updates.append(
            {
                "challenge_id": uc.challenge.id,
                "progress": uc.progress,
                "goal": uc.challenge.goal_count,
            }
        )
        db.add(uc)
    return updates


def award_badge(db: Session, user_id: int, badge_id: str) -> tuple[bool, int, int]:
    """Ensure a user earns a badge by badge_id. Returns (awarded, xp_bonus, gold_bonus)."""
    badge = db.query(Badge).filter(Badge.badge_id == badge_id).first()
    if not badge:
        return False, 0, 0
    existing = (
        db.query(UserBadge)
        .filter(UserBadge.user_id == user_id, UserBadge.badge_id == badge.id)
        .first()
    )
    if existing:
        return False, 0, 0
    db.add(UserBadge(user_id=user_id, badge_id=badge.id))
    multiplier = REWARD_MULTIPLIER.get(badge.difficulty or "normal", 1.0)
    xp_bonus = int(badge.xp_value * multiplier)
    gold_bonus = xp_bonus // 10
    return True, xp_bonus, gold_bonus


def award_achievement(db: Session, user_id: int, achievement_ref: str) -> tuple[bool, int, int]:
    """Ensure a user earns an achievement by achievement_id. Returns (awarded, xp_bonus, gold_bonus)."""
    achievement = db.query(Achievement).filter(Achievement.achievement_id == achievement_ref).first()
    if not achievement:
        return False, 0, 0
    existing = (
        db.query(UserAchievement)
        .filter(UserAchievement.user_id == user_id, UserAchievement.achievement_id == achievement.id)
        .first()
    )
    if existing:
        return False, 0, 0
    db.add(UserAchievement(user_id=user_id, achievement_id=achievement.id))
    multiplier = REWARD_MULTIPLIER.get(achievement.difficulty or "normal", 1.0)
    xp_bonus = int(achievement.xp_value * multiplier)
    gold_bonus = xp_bonus // 10
    return True, xp_bonus, gold_bonus


def check_week_completion(db: Session, week_id: int, user_id: int) -> bool:
    tasks_total = db.query(Task).filter(Task.week_id == week_id).count()
    tasks_completed = (
        db.query(UserTaskStatus)
        .join(Task)
        .filter(
            Task.week_id == week_id,
            UserTaskStatus.user_id == user_id,
            UserTaskStatus.completed == True,
        )
        .count()
    )
    return tasks_total > 0 and tasks_completed == tasks_total


def check_all_weeks_completed(db: Session, user_id: int) -> bool:
    tasks_total = db.query(Task).count()
    tasks_completed = (
        db.query(UserTaskStatus)
        .filter(UserTaskStatus.user_id == user_id, UserTaskStatus.completed == True)
        .count()
    )
    return tasks_total > 0 and tasks_completed == tasks_total


def total_tasks_completed(db: Session, user_id: int) -> int:
    return (
        db.query(UserTaskStatus)
        .filter(UserTaskStatus.user_id == user_id, UserTaskStatus.completed == True)
        .count()
    )


@router.post("/{task_id}/complete", response_model=TaskCompletionResult)
def complete_task(task_id: str, db: Session = Depends(get_db)):
    """Mark a task as completed. Adds XP to user."""
    # Find task by task_id string (e.g., "w1-d1")
    task = db.query(Task).filter(Task.task_id == task_id).first()
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    user = db.query(User).filter(User.id == DEFAULT_USER_ID).first()
    # Get or create UserTaskStatus
    status = db.query(UserTaskStatus).filter(
        UserTaskStatus.task_id == task.id,
        UserTaskStatus.user_id == DEFAULT_USER_ID
    ).first()
    
    if status and status.completed:
        # Already completed, just return current state with zero deltas
        new_level = level_from_xp(user.xp) if user else 1
        streak = user.streak if user else 0
        focus_points = user.focus_points if user else 0
        return TaskCompletionResult(
            id=task.id,
            task_id=task.task_id,
            week_id=task.week_id,
            day=task.day,
            description=task.description,
            type=task.type,
            xp_reward=task.xp_reward,
            badge_reward=task.badge_reward,
            difficulty=task.difficulty,
            category=task.category,
            is_boss_task=task.is_boss_task,
            completed=True,
            completed_at=status.completed_at,
            xp_gained=0,
            gold_gained=0,
            level_up=False,
            new_level=new_level,
            streak=streak,
            focus_points=focus_points,
        )
    
    if not status:
        status = UserTaskStatus(
            user_id=DEFAULT_USER_ID,
            task_id=task.id,
            completed=False
        )
        db.add(status)
    
    # Mark as completed
    status.completed = True
    status.completed_at = datetime.utcnow()
    
    # Add XP/gold to user with RPG deltas
    user = db.query(User).filter(User.id == DEFAULT_USER_ID).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    refresh_focus_points(user)
    update_streak(user)

    difficulty_multiplier = DIFFICULTY_MULTIPLIER.get(task.difficulty or "normal", 1.0)
    xp_gained = int(task.xp_reward * difficulty_multiplier)
    gold_gained = xp_gained // 10
    xp_bonus_total = 0
    gold_bonus_total = 0
    badges_unlocked = []
    achievements_unlocked = []

    level_before = level_from_xp(user.xp)
    user.xp += xp_gained
    user.gold += gold_gained
    user.level = level_from_xp(user.xp)
    level_up = user.level > level_before

    # Focus points nudge: regain 1 up to cap on completion
    user.focus_points = min(FOCUS_CAP, (user.focus_points or 0) + 1)

    # Apply quest damage if an active quest exists
    quest = active_user_quest(db)
    boss_damage = xp_gained
    boss_hp_remaining = None
    boss_defeated = False
    if quest:
        boss_hp_remaining, boss_defeated = apply_quest_damage(db, quest, boss_damage)
    if boss_defeated and quest.quest and quest.quest.reward_xp_bonus:
        user.xp += quest.quest.reward_xp_bonus
        user.level = level_from_xp(user.xp)
        level_up = user.level > level_before

    # Advance challenges
    challenge_updates = apply_challenge_progress(db)

    # Award badges: streak thresholds
    if user.streak in STREAK_BADGES:
        awarded, bonus_xp, bonus_gold = award_badge(db, DEFAULT_USER_ID, STREAK_BADGES[user.streak])
        if awarded:
            xp_bonus_total += bonus_xp
            gold_bonus_total += bonus_gold
            badges_unlocked.append(STREAK_BADGES[user.streak])

    # Award week completion badge
    if check_week_completion(db, task.week_id, DEFAULT_USER_ID):
        week = db.query(Week).filter(Week.id == task.week_id).first()
        if week:
            badge_code = f"b-week-{week.week_number}"
            awarded, bonus_xp, bonus_gold = award_badge(db, DEFAULT_USER_ID, badge_code)
            if awarded:
                xp_bonus_total += bonus_xp
                gold_bonus_total += bonus_gold
                badges_unlocked.append(badge_code)

    # Award bootcamp finisher
    if check_all_weeks_completed(db, DEFAULT_USER_ID):
        awarded, bonus_xp, bonus_gold = award_badge(db, DEFAULT_USER_ID, "b-bootcamp-finish")
        if awarded:
            xp_bonus_total += bonus_xp
            gold_bonus_total += bonus_gold
            badges_unlocked.append("b-bootcamp-finish")
        awarded_ach, ach_xp, ach_gold = award_achievement(db, DEFAULT_USER_ID, "a-all-weeks")
        if awarded_ach:
            xp_bonus_total += ach_xp
            gold_bonus_total += ach_gold
            achievements_unlocked.append("a-all-weeks")

    # Task count achievements
    tasks_done = total_tasks_completed(db, DEFAULT_USER_ID)
    if tasks_done >= 1:
        awarded, ach_xp, ach_gold = award_achievement(db, DEFAULT_USER_ID, "a-first-task")
        if awarded:
            xp_bonus_total += ach_xp
            gold_bonus_total += ach_gold
            achievements_unlocked.append("a-first-task")
    if tasks_done >= 10:
        awarded, ach_xp, ach_gold = award_achievement(db, DEFAULT_USER_ID, "a-ten-tasks")
        if awarded:
            xp_bonus_total += ach_xp
            gold_bonus_total += ach_gold
            achievements_unlocked.append("a-ten-tasks")
    if tasks_done >= 50:
        awarded, ach_xp, ach_gold = award_achievement(db, DEFAULT_USER_ID, "a-fifty-tasks")
        if awarded:
            xp_bonus_total += ach_xp
            gold_bonus_total += ach_gold
            achievements_unlocked.append("a-fifty-tasks")
    if tasks_done >= 100:
        awarded, ach_xp, ach_gold = award_achievement(db, DEFAULT_USER_ID, "a-hundred-tasks")
        if awarded:
            xp_bonus_total += ach_xp
            gold_bonus_total += ach_gold
            achievements_unlocked.append("a-hundred-tasks")

    # Award quest badge and assign next quest
    if boss_defeated and quest and quest.quest and quest.quest.reward_badge_id:
        awarded, bonus_xp, bonus_gold = award_badge(db, DEFAULT_USER_ID, quest.quest.reward_badge_id)
        if awarded:
            xp_bonus_total += bonus_xp
            gold_bonus_total += bonus_gold
            badges_unlocked.append(quest.quest.reward_badge_id)
        awarded_ach, ach_xp, ach_gold = award_achievement(db, DEFAULT_USER_ID, "a-boss-first")
        if awarded_ach:
            xp_bonus_total += ach_xp
            gold_bonus_total += ach_gold
            achievements_unlocked.append("a-boss-first")
        
        # Auto-assign next quest
        from ..utils.quest_manager import assign_next_quest
        assign_next_quest(db, DEFAULT_USER_ID)

    # Award challenge badges
    for update in challenge_updates:
        if update.get("progress") == update.get("goal"):
            uc = (
                db.query(UserChallenge)
                .options(joinedload(UserChallenge.challenge))
                .filter(UserChallenge.user_id == DEFAULT_USER_ID, UserChallenge.challenge_id == update["challenge_id"])
                .first()
            )
            if uc and uc.challenge and uc.challenge.reward_badge_id:
                awarded, bonus_xp, bonus_gold = award_badge(db, DEFAULT_USER_ID, uc.challenge.reward_badge_id)
                if awarded:
                    xp_bonus_total += bonus_xp
                    gold_bonus_total += bonus_gold
                    badges_unlocked.append(uc.challenge.reward_badge_id)

    # Apply reward bonuses to user
    user.xp += xp_bonus_total
    user.gold += gold_bonus_total
    user.level = level_from_xp(user.xp)
    level_up = user.level > level_before or level_up

    db.commit()
    db.refresh(status)
    db.refresh(user)

    return TaskCompletionResult(
        id=task.id,
        task_id=task.task_id,
        week_id=task.week_id,
        day=task.day,
        description=task.description,
        type=task.type,
        xp_reward=task.xp_reward,
        badge_reward=task.badge_reward,
        difficulty=task.difficulty,
        category=task.category,
        is_boss_task=task.is_boss_task,
        completed=status.completed,
        completed_at=status.completed_at,
        xp_gained=xp_gained,
        gold_gained=gold_gained,
        xp_bonus=xp_bonus_total,
        gold_bonus=gold_bonus_total,
        level_up=level_up,
        new_level=user.level,
        streak=user.streak,
        focus_points=user.focus_points,
        boss_damage=boss_damage if quest else 0,
        boss_hp_remaining=boss_hp_remaining,
        challenge_updates=challenge_updates,
        badges_unlocked=badges_unlocked,
        achievements_unlocked=achievements_unlocked,
    )


@router.post("/{task_id}/uncomplete", response_model=TaskCompletionResult)
def uncomplete_task(task_id: str, db: Session = Depends(get_db)):
    """Unmark a task as completed. Removes XP from user."""
    # Find task by task_id string
    task = db.query(Task).filter(Task.task_id == task_id).first()
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Get UserTaskStatus
    status = db.query(UserTaskStatus).filter(
        UserTaskStatus.task_id == task.id,
        UserTaskStatus.user_id == DEFAULT_USER_ID
    ).first()
    
    xp_gained = 0
    gold_gained = 0
    level_up = False
    user = db.query(User).filter(User.id == DEFAULT_USER_ID).first()

    if status and status.completed:
        # Remove XP from user
        if user:
            difficulty_multiplier = DIFFICULTY_MULTIPLIER.get(task.difficulty or "normal", 1.0)
            xp_delta = int(task.xp_reward * difficulty_multiplier)
            gold_delta = xp_delta // 10
            user.xp = max(0, user.xp - xp_delta)
            user.gold = max(0, user.gold - gold_delta)
            new_level = level_from_xp(user.xp)
            level_up = new_level > user.level
            user.level = new_level
            xp_gained = -xp_delta
            gold_gained = -gold_delta
        
        # Mark as incomplete
        status.completed = False
        status.completed_at = None
        db.commit()
    
    return TaskCompletionResult(
        id=task.id,
        task_id=task.task_id,
        week_id=task.week_id,
        day=task.day,
        description=task.description,
        type=task.type,
        xp_reward=task.xp_reward,
        badge_reward=task.badge_reward,
        difficulty=task.difficulty,
        category=task.category,
        is_boss_task=task.is_boss_task,
        completed=False,
        completed_at=None,
        xp_gained=xp_gained,
        gold_gained=gold_gained,
        level_up=level_up,
        new_level=level_from_xp(user.xp) if user else 1,
        streak=user.streak if user else 0,
        focus_points=user.focus_points if user else 0,
        boss_damage=0,
        boss_hp_remaining=None,
        challenge_updates=[],
    )


@router.get("/{task_id}", response_model=TaskResponse)
def get_task(task_id: str, db: Session = Depends(get_db)):
    """Get a specific task by its task_id."""
    task = db.query(Task).filter(Task.task_id == task_id).first()
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    status = db.query(UserTaskStatus).filter(
        UserTaskStatus.task_id == task.id,
        UserTaskStatus.user_id == DEFAULT_USER_ID
    ).first()
    
    return {
        "id": task.id,
        "task_id": task.task_id,
        "week_id": task.week_id,
        "day": task.day,
        "description": task.description,
        "type": task.type,
        "xp_reward": task.xp_reward,
        "badge_reward": task.badge_reward,
        "difficulty": task.difficulty,
        "category": task.category,
        "is_boss_task": task.is_boss_task,
        "completed": status.completed if status else False,
        "completed_at": status.completed_at if status else None
    }

