# Project Context - 100 Days of Code Learning Tracker

> **Generated:** 2025-12-28  
> **Scan Level:** Exhaustive  
> **Status:** Active Development (MVP Complete)

---

## Executive Summary

A gamified Python learning platform tracking 100-day coding journey with RPG mechanics, spaced repetition quizzes, and interactive code execution via Pyodide.

---

## Project Classification

| Attribute | Value |
|-----------|-------|
| **Type** | Multi-part (Frontend + Backend) |
| **Architecture** | Server-First with Client-Side Code Execution |
| **Deployment** | Vercel (auto-deploy from GitHub) |
| **Production URL** | https://learning-tracker-nu-tan.vercel.app |

---

## Technology Stack

### Frontend
| Category | Technology | Version |
|----------|------------|---------|
| Framework | React | 18.2.0 |
| Build Tool | Vite | 5.0.0 |
| Styling | Tailwind CSS | 3.3.5 |
| UI Primitives | Radix UI (Shadcn) | Latest |
| Animation | Framer Motion | 12.23.25 |
| Code Execution | Pyodide | 0.27.5 |
| Code Editor | CodeMirror | 6.x |
| Auth | Supabase JS | 2.86.0 |
| Testing | Vitest + Playwright | Latest |

### Backend
| Category | Technology | Version |
|----------|------------|---------|
| Framework | FastAPI | 0.104.1 |
| ORM | SQLAlchemy | 2.0.23 |
| Database | PostgreSQL (Supabase) | - |
| Migrations | Alembic | 1.13.0+ |
| Auth | PyJWT | 2.8.0+ |
| Serverless | Mangum | 0.17.0 |

### Fonts (Design System)
| Purpose | Font Family |
|---------|-------------|
| Display/Headings | Outfit |
| Body Text | DM Sans |
| Code/Mono | JetBrains Mono |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  React + Vite + Tailwind + Radix UI                         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│  │Dashboard│ │Practice │ │Progress │ │Planner  │           │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘           │
│       │           │           │           │                 │
│       └───────────┴───────────┴───────────┘                 │
│                       │                                      │
│              ┌────────▼────────┐  ┌──────────────┐          │
│              │   API Client    │  │   Pyodide    │          │
│              │   (client.js)   │  │ (Web Worker) │          │
│              └────────┬────────┘  └──────────────┘          │
└───────────────────────┼──────────────────────────────────────┘
                        │ HTTPS + JWT
┌───────────────────────▼──────────────────────────────────────┐
│                        BACKEND                                │
│  FastAPI + SQLAlchemy + Alembic                              │
│  ┌──────────────────────────────────────────────────┐       │
│  │                    Routers                         │       │
│  │  /quizzes  /tasks  /srs  /rpg  /progress  /weeks │       │
│  └────────────────────────┬─────────────────────────┘       │
│                           │                                  │
│              ┌────────────▼────────────┐                    │
│              │   SQLAlchemy Models     │                    │
│              │   (19 entities)         │                    │
│              └────────────┬────────────┘                    │
│                           │                                  │
└───────────────────────────┼──────────────────────────────────┘
                            │
                  ┌─────────▼─────────┐
                  │     Supabase      │
                  │   PostgreSQL DB   │
                  │   + Auth          │
                  └───────────────────┘
```

---

## Frontend Structure

### Pages (6)
| Page | Path | Description |
|------|------|-------------|
| Dashboard | `/` | XP, Level, Streak, Hearts, Boss Battle status |
| Practice | `/practice` | Quiz + DeepDive + Code Editor (per day) |
| Planner | `/planner` | Weekly task management |
| Progress | `/progress` | Stats, achievements, badges |
| Calendar | `/calendar` | Activity heatmap |
| Reflections | `/reflections` | Weekly check-ins |

### Components (125+)
| Category | Count | Examples |
|----------|-------|----------|
| Quiz | 7 | Quiz.jsx, QuestionRenderer, OptionButton |
| UI Primitives | 6 | Button, Card, Tabs, Tooltip, Progress, Skeleton |
| Content (DeepDive) | 86 | Day1.jsx - Day86.jsx |
| RPG/Gamification | 10+ | CharacterCard, ShopModal, QuestLog |
| Utility | 5+ | ErrorBoundary, LoadingSkeletons |

### Design System
- **Color Palette:** Primary (Gold #facc15), Accent (Fuchsia #d946ef), Surface (Slate scale)
- **Dark Theme:** Default, using CSS variables in `:root`
- **Animations:** pulse-slow, float, glow (custom keyframes)
- **Border Radius:** CSS variable `--radius` based system

---

## Backend Structure

### API Routers (10)
| Router | Endpoints | Description |
|--------|-----------|-------------|
| quizzes | 6 | Quiz questions, verification, leaderboard |
| tasks | 3 | Task CRUD, completion tracking |
| spaced_repetition | 4 | SRS daily review, result submission |
| rpg | 3 | Game state, shop, XP awards |
| progress | 2 | User stats, calendar data |
| weeks | 3 | Week data, curriculum structure |
| reflections | 3 | Weekly journal entries |
| badges | 1 | Badge catalog |
| achievements | 1 | Achievement catalog |

### Database Models (19)
| Model | Purpose |
|-------|---------|
| User | Core user with XP, level, gold, streak, hearts |
| Task, UserTaskStatus | 100-day curriculum tasks |
| Question, QuizResult | MCQ and coding questions |
| UserQuestionReview | Spaced repetition state (SM2) |
| Badge, UserBadge | Collectible badges |
| Achievement, UserAchievement | Milestone achievements |
| Quest, QuestTask, UserQuest | Boss battle system |
| Challenge, UserChallenge | Time-limited challenges |
| UserInventory | Purchased items |
| Week, Reflection | Weekly curriculum and journals |

---

## Key Features (Current State)

### ✅ Implemented
- Dashboard with full RPG stats display
- 80+ days of DeepDive educational content
- Quiz system with MCQ + Coding challenges
- Spaced Repetition System (SRS) for review
- Pyodide-based Python code execution in browser
- Supabase authentication
- Leaderboard with pagination
- Activity calendar heatmap
- Weekly reflections
- Shop system (XP → Items)

### 🔄 Recent Changes (2025-12-28)
- Typography updated: Outfit + DM Sans fonts
- CSS variables fixed for dark theme consistency
- Code review fixes: refetch hook, Date optimization

### ⏳ Deferred (Phase 2)
- Offline-first PWA capabilities
- Web Worker Pyodide hardening
- Background sync engine

---

## Development Setup

```bash
# Frontend
cd frontend
npm install
npm run dev        # localhost:5173

# Backend
cd backend
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

---

## Critical Files

| Purpose | Path |
|---------|------|
| Frontend Entry | `frontend/src/main.jsx` |
| App Router | `frontend/src/App.jsx` |
| API Client | `frontend/src/api/client.js` |
| Design Tokens | `frontend/tailwind.config.js` |
| CSS Variables | `frontend/src/index.css` |
| Backend Entry | `backend/app/main.py` |
| DB Models | `backend/app/models.py` |
| Auth | `backend/app/auth.py` |
| Migrations | `backend/alembic/` |

---

## AI Agent Guidelines

1. **Dark Theme First** - All UI uses dark backgrounds (surface-950)
2. **Shadcn Primitives** - Use existing Radix UI components from `src/components/ui/`
3. **API Pattern** - All endpoints require JWT auth via `get_current_user`
4. **Gamification** - XP/Gold awarded through task completion cascades
5. **Font Classes** - Use `font-display` for headings, `font-body` for text, `font-mono` for code
