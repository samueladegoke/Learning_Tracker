from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, timedelta

from ..database import get_db
from ..models import User, Task, UserTaskStatus, Badge, UserBadge, Achievement, UserAchievement
from ..schemas import ProgressResponse

router = APIRouter()

DEFAULT_USER_ID = 1


from ..utils.gamification import level_from_xp


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


@router.get("/calendar")
def get_calendar_data(db: Session = Depends(get_db)):
    """Get task completion dates for calendar visualization."""
    try:
        # Get all completed tasks with their completion dates
        # Limit to last 2 years for performance
        two_years_ago = date.today() - timedelta(days=730)
        
        completed_tasks = db.query(
            func.date(UserTaskStatus.completed_at).label('completion_date'),
            func.count(UserTaskStatus.id).label('task_count')
        ).filter(
            UserTaskStatus.user_id == DEFAULT_USER_ID,
            UserTaskStatus.completed == True,
            UserTaskStatus.completed_at.isnot(None),
            func.date(UserTaskStatus.completed_at) >= two_years_ago
        ).group_by(
            func.date(UserTaskStatus.completed_at)
        ).all()
        
        # Convert to dictionary: date_string -> task_count
        calendar_data = {}
        for row in completed_tasks:
            try:
                if isinstance(row.completion_date, date):
                    date_str = row.completion_date.isoformat()
                else:
                    date_str = str(row.completion_date)
                calendar_data[date_str] = row.task_count
            except (ValueError, AttributeError) as e:
                # Skip invalid dates
                continue
        
        # Get user's last checkin date to determine missed days
        user = db.query(User).filter(User.id == DEFAULT_USER_ID).first()
        if not user:
            return {
                "completion_dates": {},
                "streak_days": [],
                "last_checkin": None,
                "current_streak": 0,
            }
        
        last_checkin = user.last_checkin_at.date() if user.last_checkin_at else None
        
        # Calculate streak days: find most recent completion and go backwards
        streak_days = []
        MAX_STREAK_DAYS = 365
        
        if calendar_data:
            # Find the most recent date with tasks completed
            sorted_dates = sorted([d for d in calendar_data.keys()], reverse=True)
            if sorted_dates:
                try:
                    most_recent = date.fromisoformat(sorted_dates[0])
                    current_date = most_recent
                    days_checked = 0
                    
                    # Go backwards finding consecutive days with tasks
                    while (days_checked < MAX_STREAK_DAYS and 
                           len(streak_days) < MAX_STREAK_DAYS and
                           current_date >= (most_recent - timedelta(days=MAX_STREAK_DAYS))):
                        date_str = current_date.isoformat()
                        if date_str in calendar_data:
                            streak_days.insert(0, date_str)
                            current_date -= timedelta(days=1)
                            days_checked += 1
                        else:
                            # Gap found, streak ends
                            break
                except ValueError as e:
                    # Invalid date format, skip streak calculation
                    pass
        
        return {
            "completion_dates": calendar_data,
            "streak_days": streak_days,
            "last_checkin": last_checkin.isoformat() if last_checkin else None,
            "current_streak": user.streak if user else 0,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching calendar data: {str(e)}")

