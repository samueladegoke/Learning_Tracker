import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Check for DATABASE_URL environment variable (used by Render/Supabase)
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

print(f"DEBUG: Checking DATABASE_URL...", flush=True)
if SQLALCHEMY_DATABASE_URL:
    print(f"DEBUG: Found DATABASE_URL: {SQLALCHEMY_DATABASE_URL[:10]}...", flush=True)
else:
    print("DEBUG: DATABASE_URL not found in env vars.", flush=True)

if SQLALCHEMY_DATABASE_URL and SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    # Fix for SQLAlchemy requiring postgresql:// scheme
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)

if not SQLALCHEMY_DATABASE_URL:
    # Anchor the SQLite database path to the backend directory so it is stable
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    DB_FILENAME = os.environ.get("LEARNING_TRACKER_DB", "learning_tracker_rpg_v2.db")
    DB_PATH = os.path.normpath(os.path.join(BASE_DIR, "..", DB_FILENAME))
    SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH}"
    connect_args = {"check_same_thread": False}
else:
    connect_args = {}

from sqlalchemy.pool import NullPool

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args=connect_args,
    poolclass=NullPool
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """Dependency to get database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
