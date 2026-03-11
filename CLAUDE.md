# CLAUDE.md - 100 Days of Code Learning Tracker

## Commands

### Development (requires two terminals)
- `npm run convex` - Start Convex dev server (terminal 1)
- `npm run dev` or `npm run dev:frontend` - Start Vite dev server on port 5173 (terminal 2)

### Monitoring
- `npx convex dev --tail` - Tail Convex logs in real-time

### Testing
- `npm run test:convex` - Backend tests (vitest with convex-test)
- `cd frontend && npm test` - Frontend unit + component tests (vitest)
- `cd frontend && npm run test:e2e` - Playwright E2E tests

### Quality Checks
- `npm run check:dead-code` - Find unused frontend code
- `npm run check:docs` - Check documentation drift
- `cd frontend && npm run lint` - ESLint
- `npx tsc --noEmit` - TypeScript type checking (no emit)

### Build
- `npm run build` - Production build (frontend only; Convex deploys separately)
- `npm run preview` - Preview production build (requires build first)

## Architecture

### Tech Stack
- Frontend: React 18 + Vite + Tailwind + React Router
- Backend: Convex (serverless functions + database)
- Auth: Clerk
- In-browser Python: Pyodide + CodeMirror

### Directory Structure
```
convex/ - Convex functions and schema
frontend/src/
  ├── api/ - Convex query/mutation hooks
  ├── components/ - React components
  ├── contexts/ - React contexts (Python, Auth)
  ├── hooks/ - Custom React hooks
  ├── pages/ - Route-level components
  └── utils/ - Helper functions
```

## Code Conventions
- **Path alias**: `@/` maps to `frontend/src/`
- **XP formula**: `100 * level^1.2` for level progression
- **Component imports**: Use `@/components/ui/*` for shadcn/ui components
- **Python execution**: Use `usePython()` context hook for running code
- **File naming**: React components use `.jsx`, utilities use `.js`

## Environment
- Convex configured in `.env.local`
- Frontend dev server: http://localhost:5173
- Check `.env.example` for required variables
- **Claude Code**: Settings in `~/.claude/settings.json`, backups in `~/.claude/backups/`

## Gotchas
- **Two-server requirement**: Must run both Convex and Vite simultaneously
- **Python state**: Pyodide loads asynchronously via context
- **Component tests**: Use separate vitest configs (unit vs component)
- **Convex auto-sync**: The `convex/` folder auto-synchronizes with Convex Cloud in real-time
- **Gitignored directories**: `.claude/`, `.codex/`, `bmad-custom-src/` are in `.gitignore`
