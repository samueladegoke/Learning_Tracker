# Architecture Patterns
Generated: 2025-12-10

## Frontend Pattern: Feature-Sliced SPA
**Type:** Single Page Application (SPA)
- **Routing:** Client-side via `react-router-dom`.
- **State:** Local React state + Context API. No external global store (Redux) detected.
- **Interactivity:** Heavy use of `pyodide` for client-side Python execution (Offloading compute to browser).
- **Structure:** Component-based with feature slicing.

## Backend Pattern: RESTful Service
**Type:** REST API
- **Layering:** Router -> Middleware -> Service/CRUD -> Database (SQLAlchemy).
- **Routing:** Domain-driven routers (`weeks`, `tasks`, `rpg`).
- **Data Access:** Synchronous SQLAlchemy ORM usage with strict Session lifecycle management.
- **Deployment:** Serverless-compatible (Mangum adapter) designed for Vercel functions code splitting.

## Integration Pattern
- **Style:** Tight coupling via REST API.
- **Contract:** Frontend `api/client.js` encapsulates all backend calls.
- **Deployment:** Monorepo deployment on Vercel (Frontend rewrites `/api/*` to Backend).
