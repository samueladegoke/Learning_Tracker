import json
from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel

from ..database import get_db
from ..models import QuizResult, User, Question, Achievement, UserAchievement
from ..schemas import QuizSubmission, QuestionResponse

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


@router.get("/completed")
def get_completed_quizzes(db: Session = Depends(get_db)):
    """Get list of quiz_ids that the user has completed."""
    results = db.query(QuizResult.quiz_id).filter(
        QuizResult.user_id == DEFAULT_USER_ID
    ).distinct().all()
    return [r[0] for r in results]


@router.get("/leaderboard")
def get_quiz_leaderboard(limit: int = 20, db: Session = Depends(get_db)):
    """Get top quiz scores for the leaderboard."""
    results = db.query(QuizResult).order_by(
        QuizResult.score.desc(),
        QuizResult.completed_at.desc()
    ).limit(limit).all()
    
    return [
        {
            "id": r.id,
            "quiz_id": r.quiz_id,
            "score": r.score,
            "total_questions": r.total_questions,
            "percentage": round((r.score / r.total_questions) * 100, 1) if r.total_questions > 0 else 0,
            "completed_at": r.completed_at.isoformat() if r.completed_at else None
        }
        for r in results
    ]


@router.get("/{quiz_id}/questions", response_model=List[QuestionResponse])
def get_quiz_questions(quiz_id: str, db: Session = Depends(get_db)):
    """Get questions for a specific quiz (without correct answers)."""
    questions = db.query(Question).filter(Question.quiz_id == quiz_id).all()
    
    # Parse options JSON string to list
    response = []
    for q in questions:
        try:
            options_list = json.loads(q.options)
        except json.JSONDecodeError:
            options_list = []
            
        response.append(QuestionResponse(
            id=q.id,
            quiz_id=q.quiz_id,
            text=q.text,
            options=options_list,
            explanation=None # Don't reveal explanation yet
        ))
        
    return response


def award_achievement_for_quiz(db: Session, user_id: int, achievement_id: str) -> tuple[bool, int]:
    """Award an achievement if not already earned. Returns (awarded, xp_value)."""
    achievement = db.query(Achievement).filter(Achievement.achievement_id == achievement_id).first()
    if not achievement:
        return False, 0
    
    existing = db.query(UserAchievement).filter(
        UserAchievement.user_id == user_id,
        UserAchievement.achievement_id == achievement.id
    ).first()
    
    if existing:
        return False, 0
    
    db.add(UserAchievement(user_id=user_id, achievement_id=achievement.id))
    return True, achievement.xp_value


@router.post("/submit")
def submit_quiz(submission: QuizSubmission, db: Session = Depends(get_db)):
    """Submit a quiz result and award XP."""
    user = db.query(User).filter(User.id == DEFAULT_USER_ID).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Fetch all questions for this quiz
    questions = db.query(Question).filter(Question.quiz_id == submission.quiz_id).all()
    if not questions:
        raise HTTPException(status_code=404, detail="Quiz not found")
        
    questions_map = {q.id: q for q in questions}
    
    score = 0
    total_questions = len(questions)
    
    # Calculate score server-side
    for q_id, selected_index in submission.answers.items():
        question = questions_map.get(int(q_id))
        if question and question.correct_index == selected_index:
            score += 1

    # Save result
    result = QuizResult(
        user_id=DEFAULT_USER_ID,
        quiz_id=submission.quiz_id,
        score=score,
        total_questions=total_questions
    )
    db.add(result)

    # Award XP (e.g., 10 XP base + score)
    xp_gained = 10 + score
    user.xp += xp_gained
    
    # Check for quiz achievements
    achievements_unlocked = []
    
    # Quiz Master: Perfect score
    if score == total_questions and total_questions > 0:
        awarded, ach_xp = award_achievement_for_quiz(db, DEFAULT_USER_ID, "a-quiz-master")
        if awarded:
            achievements_unlocked.append("a-quiz-master")
            xp_gained += ach_xp
            user.xp += ach_xp
    
    # Quiz count achievements
    quiz_count = db.query(func.count(QuizResult.id)).filter(
        QuizResult.user_id == DEFAULT_USER_ID
    ).scalar()
    
    if quiz_count >= 5:
        awarded, ach_xp = award_achievement_for_quiz(db, DEFAULT_USER_ID, "a-quiz-streak")
        if awarded:
            achievements_unlocked.append("a-quiz-streak")
            xp_gained += ach_xp
            user.xp += ach_xp
    
    db.commit()
    
    return {
        "message": "Quiz submitted", 
        "xp_gained": xp_gained,
        "score": score,
        "total_questions": total_questions,
        "percentage": round((score / total_questions) * 100, 1) if total_questions > 0 else 0,
        "achievements_unlocked": achievements_unlocked
    }
