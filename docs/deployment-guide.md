# Deployment Guide
Generated: 2025-12-10

## Architecture
- **Frontend**: Vercel (Static/SPA)
- **Backend**: Render (Web Service)
- **Database**: Supabase (PostgreSQL)

## Configuration

### Backend (Render)
- **Runtime**: Python 3
- **Build**: `pip install -r backend/requirements.txt`
- **Start**: `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Env Vars**:
  - `DATABASE_URL`: `postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres`

### Frontend (Vercel)
- **Framework Preset**: Vite
- **Root Directory**: `frontend`
- **Env Vars**:
  - `VITE_API_URL`: Your Render Service URL (e.g., `https://learning-tracker-backend.onrender.com`)

## Database Seeding (Remote)
To seed the remote production DB:
```bash
# Set env var locally
export DATABASE_URL="[YOUR_SUPABASE_CONNECTION_STRING]"
# Run seeder
python backend/seed.py
```
*(Windows: use `$env:DATABASE_URL="..."`)*
