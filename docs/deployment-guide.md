# Deployment Guide
Generated: 2026-02-19

## Runtime Topology

- Frontend SPA: Vercel
- Functions + Data: Convex Cloud
- Authentication: Clerk

## Frontend (Vercel)

- Framework preset: Vite
- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`

Required environment variables:

- `VITE_CONVEX_URL`
- `VITE_CLERK_PUBLISHABLE_KEY`
- `VITE_DEV_MODE` (optional, typically `false` in production)

## Convex

- Keep production deployment configured in Convex dashboard.
- Validate schema/function deploys before frontend release.

## Release Checklist

1. `npm run test:convex`
2. `cd frontend && npm test`
3. `cd frontend && npm run build`
4. `cd frontend && npm run test:e2e` (or CI e2e gate)
5. Verify Clerk + Convex env vars in target environment.

## Post-Deploy Smoke Checks

- Dashboard loads without runtime errors.
- `/practice`, `/calendar`, `/world-map` route correctly.
- Auth gate behavior is correct for guest vs signed-in users.
- Pyodide challenge runtime initializes successfully.
