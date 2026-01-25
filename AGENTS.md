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

## BROWSER AUTOMATION (MANDATORY)

**PRIMARY TOOL: agent-browser**

For ANY browser automation task, use agent-browser via Bash commands:

```bash
# Open a page
npx agent-browser --session dev open https://learning-tracker-nu-tan.vercel.app

# Get interactive elements
npx agent-browser --session dev snapshot -i

# Click element by ref
npx agent-browser --session dev click @e5

# Fill form field
npx agent-browser --session dev fill @e1 "text here"

# Take screenshot
npx agent-browser --session dev screenshot /tmp/screenshot.png

# Close browser
npx agent-browser --session dev close
```

**IMPORTANT**: 
- Always use `--session <name>` flag (required on Windows/WSL)
- Use `@e1`, `@e2` refs from `snapshot -i` output
- Full docs: `.opencode/skills/agent-browser/SKILL.md`

**STABILITY**:
- If "Daemon failed to start" errors occur, clean up orphaned processes: `pkill -f agent-browser`
- Use a custom socket directory if needed: `export AGENT_BROWSER_SOCKET_DIR=/tmp/agent-sockets`

**DO NOT use** `skill("playwright")` or `skill_mcp(mcp_name="playwright")` - these are deprecated.
**DO NOT use** generic Playwright scripts. Use the `agent-browser` CLI.

## FRONTEND UI/UX SKILL (MANDATORY)

**PRIMARY TOOL: ui-ux-pro-max** (`.opencode/skills/ui-ux-pro-max/`)

For ANY frontend visual/UI/UX work, use the ui-ux-pro-max skill CLI:

```bash
# Generate complete design system (ALWAYS START HERE)
python3 .opencode/skills/ui-ux-pro-max/scripts/search.py "dashboard learning gamification" --design-system -p "Learning Tracker"

# Search specific domains
python3 .opencode/skills/ui-ux-pro-max/scripts/search.py "dark mode" --domain style -n 5
python3 .opencode/skills/ui-ux-pro-max/scripts/search.py "progress charts" --domain chart
python3 .opencode/skills/ui-ux-pro-max/scripts/search.py "accessibility animation" --domain ux

# Get stack-specific guidelines
python3 .opencode/skills/ui-ux-pro-max/scripts/search.py "responsive layout" --stack react
```

**Available Domains**: product, style, typography, color, landing, chart, ux, react, web, prompt

**Available Stacks**: html-tailwind, react, nextjs, vue, svelte, swiftui, react-native, flutter, shadcn

**WORKFLOW**:
1. Run `--design-system` to get complete recommendations
2. Use domain searches for specific details (typography, colors, charts)
3. Check `--domain ux` for accessibility and animation guidelines
4. Apply stack-specific guidance with `--stack react`

**IMPORTANT**: 
- ALWAYS run `--design-system` first for new UI work
- Check UX domain for accessibility before delivery
- Follow the Pre-Delivery Checklist in SKILL.md

## AGILE METHODOLOGY (MANDATORY)

**PRIMARY TOOL: BMad Method** (`.opencode/skills/bmad/`)

For ALL planning, architecture, and workflow management:

1. **Initialize**: `npx bmad-method@alpha workflow-init` (if starting fresh)
2. **Execute**: Use the specialized agents defined in `_bmad/` for each phase
3. **Reference**: Check `_bmad/docs/` for project artifacts

**Default Track**: BMad Method (Standard)
- Planning -> Architecture -> Implementation -> Review
