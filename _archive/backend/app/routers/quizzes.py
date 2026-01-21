import json
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import func

from ..database import get_db
from ..models import QuizResult, User, Question, Achievement, UserAchievement, UserQuestionReview
from ..schemas import QuizSubmission, QuestionResponse, QuestionPublicResponse, AnswerSubmission, AnswerVerifyResponse
from ..auth import get_current_user
from ..routers.spaced_repetition import SRS_INTERVALS
from datetime import datetime, timedelta

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


@router.get("/{quiz_id}/questions", response_model=List[QuestionPublicResponse])
def get_quiz_questions(quiz_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get questions for a specific quiz (without correct answers or explanations)."""
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

        response.append(QuestionPublicResponse(
            id=q.id,
            quiz_id=q.quiz_id,
            question_type=q.question_type or "mcq",
            text=q.text,
            code=q.code,  # For code-correction questions
            options=options_list,
            starter_code=q.starter_code,
            test_cases=test_cases_list,
            difficulty=q.difficulty,
            topic_tag=q.topic_tag
        ))

    return response


# M2 Fix: Pydantic model for complete_quiz request
class QuizCompleteRequest(BaseModel):
    score: int = 0


@router.post("/{quiz_id}/complete")
def complete_quiz(quiz_id: str, request: QuizCompleteRequest = None, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Mark a quiz as completed for the current user."""
    # Check if already completed today
    existing = db.query(QuizResult).filter(
        QuizResult.user_id == user.id,
        QuizResult.quiz_id == quiz_id,
        QuizResult.completed_at >= datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    ).first()
    
    if existing:
        return {"status": "already_completed", "quiz_id": quiz_id}
    
    # Count questions for this quiz
    question_count = db.query(Question).filter(Question.quiz_id == quiz_id).count()
    
    # M2 Fix: Use score from request body
    score = request.score if request else 0
    
    # Create completion record with actual score
    result = QuizResult(
        user_id=user.id,
        quiz_id=quiz_id,
        score=score,
        total_questions=question_count,
        completed_at=datetime.utcnow()
    )
    db.add(result)
    db.commit()
    
    return {"status": "completed", "quiz_id": quiz_id, "score": score}


# H2 Fix: Extracted shared verification logic to eliminate duplication
def _verify_answer_logic(question: Question, answer) -> tuple[bool, int, str]:
    """Shared verification logic. Returns (is_correct, correct_index, explanation)."""
    question_type = question.question_type or 'mcq'
    is_correct = False
    
    if question_type in ('mcq', 'code-correction'):
        is_correct = isinstance(answer, int) and question.correct_index == answer
    elif question_type == 'coding':
        is_correct = isinstance(answer, dict) and answer.get('allPassed', False)
    
    return is_correct, question.correct_index, question.explanation


@router.post("/{quiz_id}/verify", response_model=AnswerVerifyResponse)
def verify_answer_with_quiz(quiz_id: str, submission: AnswerSubmission, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Verify a single answer (deprecated - use /verify instead)."""
    question = db.query(Question).filter(
        Question.quiz_id == quiz_id,
        Question.id == submission.question_id
    ).first()
    
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    is_correct, correct_index, explanation = _verify_answer_logic(question, submission.answer)
    
    return AnswerVerifyResponse(
        question_id=question.id,
        is_correct=is_correct,
        correct_index=correct_index,
        explanation=explanation
    )


@router.post("/verify", response_model=AnswerVerifyResponse)
def verify_answer(submission: AnswerSubmission, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Verify a single answer by question ID only."""
    question = db.query(Question).filter(Question.id == submission.question_id).first()
    
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    is_correct, correct_index, explanation = _verify_answer_logic(question, submission.answer)
    
    return AnswerVerifyResponse(
        question_id=question.id,
        is_correct=is_correct,
        correct_index=correct_index,
        explanation=explanation
    )


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

    # Rate limiting: Check for duplicate submission within 30 seconds
    recent_submission = db.query(QuizResult).filter(
        QuizResult.user_id == user.id,
        QuizResult.quiz_id == submission.quiz_id,
        QuizResult.completed_at >= datetime.utcnow() - timedelta(seconds=30)
    ).first()
    
    if recent_submission:
        raise HTTPException(
            status_code=429, 
            detail="Please wait before submitting the same quiz again"
        )

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

    # --- SRS Auto-Queueing: Add incorrectly answered questions to review queue ---
    failed_question_ids = []
    for q_id_str, answer in submission.answers.items():
        try:
            q_id = int(q_id_str)
        except ValueError:
            continue

        question = questions_map.get(q_id)
        if not question:
            continue

        question_type = question.question_type or 'mcq'
        was_correct = False

        if question_type in ('mcq', 'code-correction'):
            was_correct = isinstance(answer, int) and question.correct_index == answer
        elif question_type == 'coding':
            was_correct = isinstance(answer, dict) and answer.get('allPassed', False)

        if not was_correct:
            failed_question_ids.append(q_id)

    # Queue failed questions for SRS review
    for q_id in failed_question_ids:
        existing_review = db.query(UserQuestionReview).filter(
            UserQuestionReview.user_id == user.id,
            UserQuestionReview.question_id == q_id
        ).first()

        if existing_review:
            # Reset interval for re-failed question
            existing_review.interval_index = 0
            existing_review.success_count = 0
            existing_review.due_date = datetime.utcnow() + timedelta(days=SRS_INTERVALS[0])
            existing_review.is_mastered = False
        else:
            # Create new review entry
            new_review = UserQuestionReview(
                user_id=user.id,
                question_id=q_id,
                interval_index=0,
                due_date=datetime.utcnow() + timedelta(days=SRS_INTERVALS[0]),
                success_count=0,
                is_mastered=False
            )
            db.add(new_review)
    # --- End SRS Auto-Queueing ---

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

    # --- Phase 2: Quiz → Task Completion Hook ---
    # If user passes quiz (≥70%), mark the corresponding task as complete
    # This unifies progress tracking without double-awarding XP
    task_completed = False
    task_id = None
    passing_threshold = 0.7
    
    if total_questions > 0 and (score / total_questions) >= passing_threshold:
        # Extract day number from quiz_id (e.g., "day-5" -> 5)
        try:
            day_num = int(submission.quiz_id.replace("day-", "").split("-")[0])
            # Convert to task_id format: "w{week}-d{day_of_week}"
            week = (day_num - 1) // 7 + 1
            day_of_week = ((day_num - 1) % 7) + 1
            task_id = f"w{week}-d{day_of_week}"
            
            # Import and call task completion internal function
            from .tasks import _complete_task_internal
            task_result = _complete_task_internal(db, user, task_id, skip_xp=True, commit=False)
            
            if not task_result.get("error") and not task_result.get("already_completed"):
                task_completed = True
        except (ValueError, AttributeError):
            # If quiz_id doesn't match expected format, skip task completion
            pass
    # --- End Quiz → Task Completion Hook ---

    db.commit()

    return {
        "message": "Quiz submitted",
        "xp_gained": xp_gained,
        "score": score,
        "total_questions": total_questions,
        "score_breakdown": f"{score}/{total_questions}",
        "percentage": round((score / total_questions) * 100, 1) if total_questions > 0 else 0,
        "achievements_unlocked": achievements_unlocked,
        "task_completed": task_completed,
        "task_id": task_id
    }
