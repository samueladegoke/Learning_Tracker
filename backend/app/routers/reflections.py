from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Reflection, Week
from ..schemas import ReflectionCreate, ReflectionResponse

router = APIRouter()

DEFAULT_USER_ID = 1


@router.get("", response_model=List[ReflectionResponse])
def get_reflections(db: Session = Depends(get_db)):
    """Get all reflections for the default user."""
    reflections = db.query(Reflection).filter(
        Reflection.user_id == DEFAULT_USER_ID
    ).order_by(Reflection.created_at.desc()).all()
    
    result = []
    for ref in reflections:
        week = db.query(Week).filter(Week.id == ref.week_id).first()
        result.append({
            "id": ref.id,
            "week_id": ref.week_id,
            "week_number": week.week_number if week else 0,
            "week_title": week.title if week else "Unknown",
            "content": ref.content,
            "created_at": ref.created_at,
            "updated_at": ref.updated_at
        })
    
    return result


@router.get("/week/{week_id}", response_model=ReflectionResponse)
def get_reflection_for_week(week_id: int, db: Session = Depends(get_db)):
    """Get reflection for a specific week."""
    reflection = db.query(Reflection).filter(
        Reflection.user_id == DEFAULT_USER_ID,
        Reflection.week_id == week_id
    ).first()
    
    if not reflection:
        raise HTTPException(status_code=404, detail="Reflection not found for this week")
    
    week = db.query(Week).filter(Week.id == week_id).first()
    
    return {
        "id": reflection.id,
        "week_id": reflection.week_id,
        "week_number": week.week_number if week else 0,
        "week_title": week.title if week else "Unknown",
        "content": reflection.content,
        "created_at": reflection.created_at,
        "updated_at": reflection.updated_at
    }


@router.post("", response_model=ReflectionResponse)
def create_or_update_reflection(data: ReflectionCreate, db: Session = Depends(get_db)):
    """Create or update a reflection for a week."""
    # Verify week exists
    week = db.query(Week).filter(Week.id == data.week_id).first()
    if not week:
        raise HTTPException(status_code=404, detail="Week not found")
    
    # Check if reflection already exists for this week
    existing = db.query(Reflection).filter(
        Reflection.user_id == DEFAULT_USER_ID,
        Reflection.week_id == data.week_id
    ).first()
    
    if existing:
        # Update existing reflection
        existing.content = data.content
        db.commit()
        db.refresh(existing)
        reflection = existing
    else:
        # Create new reflection
        reflection = Reflection(
            user_id=DEFAULT_USER_ID,
            week_id=data.week_id,
            content=data.content
        )
        db.add(reflection)
        db.commit()
        db.refresh(reflection)
    
    return {
        "id": reflection.id,
        "week_id": reflection.week_id,
        "week_number": week.week_number,
        "week_title": week.title,
        "content": reflection.content,
        "created_at": reflection.created_at,
        "updated_at": reflection.updated_at
    }

