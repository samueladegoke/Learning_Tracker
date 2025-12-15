# Glossary

**Generated:** 2025-12-10 | **Last Updated:** 2025-12-15

## Gamification Terms
- **XP (Experience Points):** Core metric of progress. Gained by completing tasks and quests. Determines **Level**.
- **Focus Points:** Daily resource (Cap: 5). Used to "buy" ability to do heavy cognitive tasks (conceptually). Refreshes daily.
- **Streak:** Number of consecutive days with at least one task completion.
- **Freeze:** An item that protects a streak from resetting on a missed day.
- **Hearts:** Health metric. Lost by failing interactions (if implemented) or daily decay (if hardcore mode).
- **Gold:** Currency earned via tasks. Used in **Shop**.
- **Level:** User rank derived from XP accumulation. Unlocks badges and visual progression.

## Project Terms
- **Deep Dive:** Specialized curriculum content (e.g., "Day 5 Deep Dive"). Generated React component with topic explanations.
- **Boss Battle:** A special task or set of tasks that must be completed to "defeat" a boss and advance to the next major module.
- **Practice Page:** The main learning interface with tabs for Deep Dive, Quiz, and coding challenges.

## Technical Terms
- **Pyodide:** A port of CPython to WebAssembly/Emscripten, enabling Python to run in the browser. Version `^0.27.5`.
- **Supabase:** PostgreSQL database-as-a-service. Used for production data and direct quiz API access.
- **quiz_id:** Unique identifier for a day's quiz (format: `day-X-practice`).
- **quizApi:** Frontend API module (`src/api/quizApi.js`) that talks directly to Supabase, bypassing FastAPI.

## Question Types
- **MCQ (Multiple Choice Question):** Standard quiz format with 4 options and `correct_index`.
- **Coding:** Interactive Python challenge with `starter_code`, `test_cases`, and `solution_code`.
- **Code-Correction:** MCQ variant where user identifies the fix for buggy code shown in `code` field.

## Architecture Terms (See `architecture.md` for details)
- **Server-First:** Current MVP pattern. Data flows from frontend → FastAPI → Supabase.
- **Local-First:** Phase 2 pattern. Data saved to localStorage first, then synced to backend.
- **SyncManager:** Phase 2 component for background data synchronization (NOT IMPLEMENTED).
- **Web Worker:** JavaScript thread for isolating Pyodide execution from main UI (Phase 2).

