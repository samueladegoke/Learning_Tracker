import os
import logging
import ssl
from urllib.parse import urlparse, urlunparse, quote
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.pool import NullPool


# Configure logging
logger = logging.getLogger(__name__)

# Load environment variables from .env file
load_dotenv()


def _fix_database_url(url: str) -> str:
    """
    Fix common issues with DATABASE_URL for SQLAlchemy + Supabase:
    1. Replace 'postgres://' with 'postgresql://' (SQLAlchemy requirement)
    2. URL-encode the password to handle special characters (@, #, %, etc.)
    3. Append 'sslmode=require' for Supabase Pooler connections
    """
    if not url:
        return url

    # Fix scheme for SQLAlchemy+pg8000
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql+pg8000://", 1)
    elif url.startswith("postgresql://"):
        url = url.replace("postgresql://", "postgresql+pg8000://", 1)

    # Parse the URL to encode the password
    parsed = urlparse(url)

    # Only process PostgreSQL URLs
    if not parsed.scheme.startswith("postgresql"):
        return url

    # URL-encode the password if present
    if parsed.password:
        # Re-encode to handle special characters
        encoded_password = quote(parsed.password)
        # Reconstruct netloc with encoded password
        if parsed.port:
            netloc = f"{parsed.username}:{encoded_password}@{parsed.hostname}:{parsed.port}"
        else:
            netloc = f"{parsed.username}:{encoded_password}@{parsed.hostname}"

        # Rebuild URL with encoded password
        url = urlunparse((
            parsed.scheme,
            netloc,
            parsed.path,
            parsed.params,
            parsed.query,
            parsed.fragment
        ))
        # Re-parse after reconstruction
        parsed = urlparse(url)

    return url


# Check for DATABASE_URL environment variable (used by Render/Supabase)
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# Log database configuration status (without exposing credentials)
if SQLALCHEMY_DATABASE_URL:
    # Determine database type without exposing connection details
    is_postgres = "postgresql" in SQLALCHEMY_DATABASE_URL or "postgres" in SQLALCHEMY_DATABASE_URL
    if is_postgres:
        logger.info("Database: PostgreSQL (production)")
    elif "sqlite" in SQLALCHEMY_DATABASE_URL:
        logger.info("Database: SQLite (development)")
    else:
        logger.info("Database: External connection configured")

    # Apply fixes for PostgreSQL URLs
    SQLALCHEMY_DATABASE_URL = _fix_database_url(SQLALCHEMY_DATABASE_URL)
else:
    logger.info("Database: SQLite fallback (no DATABASE_URL configured)")
    is_postgres = False

if not SQLALCHEMY_DATABASE_URL:
    # Anchor the SQLite database path to the backend directory so it is stable
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    DB_FILENAME = os.environ.get("LEARNING_TRACKER_DB", "learning_tracker_rpg_v2.db")
    DB_PATH = os.path.normpath(os.path.join(BASE_DIR, "..", DB_FILENAME))
    SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH}"
    connect_args = {"check_same_thread": False}
else:
    # Production connection args
    connect_args = {}
    if is_postgres:
        # timeout is for pg8000 (unit is seconds). 
        # Reducing to 3s to avoid Vercel function timeout (10s default).
        connect_args["timeout"] = 3
        
        # pg8000 SSL configuration for Supabase
        # We use a custom context to handle Supabase's SSL requirements
        ssl_ctx = ssl.create_default_context()
        ssl_ctx.check_hostname = False
        # [SECURITY] CERT_NONE is used because Supabase Pooler uses self-signed certificates.
        # In a high-security environment, the Supabase CA should be provided here.
        ssl_ctx.verify_mode = ssl.CERT_NONE
        connect_args["ssl_context"] = ssl_ctx


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
