# PROJECT KNOWLEDGE BASE

**Generated:** 2026-02-19

## OVERVIEW

100 Days of Code Learning Tracker is a Convex + React monorepo for structured learning progress, quizzes, reflections, and gamified progression.

## STRUCTURE

```
./
├── convex/            # Convex functions, schema, and tests
├── frontend/          # React 18 + Vite + Tailwind application
├── scripts/           # Content and migration utilities
├── data/              # Curriculum and migration data files
├── docs/              # Product, architecture, and sprint artifacts
├── _archive/          # Archived snapshots and legacy material
└── _bmad/             # BMAD workflow assets
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Convex API logic | `convex/*.ts` | Tasks, quizzes, progress, RPG, SRS |
| Convex schema | `convex/schema.ts` | Source of truth for data model |
| React pages | `frontend/src/pages/` | Dashboard, Practice, Planner, etc. |
| React components | `frontend/src/components/` | Shared UI and feature components |
| Context/state | `frontend/src/contexts/` | AuthContext, CourseContext, PythonContext |
| Frontend tests | `frontend/tests/`, `frontend/src/**/__tests__` | Vitest + Playwright |
| Content scripts | `scripts/` | Question seeding and audits |

## CONVENTIONS

- Gamification formula: `XP to next level = 100 * level^1.2`
- Frontend path alias: `@/` -> `frontend/src/`
- Content sync rule: Day content must trace to the source course materials before merge.

## COMMANDS

```bash
# Frontend + Convex local development
npm run dev               # frontend dev server
npm run convex            # convex dev function runner

# Root tests (Convex)
npm run test:convex

# Frontend tests
cd frontend && npm test               # unit + component
cd frontend && npm run test:e2e       # end-to-end

# Build
cd frontend && npm run build
```

## DEPLOYMENT

| Target | Service |
|--------|---------|
| Frontend | Vercel |
| Functions + Data | Convex Cloud |
| Auth | Clerk |

## NOTES

- Auth: Clerk in production; optional local dev mode bypass.
- Pyodide is used for in-browser Python challenge execution.
- Archived migration and one-time scripts are under `scripts/archive/` and are not part of daily development workflows.

## BROWSER AUTOMATION (MANDATORY)

Use `agent-browser` for browser automation tasks.

```bash
npx agent-browser --session dev open https://learning-tracker-nu-tan.vercel.app
npx agent-browser --session dev snapshot -i
npx agent-browser --session dev click @e5
npx agent-browser --session dev fill @e1 "text here"
npx agent-browser --session dev screenshot /tmp/screenshot.png
npx agent-browser --session dev close
```

- Always pass `--session <name>`.
- Use element refs from `snapshot -i`.
- Full docs: `.opencode/skills/agent-browser/SKILL.md`

## FRONTEND UI/UX SKILL (MANDATORY)

Use `ui-ux-pro-max` for visual/UI/UX tasks.

```bash
python3 .opencode/skills/ui-ux-pro-max/scripts/search.py "dashboard learning gamification" --design-system -p "Learning Tracker"
python3 .opencode/skills/ui-ux-pro-max/scripts/search.py "responsive layout" --stack react
```

## AGILE METHODOLOGY (MANDATORY)

Use the BMAD method workflow assets in `_bmad/` for planning and implementation coordination.
