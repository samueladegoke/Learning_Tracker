import json
from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from ..database import get_db
from ..models import QuizResult, User, Question
from ..schemas import QuizSubmission, QuestionResponse

router = APIRouter()

DEFAULT_USER_ID = 1

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
    
    db.commit()
    
    return {
        "message": "Quiz submitted", 
        "xp_gained": xp_gained,
        "score": score,
        "total_questions": total_questions
    }
