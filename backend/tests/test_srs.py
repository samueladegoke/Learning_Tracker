"""Tests for Spaced Repetition System (SRS) endpoints."""
import pytest
from datetime import datetime, timedelta
from backend.app.models import Question, UserQuestionReview

def test_get_daily_review_empty(client, seed_test_user):
    """Test daily review returns empty list when no questions are due."""
    response = client.get("/api/srs/daily-review")
    assert response.status_code == 200
    assert response.json()["total_due"] == 0

def test_add_to_review_and_fetch(client, seed_test_user, seed_test_questions, db_session):
    """Test adding a question to review and then fetching it."""
    # 1. Add question to review
    question_id = seed_test_questions[0].id
    add_response = client.post(f"/api/srs/add-to-review/{question_id}")
    assert add_response.status_code == 200
    
    # 2. Force the review to be due now (by default SRS starts at 1 day)
    review = db_session.query(UserQuestionReview).filter(UserQuestionReview.question_id == question_id).first()
    review.due_date = datetime.utcnow() - timedelta(hours=1)
    db_session.commit()
    
    # 3. Fetch daily review
    review_response = client.get("/api/srs/daily-review")
    assert review_response.status_code == 200
    data = review_response.json()
    assert data["total_due"] >= 1
    assert any(q["question_id"] == question_id for q in data["questions"])

def test_submit_review_result_success(client, seed_test_user, seed_test_questions, db_session):
    """Test submitting a successful review result updates interval."""
    # Setup: Question already in review and due now
    question_id = seed_test_questions[0].id
    review = UserQuestionReview(
        user_id=seed_test_user.id,
        question_id=question_id,
        due_date=datetime.utcnow() - timedelta(hours=1),
        interval_index=0 # 1 day
    )
    db_session.add(review)
    db_session.commit()

    # Submit correct result
    submission = {
        "review_id": review.id,
        "was_correct": True
    }
    response = client.post("/api/srs/review-result", json=submission)
    
    assert response.status_code == 200
    data = response.json()
    assert "Correct!" in data["message"]
    assert data["xp_awarded"] == 10
    
    # Verify DB update
    updated_review = db_session.query(UserQuestionReview).filter(UserQuestionReview.id == review.id).first()
    assert updated_review.interval_index == 1
    assert updated_review.success_count == 1
    assert updated_review.due_date > datetime.utcnow()

def test_submit_review_result_failure(client, seed_test_user, seed_test_questions, db_session):
    """Test submitting a failed review result resets interval."""
    # Setup: Question in review at higher interval
    question_id = seed_test_questions[0].id
    review = UserQuestionReview(
        user_id=seed_test_user.id,
        question_id=question_id,
        due_date=datetime.utcnow() - timedelta(hours=1),
        interval_index=3 # 14 days
    )
    db_session.add(review)
    db_session.commit()

    # Submit wrong result
    submission = {
        "review_id": review.id,
        "was_correct": False
    }
    response = client.post("/api/srs/review-result", json=submission)
    
    assert response.status_code == 200
    data = response.json()
    assert "Not quite!" in data["message"]
    assert data["xp_awarded"] == 0
    
    # Verify DB update: resets to interval 0
    updated_review = db_session.query(UserQuestionReview).filter(UserQuestionReview.id == review.id).first()
    assert updated_review.interval_index == 0
    assert updated_review.success_count == 0
    assert updated_review.due_date < (datetime.utcnow() + timedelta(days=2))
