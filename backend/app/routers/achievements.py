from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Achievement, UserAchievement
from ..schemas import AchievementResponse

router = APIRouter()

# =============================================================================
# SECURITY NOTE: Single-User MVP Mode
# =============================================================================
# This application currently operates in single-user mode without authentication.
# All API endpoints use a hardcoded user ID. This is intentional for the MVP phase.
#
# BEFORE PRODUCTION DEPLOYMENT:
# 1. Implement proper authentication (e.g., Supabase Auth, JWT)
# 2. Replace DEFAULT_USER_ID with authenticated user from request context
# 3. Add authorization checks for user-owned resources
# 4. See docs/architecture.md for auth implementation guidance
# =============================================================================
DEFAULT_USER_ID = 1  # TODO: Replace with authenticated user ID from auth middleware


@router.get("", response_model=List[AchievementResponse])
def get_all_achievements(db: Session = Depends(get_db)):
    """Get all achievements with unlock status for the default user."""
    achievements = db.query(Achievement).all()
    result = []
    for ach in achievements:
        unlocked = (
            db.query(UserAchievement)
            .filter(UserAchievement.user_id == DEFAULT_USER_ID, UserAchievement.achievement_id == ach.id)
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
