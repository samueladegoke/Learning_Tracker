# Development Guide
Generated: 2025-12-10

## Prerequisites
- **Python**: 3.9+
- **Node.js**: 16+
- **Git**

## Setup Instructions

### 1. Backend (FastAPI)
```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
python seed.py  # Initialize standard curriculum
uvicorn app.main:app --reload --port 8000
```
- **URL**: `http://localhost:8000`
- **Swagger Docs**: `http://localhost:8000/docs`

### 2. Frontend (React)
```bash
cd frontend
npm install
npm run dev
```
- **URL**: `http://localhost:5173`

## Testing
### End-to-End (Playwright)
```bash
cd frontend
npm test
```
- **UI Mode**: `npm run test:ui`
- **Headed**: `npm run test:headed`

## Database
- **Local**: SQLite (`backend/learning_tracker.db` by default or per `database.py` config).
- **Schema Management**: SQLAlchemy + Alembic (if enabled). currently `seed.py` handles initialization.
