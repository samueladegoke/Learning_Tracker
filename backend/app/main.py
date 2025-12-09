from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine, Base
from .routers import weeks, tasks, reflections, progress, badges, rpg, achievements

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Learning Tracker API",
    description="API for the AI Learning Roadmap Tracker",
    version="1.0.0"
)

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(weeks.router, prefix="/weeks", tags=["weeks"])
app.include_router(tasks.router, prefix="/tasks", tags=["tasks"])
app.include_router(reflections.router, prefix="/reflections", tags=["reflections"])
app.include_router(progress.router, prefix="/progress", tags=["progress"])
app.include_router(badges.router, prefix="/badges", tags=["badges"])
app.include_router(rpg.router, prefix="/rpg", tags=["rpg"])
app.include_router(achievements.router, prefix="/achievements", tags=["achievements"])
from .routers import quizzes
app.include_router(quizzes.router, prefix="/quizzes", tags=["quizzes"])


@app.get("/")
def root():
    return {"message": "Learning Tracker API", "docs": "/docs"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


