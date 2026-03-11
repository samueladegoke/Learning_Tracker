# 100 Days of Code Learning Tracker

Gamified progress tracker for a structured Python/ML curriculum.

- Frontend: React + Vite + Tailwind
- Functions/Data: Convex
- Auth: Clerk
- In-browser code execution: Pyodide

## Project Layout

```
.
├── convex/
├── frontend/
├── scripts/
├── data/
├── docs/
└── _archive/
```

## Local Development

```bash
# terminal 1
npm run convex

# terminal 2
npm run dev
```

Frontend default URL: `http://localhost:5173`

## Testing

```bash
# root (Convex)
npm run test:convex

# frontend unit/component
cd frontend && npm test

# frontend e2e
cd frontend && npm run test:e2e
```

## Build

```bash
cd frontend && npm run build
```

## Core Conventions

- XP progression formula: `100 * level^1.2`
- Frontend alias: `@/` maps to `frontend/src/`
- Day content must remain source-traceable before merge

## Deployments

- Frontend: Vercel
- Backend platform: Convex Cloud
- Authentication: Clerk

## Documentation

Start with:
- `docs/documentation-index.md`
- `docs/development-guide.md`
- `docs/deployment-guide.md`

Archived historical material is kept under `docs/sprint-artifacts/`, `scripts/archive/`, and `_archive/`.
