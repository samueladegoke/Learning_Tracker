# Architecture
Generated: 2026-02-19

## Status
Current runtime architecture (Convex + Clerk).

## Overview
100 Days of Code Learning Tracker is a single-page React app backed by Convex server functions and Clerk authentication. The system is optimized for fast learning loops (task completion, quizzes, reflections, and gamified progression) while keeping frontend and backend contracts simple and testable.

## Goals
- Keep user-facing latency low for core flows (`/practice`, `/calendar`, `/world-map`, dashboard).
- Keep business logic centralized in Convex functions (not duplicated in frontend).
- Preserve deterministic auth behavior with Clerk in production and controlled dev fallback.
- Keep test boundaries strict: Convex tests at root, Vitest unit/component in frontend, Playwright e2e isolated.

## High-Level Architecture
- Presentation: React 18 + Vite + Tailwind (`frontend/src`).
- Auth: Clerk (`@clerk/clerk-react`) with app auth context wrappers.
- Backend runtime: Convex functions (`convex/*.ts`) and schema (`convex/schema.ts`).
- Data: Convex-managed persisted documents.
- Browser Python runtime: Pyodide in frontend for challenge execution.

## Request/State Flow
1. User opens route in React app.
2. Auth context resolves guest/authenticated mode.
3. React queries/mutations call Convex functions.
4. Convex validates auth + applies domain logic.
5. UI renders derived state and gamification updates.

## Frontend Structure
- `frontend/src/pages/`: route-level pages.
- `frontend/src/components/`: reusable UI/feature components.
- `frontend/src/contexts/`: app-level auth/course/python state.
- `frontend/src/data/dayMeta.js`: canonical day metadata consumed by pages/components.

## Backend (Convex) Structure
- `convex/tasks.ts`: task lifecycle and completion updates.
- `convex/progress.ts`: progress and calendar query logic.
- `convex/rpg.ts`: XP/levels/streaks and related gamification state.
- `convex/quizzes.ts`: quiz flows and outcomes.
- `convex/srs.ts`, `convex/reflections.ts`: spaced repetition and reflection tracking.
- `convex/schema.ts`: source-of-truth data model.

## Authentication Model
- Production: Clerk session/auth tokens.
- Frontend guards protected routes through `ProtectedRoute` + auth context.
- Convex functions enforce authenticated access for protected operations.
- Dev mode can run with explicit fallback behavior controlled by environment flags.

## Core Domain Invariants
- Gamification formula remains consistent: `XP to next level = 100 * level^1.2`.
- Day content references remain source-traceable to canonical curriculum assets.
- No direct browser-to-legacy backend assumptions in active runtime.

## Testing Architecture
- Root: `npm run test:convex` executes only Convex Vitest suite (`vitest.config.mts`).
- Frontend unit/component: `cd frontend && npm test` (Vitest jsdom only).
- Frontend e2e: `cd frontend && npm run test:e2e` (Playwright with `testDir=tests/e2e`).
- CI gates mirror these boundaries in separate jobs.

## Deployment Topology
- Frontend: Vercel build of `frontend` Vite app.
- Backend/data: Convex cloud deployment.
- Auth: Clerk project configuration.

Required frontend env vars:
- `VITE_CONVEX_URL`
- `VITE_CLERK_PUBLISHABLE_KEY`
- `VITE_DEV_MODE` (optional)

## Operational Guardrails
- Documentation drift check blocks core docs that regress to removed backend stack references.
- Frontend dead-code reachability check blocks unreachable modules from `src/main.jsx`.
- Archive convention: unsupported historical scripts are moved under `scripts/archive/` with rationale.

## Known Constraints
- Pyodide bundle/runtime remains heavy and can trigger expected Vite externalization/chunk-size warnings.
- E2E tests intentionally smoke-check route stability and auth redirection behavior.
