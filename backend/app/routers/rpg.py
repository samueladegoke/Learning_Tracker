from datetime import datetime, date
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from ..database import get_db
from ..models import (
    User,
    Task,
    UserTaskStatus,
    UserQuest,
    Quest,
    UserChallenge,
    Challenge,
)
from ..schemas import RPGState, RPGQuestState, RPGChallengeState

router = APIRouter()

DEFAULT_USER_ID = 1
FOCUS_CAP = 5


def xp_needed_for_level(level: int) -> int:
    """Soft exponential XP curve."""
    return int(100 * (level ** 1.2))


def level_from_xp(xp: int) -> int:
    level = 1
    remaining = xp
    while remaining >= xp_needed_for_level(level):
        remaining -= xp_needed_for_level(level)
        level += 1
    return level


def next_level_requirement(xp: int) -> int:
    level = level_from_xp(xp)
    return xp_needed_for_level(level)


def refresh_focus_points(user: User) -> None:
    """Refresh focus points once per day."""
    today = date.today()
    if not user.focus_refreshed_at or user.focus_refreshed_at.date() < today:
        user.focus_points = FOCUS_CAP
        user.focus_refreshed_at = datetime.utcnow()


def update_streak(user: User) -> None:
    """Update streak based on last_checkin_at."""
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


def get_active_quest(db: Session) -> UserQuest | None:
    return (
        db.query(UserQuest)
        .options(joinedload(UserQuest.quest))
        .filter(UserQuest.user_id == DEFAULT_USER_ID, UserQuest.completed_at.is_(None))
        .first()
    )


def get_active_challenges(db: Session):
    return (
        db.query(UserChallenge)
        .options(joinedload(UserChallenge.challenge))
        .filter(UserChallenge.user_id == DEFAULT_USER_ID)
        .all()
    )


@router.get("/state", response_model=RPGState)
def get_rpg_state(db: Session = Depends(get_db)):
    """Return consolidated RPG state for the current user."""
    user = db.query(User).filter(User.id == DEFAULT_USER_ID).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    refresh_focus_points(user)
    db.commit()

    active_quest = get_active_quest(db)
    quest_payload = None
    if active_quest and active_quest.quest:
        quest_payload = RPGQuestState(
            id=active_quest.quest.id,
            name=active_quest.quest.name,
            boss_hp=active_quest.quest.boss_hp,
            boss_hp_remaining=active_quest.boss_hp_remaining or active_quest.quest.boss_hp,
            reward_badge_id=active_quest.quest.reward_badge_id,
        )

    challenges_payload = []
    for uc in get_active_challenges(db):
        if not uc.challenge:
            continue
        if uc.completed_at:
            continue
        challenges_payload.append(
            RPGChallengeState(
                id=uc.challenge.id,
                name=uc.challenge.name,
                progress=uc.progress,
                goal=uc.challenge.goal_count,
                ends_at=uc.challenge.ends_at,
            )
        )

    return {
        "xp": user.xp,
        "level": level_from_xp(user.xp),
        "next_level_xp": next_level_requirement(user.xp),
        "gold": user.gold,
        "streak": user.streak,
        "focus_points": user.focus_points,
        "focus_cap": FOCUS_CAP,
        "active_quest": quest_payload,
        "active_challenges": challenges_payload,
    }
