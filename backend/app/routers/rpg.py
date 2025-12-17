from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from ..database import get_db
from ..models import (
    User,
    UserQuest,
    UserChallenge,
)
from ..schemas import RPGState, RPGQuestState, RPGChallengeState
from ..utils.gamification import (
    level_from_xp,
    next_level_requirement,
    refresh_focus_points,
    check_penalty,
    FOCUS_CAP,
)
from ..auth import get_current_user

router = APIRouter()


def get_active_quest(db: Session, user_id: int) -> UserQuest | None:
    return (
        db.query(UserQuest)
        .options(joinedload(UserQuest.quest))
        .filter(UserQuest.user_id == user_id, UserQuest.completed_at.is_(None))
        .first()
    )


def get_active_challenges(db: Session, user_id: int):
    return (
        db.query(UserChallenge)
        .options(joinedload(UserChallenge.challenge))
        .filter(UserChallenge.user_id == user_id)
        .all()
    )


@router.get("/state", response_model=RPGState)
def get_rpg_state(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Return consolidated RPG state for the authenticated user."""
    refresh_focus_points(user)
    check_penalty(user)
    db.commit()

    active_quest = get_active_quest(db, user.id)
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
    for uc in get_active_challenges(db, user.id):
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


@router.post("/award-xp")
def award_xp(amount: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Award XP to the authenticated user (e.g., from quiz completion)."""
    if amount <= 0:
        raise HTTPException(status_code=400, detail="XP amount must be positive")
    if amount > 1000:
        raise HTTPException(status_code=400, detail="XP amount too large (max 1000 per request)")

    old_level = level_from_xp(user.xp)
    user.xp += amount
    new_level = level_from_xp(user.xp)

    db.commit()

    return {
        "xp_awarded": amount,
        "total_xp": user.xp,
        "level": new_level,
        "leveled_up": new_level > old_level
    }


@router.post("/buy/{item_id}")
def buy_item(item_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Buy an item from the shop."""
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
