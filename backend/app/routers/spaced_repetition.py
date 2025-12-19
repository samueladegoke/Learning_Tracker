"""Spaced Repetition System (SRS) router for daily review questions."""
import json
from datetime import datetime, timedelta
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.models import User, Question, UserQuestionReview
from app.auth import get_current_user

router = APIRouter(tags=["Spaced Repetition"])

# SRS intervals in days (Simple-SM2)
SRS_INTERVALS = [1, 3, 7, 14]


# --- Pydantic Schemas ---

class ReviewQuestionOut(BaseModel):
    id: int
    question_id: int
    text: str
    question_type: str
    code: str | None = None
    options: List[str] = []
    correct_index: int | None = None
    starter_code: str | None = None
    test_cases: List[dict] | None = None
    topic_tag: str | None = None
    interval_index: int
    success_count: int


class ReviewResultIn(BaseModel):
    review_id: int
    was_correct: bool


class ReviewResultOut(BaseModel):
    review_id: int
    is_mastered: bool
    next_due_date: datetime
    xp_awarded: int
    message: str


class DailyReviewSummary(BaseModel):
    total_due: int
    questions: List[ReviewQuestionOut]
    xp_bonus_available: int


# --- Endpoints ---

@router.get("/daily-review", response_model=DailyReviewSummary)
def get_daily_review(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get up to 10 questions due for review today.
    Returns questions whose due_date is <= now and are not yet mastered.
    """
    now = datetime.utcnow()

    # Query due reviews (not mastered, due <= now)
    due_reviews = (
        db.query(UserQuestionReview)
        .filter(
            UserQuestionReview.user_id == user.id,
            UserQuestionReview.due_date <= now,
            UserQuestionReview.is_mastered == False  # noqa: E712
        )
        .order_by(UserQuestionReview.due_date.asc())
        .limit(10)
        .all()
    )

    # Build response with question data
    questions = []
    for review in due_reviews:
        q = review.question
        if q:
            # Parse options/test_cases JSON strings to lists
            try:
                options_list = json.loads(q.options) if q.options else []
            except (json.JSONDecodeError, TypeError):
                options_list = []

            try:
                test_cases_list = json.loads(q.test_cases) if q.test_cases else None
            except (json.JSONDecodeError, TypeError):
                test_cases_list = None

            questions.append(ReviewQuestionOut(
                id=review.id,
                question_id=q.id,
                text=q.text,
                question_type=q.question_type or "mcq",
                code=q.code,
                options=options_list,
                correct_index=q.correct_index,
                starter_code=q.starter_code,
                test_cases=test_cases_list,
                topic_tag=q.topic_tag,
                interval_index=review.interval_index,
                success_count=review.success_count
            ))

    return DailyReviewSummary(
        total_due=len(due_reviews),
        questions=questions,
        xp_bonus_available=50 if len(questions) >= 5 else len(questions) * 10
    )


@router.post("/review-result", response_model=ReviewResultOut)
def submit_review_result(
    result: ReviewResultIn,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Submit the result of a single review question.
    Updates the SRS state and awards XP.
    """

    now = datetime.utcnow()
    review = db.query(UserQuestionReview).filter(
        UserQuestionReview.id == result.review_id,
        UserQuestionReview.user_id == user.id
    ).first()

    if not review:
        raise HTTPException(status_code=404, detail="Review not found")

    # Prevent early submissions (anti-spam/integrity)
    if review.due_date > now and not review.is_mastered:
        raise HTTPException(
            status_code=400, 
            detail="This question is not yet due for review."
        )

    xp_awarded = 0
    message = ""

    if result.was_correct:
        # Correct: advance interval and increment success count
        review.success_count += 1
        if review.interval_index < len(SRS_INTERVALS) - 1:
            review.interval_index += 1

        # Calculate next due date
        interval_days = SRS_INTERVALS[review.interval_index]
        review.due_date = datetime.utcnow() + timedelta(days=interval_days)

        # Check for mastery (3+ consecutive successes at max interval)
        if review.success_count >= 3 and review.interval_index == len(SRS_INTERVALS) - 1:
            review.is_mastered = True
            xp_awarded = 100  # Mastery bonus
            message = "🏆 Concept Mastered! +100 XP"
        else:
            xp_awarded = 10
            message = f"✅ Correct! Next review in {interval_days} days. +10 XP"
    else:
        # Incorrect: reset to interval 0 and clear success count
        review.interval_index = 0
        review.success_count = 0
        review.due_date = datetime.utcnow() + timedelta(days=SRS_INTERVALS[0])
        xp_awarded = 0
        message = f"❌ Not quite! Review again in {SRS_INTERVALS[0]} day."

    review.last_reviewed_at = datetime.utcnow()

    # Award XP to user
    user.xp += xp_awarded

    db.commit()
    db.refresh(review)

    return ReviewResultOut(
        review_id=review.id,
        is_mastered=review.is_mastered,
        next_due_date=review.due_date,
        xp_awarded=xp_awarded,
        message=message
    )


@router.post("/add-to-review/{question_id}")
def add_question_to_review(
    question_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Add a question to the user's review queue (called when a question is answered incorrectly).
    If already in the queue, resets the interval to 0.
    """

    # Check if question exists
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    # Check if already in the queue
    existing = db.query(UserQuestionReview).filter(
        UserQuestionReview.user_id == user.id,
        UserQuestionReview.question_id == question_id
    ).first()

    if existing:
        # Reset interval
        existing.interval_index = 0
        existing.success_count = 0
        existing.due_date = datetime.utcnow() + timedelta(days=SRS_INTERVALS[0])
        existing.is_mastered = False
        db.commit()
        return {"message": "Question reset in review queue", "due_date": existing.due_date}

    # Create new review entry
    new_review = UserQuestionReview(
        user_id=user.id,
        question_id=question_id,
        interval_index=0,
        due_date=datetime.utcnow() + timedelta(days=SRS_INTERVALS[0]),
        success_count=0,
        is_mastered=False
    )
    db.add(new_review)
    db.commit()
    db.refresh(new_review)

    return {"message": "Question added to review queue", "due_date": new_review.due_date}


@router.get("/stats")
def get_srs_stats(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get SRS statistics for the user."""

    total_in_queue = db.query(UserQuestionReview).filter(
        UserQuestionReview.user_id == user.id
    ).count()

    mastered_count = db.query(UserQuestionReview).filter(
        UserQuestionReview.user_id == user.id,
        UserQuestionReview.is_mastered == True  # noqa: E712
    ).count()

    due_now = db.query(UserQuestionReview).filter(
        UserQuestionReview.user_id == user.id,
        UserQuestionReview.due_date <= datetime.utcnow(),
        UserQuestionReview.is_mastered == False  # noqa: E712
    ).count()

    return {
        "total_in_queue": total_in_queue,
        "mastered_count": mastered_count,
        "due_now": due_now
    }
