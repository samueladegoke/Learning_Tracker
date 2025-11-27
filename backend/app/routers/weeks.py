from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Week, Task, UserTaskStatus, User
from ..schemas import WeekResponse, WeekSummary, TaskResponse

router = APIRouter()

DEFAULT_USER_ID = 1


def get_task_with_status(task: Task, db: Session, user_id: int = DEFAULT_USER_ID) -> dict:
    """Get task data with completion status for a user."""
    status = db.query(UserTaskStatus).filter(
        UserTaskStatus.task_id == task.id,
        UserTaskStatus.user_id == user_id
    ).first()
    
    return {
        "id": task.id,
        "task_id": task.task_id,
        "week_id": task.week_id,
        "day": task.day,
        "description": task.description,
        "type": task.type,
        "xp_reward": task.xp_reward,
        "badge_reward": task.badge_reward,
        "completed": status.completed if status else False,
        "completed_at": status.completed_at if status else None
    }


@router.get("", response_model=List[WeekSummary])
def get_all_weeks(db: Session = Depends(get_db)):
    """Get all weeks with task completion summary."""
    weeks = db.query(Week).order_by(Week.week_number).all()
    result = []
    
    for week in weeks:
        tasks_total = len(week.tasks)
        tasks_completed = db.query(UserTaskStatus).join(Task).filter(
            Task.week_id == week.id,
            UserTaskStatus.user_id == DEFAULT_USER_ID,
            UserTaskStatus.completed == True
        ).count()
        
        result.append({
            "id": week.id,
            "week_number": week.week_number,
            "title": week.title,
            "focus": week.focus,
            "milestone": week.milestone,
            "checkin_prompt": week.checkin_prompt,
            "tasks_completed": tasks_completed,
            "tasks_total": tasks_total
        })
    
    return result


@router.get("/{week_id}", response_model=WeekResponse)
def get_week(week_id: int, db: Session = Depends(get_db)):
    """Get a specific week with all its tasks and completion status."""
    week = db.query(Week).filter(Week.id == week_id).first()
    
    if not week:
        raise HTTPException(status_code=404, detail="Week not found")
    
    tasks_with_status = [get_task_with_status(task, db) for task in week.tasks]
    tasks_completed = sum(1 for t in tasks_with_status if t["completed"])
    
    return {
        "id": week.id,
        "week_number": week.week_number,
        "title": week.title,
        "focus": week.focus,
        "milestone": week.milestone,
        "checkin_prompt": week.checkin_prompt,
        "tasks": tasks_with_status,
        "tasks_completed": tasks_completed,
        "tasks_total": len(week.tasks)
    }


@router.get("/number/{week_number}", response_model=WeekResponse)
def get_week_by_number(week_number: int, db: Session = Depends(get_db)):
    """Get a specific week by its week number."""
    week = db.query(Week).filter(Week.week_number == week_number).first()
    
    if not week:
        raise HTTPException(status_code=404, detail="Week not found")
    
    tasks_with_status = [get_task_with_status(task, db) for task in week.tasks]
    tasks_completed = sum(1 for t in tasks_with_status if t["completed"])
    
    return {
        "id": week.id,
        "week_number": week.week_number,
        "title": week.title,
        "focus": week.focus,
        "milestone": week.milestone,
        "checkin_prompt": week.checkin_prompt,
        "tasks": tasks_with_status,
        "tasks_completed": tasks_completed,
        "tasks_total": len(week.tasks)
    }

