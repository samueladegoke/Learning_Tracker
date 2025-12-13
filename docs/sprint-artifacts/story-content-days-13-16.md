---
key: CONTENT-13-16
title: Content Ingestion Days 13-16
status: review
---

# Story: Content Ingestion Days 13-16

**As a** Student
**I want to** access comprehensive learning materials for Days 13, 14, 15, and 16
**So that** I can master Debugging, the Higher Lower Game, the Coffee Machine project, and OOP concepts.

## Acceptance Criteria
1. **Day 13 (Debugging)**: Deep Dive component created and Quiz (20 questions) generated.
2. **Day 14 (Higher Lower)**: Deep Dive component created and Quiz (20 questions) generated.
3. **Day 15 (Coffee Machine)**: Deep Dive component created and Quiz (20 questions) generated.
4. **Day 16 (OOP)**: Deep Dive component created and Quiz (20 questions) generated.
5. **Integration**: `Practice.jsx` updated to include routes/components for all new days.
6. **Verification**: Application builds successfully (`npm run build`).

## Dev Agent Record

### File List
- `frontend/src/components/content/DeepDive/Day13.jsx`
- `frontend/src/components/content/DeepDive/Day14.jsx`
- `frontend/src/components/content/DeepDive/Day15.jsx`
- `frontend/src/components/content/DeepDive/Day16.jsx`
- `scripts/data/questions/day-13.json`
- `scripts/data/questions/day-14.json`
- `scripts/data/questions/day-15.json`
- `scripts/data/questions/day-16.json`
- `frontend/src/pages/Practice.jsx`
- `task.md`

### Change Log
- Generative ingestion of VTT content -> React Components.
- Generative creation of Quiz JSONs.
- Manual router update in Practice.jsx.
- Fixed .env variable naming (`SUPABASE_SERVICE_ROLE_KEY` -> `SUPABASE_SERVICE_KEY`).

## Tasks/Subtasks
- [x] Day 13 Content & Quiz
- [x] Day 14 Content & Quiz
- [x] Day 15 Content & Quiz
- [x] Day 16 Content & Quiz
- [x] Router Integration
- [x] Build Verification
