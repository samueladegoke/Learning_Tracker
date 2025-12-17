import json
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from ..database import get_db
from ..models import QuizResult, User, Question, Achievement, UserAchievement
from ..schemas import QuizSubmission, QuestionResponse
from ..auth import get_current_user

router = APIRouter()


@router.get("/completed")
def get_completed_quizzes(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get list of quiz_ids that the user has completed."""
    results = db.query(QuizResult.quiz_id).filter(
        QuizResult.user_id == user.id
    ).distinct().all()
    return [r[0] for r in results]


@router.get("/leaderboard")
def get_quiz_leaderboard(limit: int = 20, offset: int = 0, db: Session = Depends(get_db)):
    """Get top quiz scores for the leaderboard."""
    results = db.query(QuizResult).order_by(
        QuizResult.score.desc(),
        QuizResult.completed_at.desc()
    ).offset(offset).limit(limit).all()

    return [
        {
            "id": r.id,
            "quiz_id": r.quiz_id,
            "score": r.score,
            "total_questions": r.total_questions,
            "score_breakdown": f"{r.score}/{r.total_questions}",
            "percentage": round((r.score / r.total_questions) * 100, 1) if r.total_questions > 0 else 0,
            "completed_at": r.completed_at.isoformat() if r.completed_at else None
        }
        for r in results
    ]


@router.get("/{quiz_id}/questions", response_model=List[QuestionResponse])
def get_quiz_questions(quiz_id: str, db: Session = Depends(get_db)):
    """Get questions for a specific quiz (without correct answers or solution_code)."""
    questions = db.query(Question).filter(Question.quiz_id == quiz_id).all()

    # Parse options/test_cases JSON strings to lists
    response = []
    for q in questions:
        try:
            options_list = json.loads(q.options) if q.options else []
        except (json.JSONDecodeError, TypeError):
            options_list = []

        try:
            test_cases_list = json.loads(q.test_cases) if q.test_cases else None
        except (json.JSONDecodeError, TypeError):
            test_cases_list = None

        response.append(QuestionResponse(
            id=q.id,
            quiz_id=q.quiz_id,
            question_type=q.question_type or "mcq",
            text=q.text,
            code=q.code,  # For code-correction questions
            options=options_list,
            correct_index=q.correct_index,
            starter_code=q.starter_code,
            test_cases=test_cases_list,
            explanation=q.explanation,
            difficulty=q.difficulty,
            topic_tag=q.topic_tag
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
def submit_quiz(submission: QuizSubmission, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Submit a quiz result and award XP."""

    # Fetch all questions for this quiz
    questions = db.query(Question).filter(Question.quiz_id == submission.quiz_id).all()
    if not questions:
        raise HTTPException(status_code=404, detail="Quiz not found")

    questions_map = {q.id: q for q in questions}

    score = 0
    total_questions = len(questions)

    # Calculate score server-side - handle both MCQ and coding questions
    for q_id_str, answer in submission.answers.items():
        try:
            q_id = int(q_id_str)
        except ValueError:
            continue

        question = questions_map.get(q_id)
        if not question:
            continue

        # Trust the model default; column is now guaranteed
        question_type = question.question_type or 'mcq'

        if question_type in ('mcq', 'code-correction'):
            # MCQ/Code-correction: answer is the selected index (int)
            if isinstance(answer, int) and question.correct_index == answer:
                score += 1
        elif question_type == 'coding':
            # Coding: answer is dict with allPassed flag
            if isinstance(answer, dict) and answer.get('allPassed', False):
                score += 1

    # Save result
    result = QuizResult(
        user_id=user.id,
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
        awarded, ach_xp = award_achievement_for_quiz(db, user.id, "a-quiz-master")
        if awarded:
            achievements_unlocked.append("a-quiz-master")
            xp_gained += ach_xp
            user.xp += ach_xp

    # Quiz count achievements
    quiz_count = db.query(func.count(QuizResult.id)).filter(
        QuizResult.user_id == user.id
    ).scalar()

    if quiz_count >= 5:
        awarded, ach_xp = award_achievement_for_quiz(db, user.id, "a-quiz-streak")
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
        "score_breakdown": f"{score}/{total_questions}",
        "percentage": round((score / total_questions) * 100, 1) if total_questions > 0 else 0,
        "achievements_unlocked": achievements_unlocked
    }
