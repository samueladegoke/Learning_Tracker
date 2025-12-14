import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine, Base
from .routers import weeks, tasks, reflections, progress, badges, rpg, achievements, quizzes

# Create database tables
Base.metadata.create_all(bind=engine)

# Determine root path (essential for Vercel routing)
# Vercel rewrites /api/... to /api/index.py, so we need to tell FastAPI that /api is the root
# Hardcoding to /api for Vercel deployment stability
root_path = "/api"

app = FastAPI(
    title="Learning Tracker API",
    description="API for the AI Learning Roadmap Tracker",
    version="1.0.0",
    root_path=root_path
)

# =============================================================================
# CORS Configuration
# =============================================================================
# Restrict to known development and production origins
# ALLOWED_ORIGINS can be set as a comma-separated list in environment variables

DEFAULT_ORIGINS = (
    "http://localhost:5173,"
    "http://localhost:5174,"
    "http://localhost:5175,"
    "http://localhost:8000,"
    "https://learning-tracker-nu-tan.vercel.app"
)

def get_allowed_origins():
    """
    Parse and validate CORS origins from environment variable.
    Filters out empty strings and validates URL format.
    """
    origins_str = os.getenv("ALLOWED_ORIGINS", DEFAULT_ORIGINS)
    origins = [origin.strip() for origin in origins_str.split(",")]
    
    # Filter out empty strings and validate basic URL structure
    valid_origins = []
    for origin in origins:
        if not origin:
            continue
        # Basic validation: must start with http:// or https://
        if origin.startswith("http://") or origin.startswith("https://"):
            valid_origins.append(origin)
        else:
            # Log warning for invalid origins (only in development)
            print(f"[CORS Warning] Invalid origin ignored: {origin}")
    
    return valid_origins if valid_origins else ["http://localhost:5173"]

ALLOWED_ORIGINS = get_allowed_origins()

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers with /api prefix for Vercel compatibility
app.include_router(weeks.router, prefix="/api/weeks", tags=["weeks"])
app.include_router(tasks.router, prefix="/api/tasks", tags=["tasks"])
app.include_router(reflections.router, prefix="/api/reflections", tags=["reflections"])
app.include_router(progress.router, prefix="/api/progress", tags=["progress"])
app.include_router(badges.router, prefix="/api/badges", tags=["badges"])
app.include_router(rpg.router, prefix="/api/rpg", tags=["rpg"])
app.include_router(achievements.router, prefix="/api/achievements", tags=["achievements"])
app.include_router(quizzes.router, prefix="/api/quizzes", tags=["quizzes"])


@app.get("/api")
def root_api():
    return {"message": "Learning Tracker API", "docs": "/api/docs"}


@app.get("/")
def root():
    return {"message": "Learning Tracker API (Use /api)", "docs": "/docs"}


@app.get("/api/health")
def health_check_api():
    return {"status": "healthy"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}
