# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend                                 │
│                    React + Vite + TailwindCSS                    │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │Dashboard│ │Calendar │ │Practice │ │Progress │ │Planner  │   │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘   │
│       └───────────┴───────────┼───────────┴───────────┘         │
│                               ▼                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                      API Clients                          │   │
│  │  rpgAPI │ tasksAPI │ quizApi │ progressAPI │ weeksAPI    │   │
│  └────────────────────────────┬─────────────────────────────┘   │
└───────────────────────────────┼─────────────────────────────────┘
                                │ HTTP/JSON
                                ▼
┌───────────────────────────────────────────────────────────────┐
│                         Backend                                │
│                       FastAPI + Python                         │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                        Routers                            │ │
│  │ /weeks │ /tasks │ /rpg │ /progress │ /quizzes │ /badges  │ │
│  └────────────────────────────┬─────────────────────────────┘ │
│                               ▼                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                    Business Logic                         │ │
│  │              utils/gamification.py (XP, Levels)           │ │
│  └────────────────────────────┬─────────────────────────────┘ │
└───────────────────────────────┼───────────────────────────────┘
                                │
                                ▼
┌───────────────────────────────────────────────────────────────┐
│                       Data Layer                               │
│  ┌─────────────────┐          ┌─────────────────────────────┐ │
│  │   SQLite (Dev)  │          │   Supabase (Quiz Data)      │ │
│  │   SQLAlchemy    │          │   PostgreSQL + RLS          │ │
│  └─────────────────┘          └─────────────────────────────┘ │
└───────────────────────────────────────────────────────────────┘
```

---

## API Endpoints

### Backend (FastAPI) - `localhost:8000`

| Router | Prefix | Purpose |
|--------|--------|---------|
| `weeks` | `/weeks` | Week management (100 days = ~14 weeks) |
| `tasks` | `/tasks` | Task completion, daily tracking |
| `reflections` | `/reflections` | Weekly reflection journal |
| `progress` | `/progress` | Overall progress stats, calendar data |
| `badges` | `/badges` | Achievement badges |
| `rpg` | `/rpg` | XP, levels, shop, boss battles |
| `achievements` | `/achievements` | Milestone achievements |
| `quizzes` | `/quizzes` | Quiz questions (proxies Supabase) |

### Key Endpoints

```
GET  /rpg/state          → { xp, level, gold, inventory, boss_hp }
POST /rpg/award-xp       → Award XP for actions
POST /tasks/{id}/complete → Complete task, triggers XP
GET  /progress/calendar  → Calendar data for heatmap
GET  /quizzes/{id}/questions → Fetch quiz questions
```

---

## Frontend Pages

| Page | File | Purpose |
|------|------|---------|
| Dashboard | `Dashboard.jsx` | Main hub: XP, level, quests, shop |
| Calendar | `Calendar.jsx` | Task calendar with completion heatmap |
| Practice | `Practice.jsx` | Deep Dive, Quiz, Transcripts per day |
| Progress | `Progress.jsx` | Stats, achievements, leaderboard |
| Planner | `Planner.jsx` | Task planning and scheduling |
| Reflections | `Reflections.jsx` | Weekly reflection journal |

---

## Data Models

### RPG State (Backend)
```python
class RPGState:
    xp: int
    level: int
    gold: int
    hp: int
    max_hp: int
    boss_hp: int
    daily_streak: int
```

### Quiz Question (Supabase)
```python
class QuizQuestion:
    quiz_id: str           # "day-1-practice"
    question_type: str     # "mcq" | "coding"
    text: str
    options: list[str]     # MCQ only
    correct_index: int     # MCQ only
    starter_code: str      # Coding only
    test_cases: list       # Coding only
    solution_code: str
    explanation: str
    difficulty: str
    topic_tag: str
```

---

## Key Patterns

### 1. XP Calculation (Centralized)
```python
# backend/app/utils/gamification.py
def calculate_xp(action: str, context: dict) -> int
def get_level_for_xp(xp: int) -> int
```

### 2. Quiz Execution (Pyodide)
```jsx
// Frontend: Practice.jsx
// Uses Pyodide to run Python code in-browser
// Test cases validated against expected output
```

### 3. Day Content Structure
```jsx
const DAY_META = {
    'day-1': { quizId, topics, ... },
    'day-2': { ... },
    'day-3': { ... }
}
// DeepDiveDay{N}, TranscriptsDay{N} components
```

---

## Environment Variables

### Frontend (`.env`)
```bash
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...  # Public, RLS-protected
VITE_API_URL=http://localhost:8000
```

### Backend-Only (NOT prefixed with VITE_)
```bash
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # NEVER expose to frontend
```
