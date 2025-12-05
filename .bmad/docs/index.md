# 100 Days of Code Learning Dashboard

A gamified learning dashboard for tracking progress through the 100 Days of Code Python bootcamp.

## Project Type
- **Level**: Method (solo developer)
- **Type**: Brownfield (existing codebase)
- **Status**: Active Development

## Quick Links
- [Architecture Overview](./architecture.md)
- [Frontend Guide](./frontend.md)
- [Backend Guide](./backend.md)
- [API Reference](./api.md)
- [Project Rules](./project-rules.md)

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18.2 + Vite 5 |
| Styling | TailwindCSS 3.4 |
| Python Runtime | Pyodide 0.26 (in-browser) |
| Backend | FastAPI (Python 3.11) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |

---

## Project Structure

```
100 Days of Code/
├── frontend/           # React + Vite application
│   ├── src/
│   │   ├── pages/      # Main page components
│   │   ├── components/ # Reusable UI components
│   │   ├── api/        # API client modules
│   │   └── lib/        # Utilities (Supabase client)
│   └── public/
├── backend/            # FastAPI server
│   └── app/
│       ├── routers/    # API endpoints
│       ├── utils/      # Gamification logic
│       └── models.py   # Pydantic schemas
├── scripts/            # Database seeding scripts
└── .bmad/              # BMad project documentation
```

---

## Key Features

### 1. RPG Progression System
- XP gained from completing tasks, quizzes, and challenges
- Level progression with boss battles at milestones
- Achievement badges and leaderboards

### 2. Interactive Practice
- **Deep Dive**: Concept explanations with code examples
- **Quiz**: MCQ + coding challenges (Pyodide execution)
- **Transcripts**: Collapsible lesson summaries

### 3. Calendar Tracking
- Visual task calendar with completion status
- Daily streaks and penalty system
- Boss battle triggers at major milestones

---

## Current Sprint
- Day 3 content integration (Control Flow & Logical Operators)
- Quiz seeding to Supabase
- Code review and security fixes

---

## Configuration

**Environment Variables:**
```bash
# Frontend (.env)
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_API_URL=http://localhost:8000

# Backend-only (not prefixed with VITE_)
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

---

## Development

```bash
# Frontend
cd frontend && npm install && npm run dev

# Backend
cd backend && uvicorn app.main:app --reload
```
