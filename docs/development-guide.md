# Development Guide
Generated: 2025-12-10 | Updated: 2025-12-15

## Quick Start (Recommended)
From the project root, run both frontend and backend with a single command:
```bash
# Windows
npm run dev

# Linux/Mac
npm run dev:unix
```
This opens the frontend and runs the backend concurrently.

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| Swagger Docs | http://localhost:8000/docs |

## Prerequisites
- **Python**: 3.9+
- **Node.js**: 16+
- **Git**

## Manual Setup (Individual Services)

### Backend (FastAPI)
```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
python seed.py  # Initialize standard curriculum
npm run dev:backend  # or: uvicorn app.main:app --reload --port 8000
```

### Frontend (React)
```bash
cd frontend
npm install
npm run dev
```

## Testing

### Unit Tests (Frontend - Vitest)
```bash
cd frontend
npm test              # Run once
npm run test:watch    # Watch mode  
npm run test:coverage # With coverage report
```

### API Tests (Backend - pytest)
```bash
cd backend
python -m pytest tests/ -v        # Verbose
python -m pytest tests/ --cov=app # With coverage
```

### End-to-End (Playwright)
```bash
cd frontend
npm run test:e2e         # Run e2e tests
npm run test:e2e:ui      # UI Mode
npm run test:e2e:headed  # Headed browser
```

## Database
- **Local**: SQLite (`backend/learning_tracker.db` by default or per `database.py` config).
- **Schema Management**: SQLAlchemy + Alembic (if enabled). currently `seed.py` handles initialization.
