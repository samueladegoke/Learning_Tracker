# Development Guide
Generated: 2026-02-19

## Prerequisites

- Node.js 20+
- npm 10+

## Quick Start

Run Convex and frontend in separate terminals.

```bash
# Terminal 1
npm run convex

# Terminal 2
npm run dev
```

Frontend URL: `http://localhost:5173`

## Frontend Commands

```bash
cd frontend
npm install
npm run dev
npm run build
```

## Test Commands

```bash
# root Convex tests
npm run test:convex

# frontend unit + component tests
cd frontend && npm test

# frontend e2e tests
cd frontend && npm run test:e2e
```

## Quality Checks

```bash
# frontend lint
cd frontend && npm run lint

# frontend dead-code reachability
cd frontend && npm run check:dead-code

# core doc drift check
npm run check:docs
```

## Notes

- Dev-mode auth bypass is controlled with `VITE_DEV_MODE=true`.
- Pyodide features require cross-origin isolation headers configured in frontend/vite and deployment config.
