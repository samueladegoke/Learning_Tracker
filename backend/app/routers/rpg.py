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


def check_penalty(user: User) -> None:
    """Check if user missed a day and deduct hearts. Uses streak freeze if available."""
    today = date.today()
    
    # If never checked in, no penalty yet (grace period)
    if not user.last_checkin_at:
        return

    last_checkin_date = user.last_checkin_at.date()
    days_since_checkin = (today - last_checkin_date).days

    # If missed more than 1 day (yesterday), apply penalty
    if days_since_checkin > 1:
        # Only penalize once per inactive period:
        # If last_heart_loss occurred AFTER last_checkin_at, we already penalized for this absence
        if user.last_heart_loss and user.last_heart_loss >= user.last_checkin_at:
            return

        # Check if user has a streak freeze to consume
        if user.streak_freeze_count > 0:
            user.streak_freeze_count -= 1
            # Streak freeze protects the streak but we still mark the penalty time
            # to prevent multiple freeze consumptions in the same inactive period
            user.last_heart_loss = datetime.utcnow()
            return

        # No streak freeze available - apply full penalty
        if user.hearts > 0:
            user.hearts -= 1
            user.last_heart_loss = datetime.utcnow()
            # Reset streak on penalty
            user.streak = 0


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
    check_penalty(user)
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
        "hearts": user.hearts,
        "streak_freeze_count": user.streak_freeze_count,
    }


@router.post("/buy/{item_id}")
def buy_item(item_id: str, db: Session = Depends(get_db)):
    """Buy an item from the shop."""
    user = db.query(User).filter(User.id == DEFAULT_USER_ID).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if item_id == "streak_freeze":
        cost = 50
        if user.gold < cost:
            raise HTTPException(status_code=400, detail="Not enough gold")
        user.gold -= cost
        user.streak_freeze_count += 1
    
    elif item_id == "potion_focus":
        cost = 20
        if user.gold < cost:
            raise HTTPException(status_code=400, detail="Not enough gold")
        user.gold -= cost
        user.focus_points = FOCUS_CAP
        user.focus_refreshed_at = datetime.utcnow()
        
    elif item_id == "heart_refill":
        cost = 100
        if user.gold < cost:
            raise HTTPException(status_code=400, detail="Not enough gold")
        if user.hearts >= 3:
             raise HTTPException(status_code=400, detail="Hearts already full")
        user.gold -= cost
        user.hearts += 1
        
    else:
        raise HTTPException(status_code=404, detail="Item not found")

    db.commit()
    return {"message": f"Bought {item_id}", "gold": user.gold}
