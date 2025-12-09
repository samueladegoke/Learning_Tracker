from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine, Base
from .routers import weeks, tasks, reflections, progress, badges, rpg, achievements

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

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
from .routers import quizzes
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


