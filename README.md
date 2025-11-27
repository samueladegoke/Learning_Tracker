# 🔥 AI Learning Roadmap Tracker & Gamified Dashboard

**A progress-tracking, motivation-boosting web app** to support a 5-day/ week, 2-hour/day learning roadmap — combining structured curriculum, daily tasks, reflections, and gamified rewards. Built (or to be built) with a Python backend (e.g. FastAPI) and a modern frontend (e.g. React / Vue), this app aims to help the learner stay accountable, organized, and motivated from Day 1 to Project MVP completion.  

---

## 📚 Project Overview

### What is this project?

This application is a personal learning companion. It loads a full curriculum (e.g. 32-week roadmap for learning Python, data, ML, trading, design patterns, etc.), and provides a user interface to:

- View weekly / daily tasks  
- Mark tasks as completed  
- Track progress (XP, levels, streaks, completion %)  
- Journal weekly reflections / check-ins  
- See overall statistics and achievements (badges, levels)  
- Visualize progress over time (charts, streaks)  

### Why build it?

Because learning complex, multi-phase skills (Python → Data → Trading → ML/RL → Software architecture) requires structure, consistency, and motivation. This app transforms a long roadmap into manageable daily/weekly tasks, adds accountability, and gamifies progress — turning learning into a rewarding, habit-forming journey.  

### Who is it for?

Initially for a single user (you), but architecture should support scaling to multiple users in the future (e.g. for a small team, study group, or public release).  

---

## ✅ Key Features

- ✅ Full roadmap loaded (weeks, tasks, milestones, check-in prompts)  
- ✅ Dashboard showing current week, today’s tasks, weekly progress  
- ✅ Planner view: full roadmap with expandable weeks and daily tasks statuses  
- ✅ Task completion — mark tasks done, gain XP / points  
- ✅ Weekly reflections / journal — prompts and saveable entries  
- ✅ Progress & Stats page — total tasks done, completion %, XP, level, streak, badge list  
- ✅ Gamification: XP, levels, badges, progress bars, celebratory feedback (on task / milestone completion)  
- ✅ Achievements/Badges system — e.g. complete a week, hit a 4-week streak, finish major modules  
- ✅ Data persistence — store tasks status, reflections, achievements  
- ✅ REST API backend (e.g. via FastAPI) + database  
- ✅ Frontend (web UI) — responsive, intuitive, friendly  
- ✅ Modular architecture — backend / frontend separation, clear data model, easy to extend  

---

## 🛠️ Tech Stack (Suggested)

- **Backend:** Python + FastAPI (or equivalent)  
- **Database:** SQLite (initial) or PostgreSQL (for scaling)  
- **Frontend:** React (or Vue) + CSS framework / UI lib (e.g. Tailwind, Bootstrap)  
- **State management & API communication:** React Context / Hooks (or Vue + store), Axios / fetch  
- **Optional deployment / containerization:** Docker  

---

## 📄 Data Model (Schema)

| Entity / Model | Description |
|---------------|-------------|
| `User` | User account (single-user initially), with XP, level, streak, etc. |
| `Week` | Represents a week in the roadmap; contains tasks, milestone, check-in prompt |
| `Task` | A daily or periodic task: day, description, XP reward, badge possibility |
| `UserTaskStatus` | Links user ↔ task: tracks completion status and timestamp |
| `Reflection` | Weekly journal / check-in answers for a week |
| `Badge` | Definition of a badge / achievement (name, description, XP reward) |
| `UserBadge` | Tracks which badges a user has unlocked and when |

> See the full schema definitions (JSON-style) in the project docs (or `/docs/schema.json`).  

---

## 🖥️ UI / Page Structure & Navigation

- **Dashboard** — current week, today’s tasks, weekly progress bar, XP/level/streak display, quick-jump to planner/reflections/stats  
- **Planner / Roadmap** — full list of weeks, expandable to show daily tasks, tasks status, milestone & check-in prompt  
- **Reflections / Journal** — weekly reflection form (on end-of-week), view past entries  
- **Progress & Stats** — charts: weekly completion %, XP over time, streaks, summary stats; list of unlocked badges/achievements  
- **Achievements / Badges** — gallery of all possible badges; indicates unlocked vs locked, show unlock date & description  
- **(Optional) Settings / Profile** — for user preferences, theming (dark mode), notification preferences, multi-user support  

---

## 🧪 Getting Started — Setup & Running Locally

```bash
# Clone the repo  
git clone <repo-url>  
cd <repo-folder>  

# (Backend) Create virtual environment & install dependencies  
python -m venv .venv  
source .venv/bin/activate      # or `.venv\Scripts\activate` on Windows  
pip install -r backend/requirements.txt  

# (Frontend) install dependencies  
cd frontend  
npm install                  # or yarn  

# Start backend  
cd ..  
uvicorn backend.main:app --reload  

# Start frontend (in separate terminal)  
cd frontend  
npm start                   # or yarn dev  

# Visit in browser  
http://localhost:3000        # or whatever port the frontend uses  
