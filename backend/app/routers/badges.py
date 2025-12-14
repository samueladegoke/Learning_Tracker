from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Badge, UserBadge
from ..schemas import BadgeResponse

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


@router.get("", response_model=List[BadgeResponse])
def get_all_badges(db: Session = Depends(get_db)):
    """Get all badges with unlock status for the default user."""
    badges = db.query(Badge).all()
    
    result = []
    for badge in badges:
        user_badge = db.query(UserBadge).filter(
            UserBadge.badge_id == badge.id,
            UserBadge.user_id == DEFAULT_USER_ID
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

