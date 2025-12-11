# Integration Analysis
Generated: 2025-12-10

## Internal Integrations

### Frontend <-> Backend
- **Protocol:** HTTP/1.1 REST
- **Client:** Custom `fetch` wrapper in `src/api/client.js`.
- **Base URL:** Defined by `VITE_API_URL` (Prod) or defaults to `http://localhost:8000/api` (Dev).
- **Authentication:** Implicit/None (Currently single-user `DEFAULT_USER_ID = 1`).
- **Data Format:** JSON.

### Logic Coupling
- **Tasks:** Shared "Task ID" strings (e.g., "w1-d1") link Curriculum data (DB) to Frontend Routing logic.
- **Gamification:** Frontend displays state (XP, Gold) but Backend is authority. Frontend updates local state optimistically or re-fetches `/rpg/state` and `/progress` after actions.

## External Integrations

### Data & runtime
- **Pyodide:**
    - **Source:** CDN (`cdn.jsdelivr.net`).
    - **Integration:** Dynamic import in `PythonContext.jsx`.
    - **Usage:** Executes Python code strings from user input entirely client-side. No sandboxing isolation beyond browser capabilities.

- **Supabase (PostgreSQL):**
    - **Connection:** Direct SQLAlchemy connection from Backend via `DATABASE_URL`.
    - **Pooling:** Standard SQLAlchemy pooling (QueuePool).

- **Vercel/Render:**
    - **Frontend:** Vercel rewrites `/api/*` requests to the Backend Service URL to avoid CORS issues in some configs, though CORS is enabled in `main.py` (`allow_origins=["*"]`).
