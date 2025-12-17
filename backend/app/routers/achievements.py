from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Achievement, UserAchievement, User
from ..schemas import AchievementResponse
from ..auth import get_current_user

router = APIRouter()


@router.get("", response_model=List[AchievementResponse])
def get_all_achievements(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get all achievements with unlock status for the authenticated user."""
    achievements = db.query(Achievement).all()
    result = []
    for ach in achievements:
        unlocked = (
            db.query(UserAchievement)
            .filter(UserAchievement.user_id == user.id, UserAchievement.achievement_id == ach.id)
            .first()
        )
        result.append({
            "id": ach.id,
            "achievement_id": ach.achievement_id,
            "name": ach.name,
            "description": ach.description,
            "xp_value": ach.xp_value,
            "difficulty": ach.difficulty,
            "unlocked": unlocked is not None,
            "earned_at": unlocked.earned_at if unlocked else None,
        })
    return result

