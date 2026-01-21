# BACKEND KNOWLEDGE BASE

**Scope:** FastAPI REST API with SQLAlchemy ORM

## OVERVIEW

Python 3.9+ FastAPI backend with modular routers, SQLAlchemy models, Pydantic validation. Supabase PostgreSQL in production, SQLite for local dev.

## STRUCTURE

```
backend/
├── app/
│   ├── main.py           # FastAPI app, CORS, router mounts
│   ├── database.py       # DB engine, session, Base
│   ├── models.py         # SQLAlchemy ORM models
│   ├── schemas.py        # Pydantic request/response
│   ├── auth.py           # Supabase JWT verification
│   ├── routers/          # API endpoints by domain
│   └── utils/            # Helpers
├── alembic/              # DB migrations
├── tests/                # Pytest suite
├── seed.py               # Curriculum seeder
└── *.db                  # Local SQLite DBs
```

## WHERE TO LOOK

| Task | Location |
|------|----------|
| Add new endpoint | `app/routers/` - create or extend module |
| Add DB model | `app/models.py` + `alembic/` migration |
| Modify validation | `app/schemas.py` |
| Auth logic | `app/auth.py` - `get_current_user()` |
| Task completion flow | `app/routers/tasks.py` - `complete_task()` |
| RPG mechanics | `app/routers/rpg.py` - quests, bosses, challenges |
| Quiz CRUD | `app/routers/quizzes.py` |

## CONVENTIONS

**Router Pattern**: Each router file = one domain. Mount in main.py with prefix.
```python
router = APIRouter(prefix="/api/tasks", tags=["tasks"])
```

**DB Sessions**: Use `Depends(get_db)` for request-scoped sessions.

**Auth**: `Depends(get_current_user)` - returns User or raises 401.

**Atomic Transactions**: Task completion updates XP, boss damage, badges, challenge progress in single transaction.

## ANTI-PATTERNS

- **DO NOT** use raw SQL except in seed scripts
- **DO NOT** skip Pydantic validation on request bodies
- **DO NOT** commit `.db` file changes (gitignored)
- **DO NOT** import models in schemas.py (circular import risk)

## KEY MODELS

| Model | Purpose |
|-------|---------|
| `User` | XP, level, gold, hearts, streak, daily reviews |
| `Course` | Container for weeks |
| `Week` | 7 tasks, milestone info |
| `Task` | Individual learning task |
| `Quest`/`Boss`/`Challenge` | RPG gamification entities |
| `QuizQuestion` | Day-specific quiz content |

## COMMANDS

```bash
# Dev server
uvicorn app.main:app --reload --port 8000

# Migrations
alembic revision --autogenerate -m "description"
alembic upgrade head

# Tests
pytest -v
pytest tests/test_tasks.py -k "complete"

# Seed
python seed.py
```
