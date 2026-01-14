# PROJECT KNOWLEDGE BASE

**Generated:** 2026-01-14 | **Commit:** a3171eb | **Branch:** main

## OVERVIEW

100 Days of Code Learning Tracker - Gamified progress dashboard for structured Python/ML curriculum. Full-stack monorepo: FastAPI backend + React/Vite frontend, Supabase prod DB, Pyodide for browser Python execution.

## STRUCTURE

```
./
├── backend/           # FastAPI + SQLAlchemy API (see backend/AGENTS.md)
├── frontend/          # React 18 + Vite + Tailwind (see frontend/AGENTS.md)
├── scripts/           # Automation: content seeding, compliance (see scripts/AGENTS.md)
├── docs/              # Architecture, PRD, sprint artifacts
├── api/               # Vercel serverless Python adapters
├── data/              # Static curriculum data
├── Udemy - .../       # Source content (DO NOT commit derivatives without audit)
└── _bmad/             # BMAD automation framework (legacy tooling)
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| API endpoints | `backend/app/routers/*.py` | Modular routers: tasks, rpg, quizzes, spaced_repetition |
| DB models | `backend/app/models.py` | SQLAlchemy ORM - User, Quest, Boss, Course/Week/Task |
| Schema validation | `backend/app/schemas.py` | Pydantic models |
| Migrations | `backend/alembic/` | Alembic for Supabase PostgreSQL |
| React pages | `frontend/src/pages/` | Dashboard, Practice, DayDetail |
| Components | `frontend/src/components/` | Reusable UI widgets |
| State/Context | `frontend/src/contexts/` | AuthContext, CourseContext, PythonContext |
| API client | `frontend/src/api/` | Fetch wrappers + Supabase client |
| E2E tests | `frontend/e2e/` | Playwright specs |
| Unit tests | `frontend/tests/`, `backend/tests/` | Vitest / Pytest |
| Seed curriculum | `backend/seed.py` | Loads 32-week curriculum |
| Quiz seeding | `scripts/seed_supabase_questions.py` | Seeds quizzes from JSON |

## CONVENTIONS

**Content Sync Rule**: All "Day X" content MUST derive from `Udemy - 100 Days...` directory. Verify source before implementing DeepDive/Transcripts/Quizzes.

**Gamification Formula** (shared FE/BE):
```
XP to next level = 100 * level^1.2
```

**Path Alias**: Frontend uses `@/` = `src/` (jsconfig.json)

**Cross-Origin Isolation**: Required for Pyodide SharedArrayBuffer. Headers set in vite.config.js and vercel.json.

## ANTI-PATTERNS (THIS PROJECT)

- **DO NOT** commit Udemy-derived content without `compliance_audit.py` validation
- **DO NOT** hardcode user IDs - use auth context (dev mode has fallback user)
- **DO NOT** duplicate XP/level logic - use shared formula
- **DO NOT** modify SQLite DBs directly in prod - use Alembic migrations for Supabase

## COMMANDS

```bash
# Development (Windows)
npm run dev              # Starts frontend (5173) + backend (8000) concurrently

# Individual services
npm run dev:frontend     # Vite dev server
npm run dev:backend      # uvicorn with hot reload

# Testing
cd frontend && npm test           # Vitest unit tests
cd frontend && npm run test:e2e   # Playwright E2E
cd backend && pytest              # Backend tests

# Database
cd backend && python seed.py              # Seed local SQLite
cd scripts && python seed_supabase_questions.py  # Seed prod quizzes

# Build
npm run build            # Production frontend bundle
```

## DEPLOYMENT

| Target | Service | URL |
|--------|---------|-----|
| Frontend | Vercel | learning-tracker-nu-tan.vercel.app |
| Backend API | Render | (configured in render.yaml) |
| Database | Supabase | PostgreSQL |
| Serverless | Vercel | api/ directory routes |

## NOTES

- **Session caching**: Frontend caches API responses for 30s TTL
- **Auth**: Supabase JWT in prod, dev fallback user when missing
- **Pyodide**: Browser Python execution for code challenges - requires ~20MB WASM download
- **SQLite files in root**: `learning_tracker.db` = legacy dev DB, ignore
