import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from backend.app.database import Base, get_db
from backend.app.main import app


# Create in-memory SQLite database for testing
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db_session():
    """Create a fresh database for each test."""
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session):
    """Create a test client with overridden database dependency."""
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db

    test_client = TestClient(app)
    yield test_client

    app.dependency_overrides.clear()


@pytest.fixture
def seed_test_user(db_session):
    """Seed a test user for authenticated endpoints."""
    from backend.app.models import User

    user = User(id=1, username="test_user", xp=0, level=1)
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def seed_test_questions(db_session):
    """Seed test questions for quiz endpoints."""
    from backend.app.models import Question

    questions = [
        Question(
            id=1,
            quiz_id="test-quiz",
            question_type="mcq",
            text="What is 2 + 2?",
            options='["3", "4", "5", "6"]',
            correct_index=1,
            explanation="2 + 2 equals 4"
        ),
        Question(
            id=2,
            quiz_id="test-quiz",
            question_type="mcq",
            text="What is the capital of France?",
            options='["London", "Paris", "Berlin", "Madrid"]',
            correct_index=1,
            explanation="Paris is the capital of France"
        ),
    ]

    for q in questions:
        db_session.add(q)
    db_session.commit()

    return questions
