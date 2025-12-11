# Source Tree Analysis
Generated: 2025-12-10

## Project Root
`c:\Users\USER\Documents\Programming\100 Days of Code`

### Structure Overview
```
.
├── backend/                 # Python/FastAPI Backend (Part: Backend)
│   ├── alembic/             # Database migrations
│   ├── app/                 # Main application package
│   │   ├── models.py        # SQLAlchemy Data Models
│   │   ├── routers/         # API Route definitions
│   │   ├── schemas.py       # Pydantic Response/Request models
│   │   ├── utils/           # Shared utilities (Gamification, Quest logic)
│   │   └── main.py          # [ENTRY POINT] API initialization & CORS
│   ├── requirements.txt     # Python dependencies
│   ├── seed.py              # Development data seeder
│   └── recreate_schema.sql  # DB Reset utility
├── frontend/                # React/Vite Frontend (Part: Frontend)
│   ├── src/                 # Source code
│   │   ├── api/             # API Client layer
│   │   ├── components/      # Reusable UI components
│   │   ├── contexts/        # React Contexts (PythonProvider)
│   │   ├── pages/           # Page definitions (Routing targets)
│   │   └── App.jsx          # Root component & Routing
│   ├── public/              # Static assets
│   ├── package.json         # NPM dependencies & scripts
│   └── vite.config.js       # Build configuration
├── docs/                    # Project Documentation
│   ├── sprint-artifacts/    # Task tracking & Stories
│   └── *.md                 # Architecture, PRD, Guides
└── scripts/                 # Utility Scripts (ETL, Maintenance)
```

## Critical Directories & Files

### Backend
- **`backend/app/main.py`**: The application entry point. Defines endpoint routing and middleware.
- **`backend/alembic/`**: Critical for database schema changes.
- **`backend/app/routers/tasks.py`**: Core gamification business logic implementation.

### Frontend
- **`frontend/src/contexts/PythonContext.jsx`**: Manages the Pyodide runtime (Heavy logic).
- **`frontend/src/api/`**: Abstraction layer for backend communication.

### Utilities
- **`scripts/`**: Independent scripts for data import/export (e.g. from Udemy content to DB).
