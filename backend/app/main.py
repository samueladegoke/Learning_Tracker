import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text

from .database import engine, Base, get_db
from .routers import weeks, tasks, reflections, progress, badges, rpg, achievements, quizzes, spaced_repetition

# Configure logger
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Handle app startup and shutdown safely.
    Moves blocking DB initialization out of the top-level module code.
    """
    # Startup: Try to create tables if they don't exist
    # This is a fallback for the development/single-user phase.
    # In full production, we should rely solely on Alembic migrations.
    try:
        # Wrap in a short timeout or just try-except to prevent boot-looping
        Base.metadata.create_all(bind=engine)
        logger.info("[Lifespan] Database initialization sync complete.")
    except Exception as e:
        # FAIL SOFT: Log the error but allow the app to start
        # This allows the health check and documentation to be accessible
        logger.error(f"[Lifespan] Database table creation failed: {e}")

    yield
    # Shutdown logic (if any) can go here


# Determine root path (essential for Vercel routing)
# Vercel rewrites /api/... to /api/index.py, so we need to tell FastAPI that /api is the root
root_path = "/api"

app = FastAPI(
    title="Learning Tracker API",
    description="API for the AI Learning Roadmap Tracker",
    version="1.0.0",
    lifespan=lifespan
)

# =============================================================================
# CORS Configuration
# =============================================================================
# Restrict to known development and production origins
DEFAULT_ORIGINS = (
    "http://localhost:5173,"
    "http://localhost:5174,"
    "http://localhost:5175,"
    "http://localhost:8000,"
    "https://learning-tracker-nu-tan.vercel.app"
)

def get_allowed_origins():
    origins_str = os.getenv("ALLOWED_ORIGINS", DEFAULT_ORIGINS)
    origins = [origin.strip() for origin in origins_str.split(",")]
    valid_origins = []
    for origin in origins:
        if not origin: continue
        if origin.startswith("http://") or origin.startswith("https://"):
            valid_origins.append(origin)
        else:
            logger.warning(f"[CORS] Invalid origin ignored: {origin}")
    return valid_origins if valid_origins else ["http://localhost:5173"]

ALLOWED_ORIGINS = get_allowed_origins()

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(weeks.router, prefix="/api/weeks", tags=["weeks"])
app.include_router(tasks.router, prefix="/api/tasks", tags=["tasks"])
app.include_router(reflections.router, prefix="/api/reflections", tags=["reflections"])
app.include_router(progress.router, prefix="/api/progress", tags=["progress"])
app.include_router(badges.router, prefix="/api/badges", tags=["badges"])
app.include_router(rpg.router, prefix="/api/rpg", tags=["rpg"])
app.include_router(achievements.router, prefix="/api/achievements", tags=["achievements"])
app.include_router(quizzes.router, prefix="/api/quizzes", tags=["quizzes"])
app.include_router(spaced_repetition.router, prefix="/api/srs", tags=["Spaced Repetition"])


@app.get("/api")
def root_api():
    return {"message": "Learning Tracker API", "docs": "/api/docs"}


@app.get("/")
def root():
    return {"message": "Learning Tracker API (Use /api)", "docs": "/docs"}


@app.get("/api/health")
def health_check_api():
    """Simple liveness check - no dependencies."""
    return {
        "status": "healthy",
        "environment": os.getenv("VERCEL_ENV", "production" if os.getenv("VERCEL") else "development")
    }


@app.get("/api/health/db")
def health_check_db(db: Session = Depends(get_db)):
    """Deep health check with DB connectivity test."""
    try:
        db.execute(text("SELECT 1"))
        return {"database": "connected"}
    except Exception as e:
        return {"database": f"disconnected: {str(e)}"}


@app.get("/health")
def health_check():
    """Alias for /api/health."""
    return health_check_api()





