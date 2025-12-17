from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, timedelta

from ..database import get_db
from ..models import User, Task, UserTaskStatus, Badge, UserBadge, Achievement, UserAchievement
from ..schemas import ProgressResponse
from ..auth import get_current_user
from ..utils.gamification import level_from_xp, xp_for_next_level


router = APIRouter()




@router.get("", response_model=ProgressResponse)
def get_progress(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get overall progress statistics for the authenticated user."""
    # Count tasks
    tasks_total = db.query(Task).count()
    tasks_completed = db.query(UserTaskStatus).filter(
        UserTaskStatus.user_id == user.id,
        UserTaskStatus.completed
    ).count()

    # Calculate completion percentage
    completion_percentage = (tasks_completed / tasks_total * 100) if tasks_total > 0 else 0.0

    # Count badges
    badges_total = db.query(Badge).count()
    badges_earned = db.query(UserBadge).filter(
        UserBadge.user_id == user.id
    ).count()
    achievements_total = db.query(Achievement).count()
    achievements_earned = db.query(UserAchievement).filter(
        UserAchievement.user_id == user.id
    ).count()


    current_level = level_from_xp(user.xp)
    xp_required = xp_for_next_level(current_level)

    # Calculate XP at the start of current level (to normalize progress bar)
    def cumulative_xp_to_level(lvl):
        if lvl <= 1:
            return 0
        total = 0
        for i in range(1, lvl):
            total += xp_for_next_level(i)
        return total

    xp_start_of_level = cumulative_xp_to_level(current_level)
    xp_into_level = max(0, user.xp - xp_start_of_level)
    xp_needed_for_level = xp_required # This is XP needed to complete *this* level

    progress_percent = (
        min(100.0, (xp_into_level / xp_needed_for_level * 100))
        if xp_needed_for_level > 0 else 0.0
    )

    xp_remaining = max(0, xp_needed_for_level - xp_into_level)

    return {
        "total_xp": user.xp,
        "level": current_level,
        "streak": user.streak,
        "current_week": user.current_week,
        "tasks_completed": tasks_completed,
        "tasks_total": tasks_total,
        "completion_percentage": round(completion_percentage, 1),
        "badges_earned": badges_earned,
        "badges_total": badges_total,
        "achievements_earned": achievements_earned,
        "achievements_total": achievements_total,
        "xp_to_next_level": int(xp_remaining),
        "level_progress": round(progress_percent, 1),
    }


@router.get("/calendar")
def get_calendar_data(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get task completion dates for calendar visualization."""
    try:
        # Get all completed tasks with their completion dates
        # Limit to last 2 years for performance
        two_years_ago = date.today() - timedelta(days=730)

        completed_tasks = db.query(
            func.date(UserTaskStatus.completed_at).label('completion_date'),
            func.count(UserTaskStatus.id).label('task_count')
        ).filter(
            UserTaskStatus.user_id == user.id,
            UserTaskStatus.completed,
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
            except (ValueError, AttributeError):
                # Skip invalid dates
                continue

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
                except ValueError:
                    # Invalid date format, skip streak calculation
                    pass

        return {
            "completion_dates": calendar_data,
            "streak_days": streak_days,
            "last_checkin": last_checkin.isoformat() if last_checkin else None,
            "current_streak": user.streak,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching calendar data: {str(e)}")
