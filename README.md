# 🔥 AI Learning Roadmap Tracker & Gamified Dashboard

**A progress-tracking, motivation-boosting web app** to support a 5-day/week, 2-hour/day learning roadmap — combining structured curriculum, daily tasks, reflections, and gamified rewards. Built with a Python backend (FastAPI) and a modern React frontend, this app helps you stay accountable, organized, and motivated from Day 1 through your 100-day learning journey.

> **Version:** 1.0.0 (MVP) | **Repository:** [samueladegoke/Learning_Tracker](https://github.com/samueladegoke/Learning_Tracker)

---

## 📋 Project Structure

```
Learning_Tracker/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI application entry point
│   │   ├── database.py          # SQLite database configuration
│   │   ├── models.py            # SQLAlchemy ORM models
│   │   ├── schemas.py           # Pydantic data validation schemas
│   │   └── routers/             # API route handlers
│   │       ├── weeks.py         # Week and task endpoints
│   │       ├── tasks.py         # Task completion endpoints
│   │       ├── reflections.py   # Weekly reflection endpoints
│   │       ├── progress.py      # User progress & statistics
│   │       ├── badges.py        # Badge/achievement endpoints
│   │       ├── rpg.py           # RPG gamification features
│   │       └── achievements.py  # Achievement system
│   ├── seed.py                  # Database seed script
│   ├── requirements.txt         # Python dependencies
│   └── *.db                     # SQLite database files
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js        # API client functions
│   │   ├── components/          # Reusable React components
│   │   │   ├── Navbar.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   ├── WeekAccordion.jsx
│   │   │   ├── BadgeCard.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   ├── ProgressRing.jsx
│   │   │   └── StatCard.jsx
│   │   ├── pages/               # Page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Planner.jsx
│   │   │   ├── Reflections.jsx
│   │   │   └── Progress.jsx
│   │   ├── App.jsx              # Main app component
│   │   ├── main.jsx             # React entry point
│   │   └── index.css            # Global styles
│   ├── e2e/                     # Playwright E2E tests
│   ├── public/                  # Static assets
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── playwright.config.js
├── seed_data.json               # Curriculum data for seeding
├── 100_DAYS_OF_CODE_CURRICULUM.md  # Full learning curriculum
├── README.md                    # This file
└── .gitignore                   # Git ignore rules
```

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

## 🛠️ Tech Stack

### Backend
- **Framework:** FastAPI 0.104.1
- **Server:** Uvicorn 0.24.0
- **Database:** SQLite
- **ORM:** SQLAlchemy 2.0.23
- **Data Validation:** Pydantic 2.5.2

### Frontend
- **Framework:** React 18.2.0
- **Build Tool:** Vite 5.0.0
- **Routing:** React Router 6.20.0
- **Styling:** Tailwind CSS 3.3.5
- **Testing:** Playwright 1.57.0 (E2E)
- **State:** React Hooks & Context API

### Pyodide / SharedArrayBuffer (Cross-Origin Isolation)

Pyodide may require `SharedArrayBuffer`, which is only available when the page is **cross-origin isolated**.

- **Local dev/preview**
  - Vite is configured to send these headers (see `frontend/vite.config.js`):
    - `Cross-Origin-Opener-Policy: same-origin`
    - `Cross-Origin-Embedder-Policy: require-corp`
  - You can verify in the browser console with `window.crossOriginIsolated === true`.
  - There is an E2E guard test in `frontend/tests/e2e/cross-origin-isolation.spec.ts`.

- **Production (Vercel)**
  - The same headers are configured in `vercel.json` under `headers`.
  - Live URL: https://learning-tracker-nu-tan.vercel.app

### Deployment & DevOps
- **Containerization:** Docker (optional)
- **Version Control:** Git
- **Package Managers:** pip (Python), npm (Node.js)  

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

### Prerequisites
- Python 3.9+
- Node.js 16+ and npm
- Git

### Installation & Setup

```bash
# Clone the repository
git clone https://github.com/samueladegoke/Learning_Tracker.git
cd Learning_Tracker
# Learning Tracker 🚀

# ========== BACKEND SETUP ==========
# Create virtual environment
python -m venv venv
source venv/bin/activate          # On Windows: venv\Scripts\activate

# Install dependencies
cd backend
pip install -r requirements.txt

# Seed the database with curriculum data
python seed.py

# Start the API server
uvicorn app.main:app --reload --port 8000

# Backend will be available at: http://localhost:8000
# API docs at: http://localhost:8000/docs

# ========== FRONTEND SETUP (in new terminal) ==========
cd frontend
npm install

# Start development server
npm run dev

# Frontend will be available at: http://localhost:5173
```

---

## 📦 Version Control & Release History

### Current Release: v1.0.0 (MVP)

**Release Date:** November 27, 2025

#### What's Included (MVP Features)
- ✅ Full 32-week learning roadmap loaded from curriculum
- ✅ Dashboard with current week overview and daily task tracker
- ✅ Planner/Roadmap view with expandable weeks and task management
- ✅ Task completion system with XP rewards
- ✅ Weekly reflection/journal system with prompts
- ✅ Progress & Statistics page showing completion %, XP, level, streak
- ✅ Badge/Achievement system with unlock tracking
- ✅ Gamification features (XP, levels, streaks, badges)
- ✅ REST API with complete CRUD operations
- ✅ SQLite database with proper schema
- ✅ Dark-themed responsive UI with Tailwind CSS
- ✅ E2E test suite with Playwright
- ✅ Database seeding with 32-week curriculum

#### Known Limitations
- Single-user system (hardcoded default user)
- No user authentication/authorization
- Streak logic is placeholder (tracks completion, not consecutive days)
- No data export/import functionality
- No mobile-optimized layout
- No real-time notifications

#### Future Enhancements (v1.1+)
- [ ] Multi-user support with authentication
- [ ] Real-time notifications and reminders
- [ ] Advanced analytics and progress charts
- [ ] Mobile app support
- [ ] Data export/import (CSV, JSON)
- [ ] Collaborative learning features
- [ ] Dark/light theme toggle
- [ ] Customizable learning paths
- [ ] Integration with external APIs (GitHub, LeetCode, etc.)

### How to Report Issues
If you find bugs or have feature requests, please:
1. Check existing [Issues](https://github.com/samueladegoke/Learning_Tracker/issues)
2. Create a new issue with:
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs. actual behavior
   - Screenshots/logs if applicable

### Contributing
Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add feature: ...'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📞 Support & Contact

For questions or support, please open an issue on the [GitHub repository](https://github.com/samueladegoke/Learning_Tracker).

---

## 📄 License

This project is open source. Please check the LICENSE file for details.

---

**Built with ❤️ to support your learning journey! Happy coding! 🚀**

### Access the Application
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs

### Available Scripts

**Backend:**
```bash
# Run with auto-reload for development
uvicorn app.main:app --reload

# Seed database with curriculum data
python seed.py
```

**Frontend:**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm test             # Run Playwright E2E tests
npm run test:headed  # Run tests with visible browser
npm run test:ui      # Run tests in UI mode
```  
