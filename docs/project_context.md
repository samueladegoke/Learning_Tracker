---
project_name: '100 Days of Code'
user_name: 'Sam'
date: '2025-12-10'
sections_completed: ['technology_stack', 'language_rules', 'framework_rules', 'testing_rules', 'quality_rules', 'workflow_rules', 'anti_patterns']
status: 'complete'
rule_count: 48
optimized_for_llm: true
---

# Project Context

## Technology Stack & Versions

### Core Frameworks
- **Frontend:** React `^18.2.0` (Vite `^5.0.0`)
- **Backend:** FastAPI `0.104.1` (Python 3.10+)
- **Database:** PostgreSQL (Production) / SQLite (Dev) via SQLAlchemy `2.0.23`

### Key Libraries
- **Styling:** TailwindCSS `^3.3.5` + `lucide-react` (Icons) + `framer-motion` (Animation)
- **State/Logic:** `pyodide` `^0.27.5` (Python in Browser)
- **Backend Utils:** `alembic` `1.13.0` (Migrations), `uvicorn` `0.24.0`

## Critical Implementation Rules

### Language-Specific Rules

#### JavaScript (Frontend)
- **Async Patterns:** Always use `async/await` for API calls; avoid `.then()` chains.
- **Environment:** Use `import.meta.env.VITE_*` exclusively (Vite standard).
- **Imports:** Use named exports for API clients (e.g., `import { tasksAPI } ...`).
- **Strict Mode:** Components must be resilient to double-mounting (React Strict Mode).

#### Python (Backend)
- **Sync/Async Boundary:** Use `def` (sync) for routes with SQLAlchemy `Session`. NEVER use `async def` with blocking ORM calls.
- **Pydantic V2:** Use `class Config: from_attributes = True` for ORM serialization (NOT `orm_mode`).
- **Database Migrations:** Modification of `models.py` MUST be followed by `alembic revision --autogenerate`.
- **Absolute Imports:** Use `from app.models import ...` to avoid circular import hell.

### Framework-Specific Rules

#### React (Frontend)
- **Concurrency Pattern:** Use `executionMutex` (Promise chaining via `useRef`) for serializing async Pyodide operations.
- **Router Compatibility:** Maintain `future` flags in `BrowserRouter` for React Router v7 readiness.
- **Hooks Usage:** Encapsulate complex logic (like Pyodide interaction) in custom hooks (`usePythonRunner`).
- **State Management:** Use `React Context` + `useMemo` for global services. Avoid Redux for this scale.
- **Styling:** TailwindCSS classes ONLY.
- **Directory Structure:** Components in `src/components/`, pages in `src/pages/`, API clients in `src/api/`.

### Data & Persistence Rules
- **API Client:** ALL API calls must go through `src/api/client.js` (centralized fetch wrapper).
- **Server-First:** Data is fetched from backend on page load. No localStorage caching currently implemented.
- **Error Handling:** Display user-friendly error states when API calls fail.
- **Future Consideration:** Local-First/Offline patterns are documented in `architecture.md` as Phase 2 goals.

### Testing Rules

#### Frontend (Playwright)
- **E2E Focus:** Primary verification via `npm test` (Playwright).
- **Selectors:** Use user-facing role assertions (e.g., `getByRole('button', ...)`). avoid XPath.
- **Visuals:** Explicitly verify "Electric Banana" theme elements (e.g. `.animate-float`).

#### Backend (Manual Scripts)
- **Execution Helper:** Use `backend/recreate_schema.sql` to reset DB state before running complex logic tests.
- **Pattern:** Standalone scripts (e.g., `test_boss_logic.py`) must handle their own `SessionLocal` lifecycle and rollback.
- **Future Goal:** Adopt `pytest` for unit testing logic (currently missing).

### Code Quality & Style Rules

#### Styling & Conventions
- **Implicit Standards:** No automated linter/formatter (ESLint/Ruff) detected. Agents must **mimic existing style** exactly.
- **Frontend Naming:** PascalCase for components (`TaskCard.jsx`). CamelCase for hooks/utils.
- **Backend Naming:** Snake_case for modules (`tasks.py`) and variables.
- **Comments:** Prefer self-documenting code. Use docstrings `"""` for complex logic only.

#### Directory Structure
- `frontend/src/components`: UI components only.
- `backend/app/routers`: Logic split by domain (weeks, tasks, rpg).

### Development Workflow Rules

#### Project Management
- **Artifacts:** Work is tracked via Epics/Stories in `docs/sprint-artifacts/`.
- **Checklist:** `task.md` must be updated to reflect current progress.

#### Git / Repository
- **Ignored Files:** NEVER commit `seed_data.json`, `.env`, or `node_modules`.
- **Commit Messages:** Use semantic prefixes (e.g., `feat:`, `fix:`, `docs:`).

#### Deployment
- **Supabase:** DB changes in production require `alembic` migrations (never direct mutations).
- **Vercel:** Frontend rewrites `/api/*` to backend. Maintain this contract.

### Critical Don't-Miss Rules

#### Anti-Patterns to Avoid
- **Frontend:** NEVER use `fetch` directly; always use `api/client.js`.
- **Backend:** NEVER hardcode user ID `1` in production logic (except for dev/seeding).
- **Styling:** NEVER leave `className` strings messy; use the `cn()` utility if available or keep them sorted.

#### Edge Cases
- **Pyodide Loading:** Always handle `isReady` state. The Python runtime takes seconds to load; UI must reflect this.
- **Data Sync:** API errors should display user-friendly messages. Toast notifications are the current standard.

#### Security & Env
- **CORS:** Restricted to localhost dev ports and production Vercel URL (`https://learning-tracker-nu-tan.vercel.app`).
- **Secrets:** `.env` variables are the ONLY place for keys.

---

## Usage Guidelines

**For AI Agents:**

- Read this file before implementing any code
- Follow ALL rules exactly as documented
- When in doubt, prefer the more restrictive option
- Update this file if new patterns emerge

**For Humans:**

- Keep this file lean and focused on agent needs
- Update when technology stack changes
- Review quarterly for outdated rules
- Remove rules that become obvious over time

Last Updated: 2025-12-13






