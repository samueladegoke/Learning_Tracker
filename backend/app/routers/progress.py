from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User, Task, UserTaskStatus, Badge, UserBadge, Achievement, UserAchievement
from ..schemas import ProgressResponse

router = APIRouter()

DEFAULT_USER_ID = 1


def level_from_xp(xp: int) -> int:
    level = 1
    remaining = xp
    while remaining >= int(100 * (level ** 1.2)):
        remaining -= int(100 * (level ** 1.2))
        level += 1
    return level


@router.get("", response_model=ProgressResponse)
def get_progress(db: Session = Depends(get_db)):
    """Get overall progress statistics for the default user."""
    user = db.query(User).filter(User.id == DEFAULT_USER_ID).first()
    
    if not user:
        return {
            "total_xp": 0,
            "level": 1,
            "streak": 0,
            "current_week": 1,
            "tasks_completed": 0,
            "tasks_total": 0,
            "completion_percentage": 0.0,
            "badges_earned": 0,
            "badges_total": 0
        }
    
    # Count tasks
    tasks_total = db.query(Task).count()
    tasks_completed = db.query(UserTaskStatus).filter(
        UserTaskStatus.user_id == DEFAULT_USER_ID,
        UserTaskStatus.completed == True
    ).count()
    
    # Calculate completion percentage
    completion_percentage = (tasks_completed / tasks_total * 100) if tasks_total > 0 else 0.0
    
    # Count badges
    badges_total = db.query(Badge).count()
    badges_earned = db.query(UserBadge).filter(
        UserBadge.user_id == DEFAULT_USER_ID
    ).count()
    achievements_total = db.query(Achievement).count()
    achievements_earned = db.query(UserAchievement).filter(
        UserAchievement.user_id == DEFAULT_USER_ID
    ).count()
    
    return {
        "total_xp": user.xp,
        "level": level_from_xp(user.xp),
        "streak": user.streak,
        "current_week": user.current_week,
        "tasks_completed": tasks_completed,
        "tasks_total": tasks_total,
        "completion_percentage": round(completion_percentage, 1),
        "badges_earned": badges_earned,
        "badges_total": badges_total,
        "achievements_earned": achievements_earned,
        "achievements_total": achievements_total,
    }

