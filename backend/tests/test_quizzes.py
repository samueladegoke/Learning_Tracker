"""Tests for quiz endpoints."""


def test_get_quiz_questions_not_found(client, seed_test_user):
    """Test getting questions for non-existent quiz returns empty list."""
    response = client.get("/api/quizzes/nonexistent-quiz/questions")

    assert response.status_code == 200
    assert response.json() == []


def test_get_quiz_questions(client, seed_test_user, seed_test_questions):
    """Test getting questions for existing quiz."""
    response = client.get("/api/quizzes/test-quiz/questions")

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2

    # Check question structure (correct_index and explanation should be present for immediate feedback)
    first_question = data[0]
    assert "text" in first_question
    assert "options" in first_question
    assert "correct_index" in first_question  # Shared for immediate feedback
    assert "explanation" in first_question    # Shared for immediate feedback


def test_get_completed_quizzes_empty(client, seed_test_user):
    """Test completed quizzes returns empty list initially."""
    response = client.get("/api/quizzes/completed")

    assert response.status_code == 200
    assert response.json() == []


def test_quiz_leaderboard_empty(client, seed_test_user):
    """Test leaderboard returns empty list when no results."""
    response = client.get("/api/quizzes/leaderboard")

    assert response.status_code == 200
    assert response.json() == []


def test_submit_quiz(client, seed_test_user, seed_test_questions):
    """Test submitting a quiz calculates score and awards XP."""
    submission = {
        "quiz_id": "test-quiz",
        "answers": {
            "1": 1,  # Correct (4)
            "2": 0   # Wrong (should be Paris at index 1)
        }
    }

    response = client.post("/api/quizzes/submit", json=submission)

    assert response.status_code == 200
    data = response.json()

    assert data["score"] == 1  # 1 correct out of 2
    assert data["total_questions"] == 2
    assert "xp_gained" in data
    assert data["xp_gained"] >= 10  # Base XP + score
