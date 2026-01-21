from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Badge, UserBadge, User
from ..schemas import BadgeResponse
from ..auth import get_current_user

router = APIRouter()


@router.get("", response_model=List[BadgeResponse])
def get_all_badges(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get all badges with unlock status for the authenticated user."""
    badges = db.query(Badge).all()

    result = []
    for badge in badges:
        user_badge = db.query(UserBadge).filter(
            UserBadge.badge_id == badge.id,
            UserBadge.user_id == user.id
        ).first()

        result.append({
            "id": badge.id,
            "badge_id": badge.badge_id,
            "name": badge.name,
            "description": badge.description,
            "xp_value": badge.xp_value,
            "difficulty": badge.difficulty,
            "unlocked": user_badge is not None,
            "earned_at": user_badge.earned_at if user_badge else None
        })

    return result


