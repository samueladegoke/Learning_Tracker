---
stepsCompleted: [1, 2, 3, 4]
inputDocuments: ['docs/prd.md', 'docs/architecture.md', 'docs/epics.md', 'docs/project_context.md']
workflowType: 'epics-and-stories'
lastStep: 4
status: 'complete'
completedAt: '2026-01-04'
project_name: '100 Days of Code: Learning Tracker'
user_name: 'Sam'
date: '2026-01-04'
phase: 'Phase 2 - Enhancement'
---

# Phase 2 Epics & Stories: 100 Days of Code

## Overview

This document defines **Phase 2 enhancement epics** identified through an ULTRATHINK audit of the deployed MVP against external insights. These epics address gaps in:

1. **Progress/Quiz alignment** - Unify task completion with quiz/challenge progress
2. **Planner flexibility** - Enable granular day-level tracking
3. **Output-driven completion** - Require proof artifacts for task completion
4. **Course abstraction** - Enable multi-course support via admin interface

> **Context:** The MVP is complete and deployed. Phase 2 epics are optional enhancements that would significantly improve the user experience based on real-world feedback.

---

## Requirements Inventory

### New Functional Requirements (Phase 2)

FR15: The System unifies quiz completion with task progress tracking.
FR16: Users can mark individual days as complete (not just weekly groups).
FR17: Users can submit proof artifacts (screenshots, commit links, reflections) to complete tasks.
FR18: Administrators can create custom courses with modules, days, and units.
FR19: The System imports course outlines from structured formats (JSON/YAML).
FR20: Users receive additional XP for submitting proof artifacts.

### New Non-Functional Requirements (Phase 2)

NFR9: Course Builder UI must be responsive (function on mobile and desktop).
NFR10: Artifact uploads must not exceed 5MB per file.
NFR11: Course import must validate structure before saving.

### Additional Requirements

- **From Architecture:** Phase 2 features must integrate with existing Server-First architecture
- **From UX Audit:** Quiz "Next" buttons need min-h-[44px] touch targets (already fixed)
- **From Insights:** Planner should show per-day completion status, not just weekly lumps

---

## FR Coverage Map

| FR | Epic | Stories |
|----|------|---------|
| FR15 | Epic 5 | 5.1, 5.2 |
| FR16 | Epic 6 | 6.1, 6.2 |
| FR17, FR20 | Epic 7 | 7.1, 7.2, 7.3 |
| FR18, FR19 | Epic 8 | 8.1, 8.2, 8.3, 8.4 |

---

## Epic List

1. **Epic 5:** Progress Unification — `[READY FOR DEV]`
2. **Epic 6:** Flexible Planner & Calendar — `[READY FOR DEV]`
3. **Epic 7:** Output-Driven Completion (Proof of Work) — `[READY FOR DEV]`
4. **Epic 8:** Course Builder Abstraction — `[READY FOR DEV]`

---

## Epic 5: Progress Unification

**Goal:** Align quiz/challenge completion with task progress so users see accurate "X of Y tasks done" counts that reflect their actual learning activity.

**Value:** Users currently see "0 of 40 tasks done" even after completing quizzes. This creates confusion and undermines the gamification. Unifying these metrics provides accurate progress feedback.

**FRs Covered:** FR15

---

### Story 5.1: Automatic Task Completion on Quiz Pass

As a **Learner**,
I want my daily task to be marked complete when I pass the quiz,
So that my progress tracking reflects my actual accomplishments.

**Acceptance Criteria:**

**Given** the user is on the Practice page for Day X
**When** they complete the quiz with a passing score (≥70%)
**Then** the corresponding task for Day X should be marked as complete
**And** XP should be awarded once (not double-counted from task + quiz)
**And** the Dashboard should reflect the updated task count immediately

**Technical Notes:**
- Modify `POST /api/quizzes/verify` to call task completion logic
- Ensure idempotency (re-completing quiz doesn't duplicate XP)
- Update `getProgress()` to consider quiz completion status

---

### Story 5.2: Progress Page Quiz Integration

As a **Learner**,
I want the Progress page to show my quiz scores alongside task completion,
So that I can see a complete picture of my learning journey.

**Acceptance Criteria:**

**Given** the user navigates to the Progress page
**When** the page loads
**Then** display a "Quiz Mastery" section showing:
  - Days completed via quiz (count)
  - Average quiz score across all attempts
  - Best quiz score (leaderboard entry)
**And** the "tasks done" count should match actual quiz completions

**Technical Notes:**
- Query `user_question_status` aggregate data
- Create new `/api/progress/quiz-stats` endpoint
- Update `Progress.jsx` to fetch and display quiz stats

---

## Epic 6: Flexible Planner & Calendar

**Goal:** Enable granular day-level tracking in the Planner and show detailed completion status in the Calendar.

**Value:** The current Planner groups multiple days into single tasks (e.g., "Complete Days 1–3"), which makes learners feel blocked. Breaking these into individual days provides psychological wins and clearer progress.

**FRs Covered:** FR16

---

### Story 6.1: Day-Level Planner Breakdown

As a **Learner**,
I want to see each day as a separate completable item in the Planner,
So that I can track my progress with finer granularity.

**Acceptance Criteria:**

**Given** the user navigates to the Planner page
**When** they expand a week accordion
**Then** display each individual day (1-100) as a separate task row
**And** each day shows its completion status independently
**And** the week progress bar reflects the count of completed days within that week

**Technical Notes:**
- Modify `WeekAccordion.jsx` to render day-level items
- Update `/api/weeks/{id}` to return day-level completion data
- Consider lazy loading days to optimize performance

---

### Story 6.2: Calendar Day Status Annotations

As a **Learner**,
I want the Calendar to show which specific activities I completed each day,
So that I can see patterns in my learning (quiz days vs. project days).

**Acceptance Criteria:**

**Given** the user navigates to the Calendar page
**When** they view a date cell for a completed day
**Then** display icons indicating completed activities:
  - 📚 Deep Dive read
  - ✅ Quiz passed
  - 💻 Challenge submitted
**And** hovering on the date shows a tooltip with details
**And** "missed" days show a different indicator (e.g., red outline)

**Technical Notes:**
- Extend calendar API to include activity type per day
- Add tooltip component with activity breakdown
- Update `completion_dates` structure to include activity metadata

---

## Epic 7: Output-Driven Completion (Proof of Work)

**Goal:** Encourage authentic learning by requiring proof artifacts (screenshots, commits, reflections) to complete tasks and earn bonus XP.

**Value:** Currently tasks can be marked complete without proof. Requiring artifacts ensures users actually engage with the material and creates a portfolio of their learning journey.

**FRs Covered:** FR17, FR20

---

### Story 7.1: Artifact Submission UI

As a **Learner**,
I want to submit proof of my work (screenshot, commit link, or reflection) when completing a task,
So that I can demonstrate my learning and earn bonus XP.

**Acceptance Criteria:**

**Given** the user completes a quiz or challenge
**When** they click "Complete Day"
**Then** display an optional artifact submission modal with options:
  - Upload screenshot (PNG/JPG, max 5MB)
  - Paste GitHub commit URL
  - Write a short reflection (min 50 characters)
**And** allow skipping artifact submission (reduced XP)
**And** award +10 bonus XP for artifact submission

**Technical Notes:**
- Create `ArtifactSubmissionModal.jsx` component
- Use Supabase Storage for file uploads
- Create `user_artifacts` table with `user_id`, `day`, `type`, `content`

---

### Story 7.2: Backend Artifact Storage

As a **System**,
I want to store and validate proof artifacts securely,
So that users can review their learning portfolio later.

**Acceptance Criteria:**

**Given** a user submits an artifact
**When** the `POST /api/artifacts` endpoint is called
**Then** validate the artifact type and size
**And** store metadata in `user_artifacts` table
**And** upload files to Supabase Storage bucket `artifacts`
**And** return the artifact ID and storage URL

**Technical Notes:**
- Create Alembic migration for `user_artifacts` table
- Implement file validation (type, size)
- Configure Supabase Storage policies for authenticated users

---

### Story 7.3: Portfolio View

As a **Learner**,
I want to view all my submitted artifacts in one place,
So that I can reflect on my learning journey and share my portfolio.

**Acceptance Criteria:**

**Given** the user navigates to a new "Portfolio" page (or Progress sub-tab)
**When** the page loads
**Then** display a gallery of all submitted artifacts grouped by week
**And** for each artifact, show:
  - Day number and title
  - Artifact preview (thumbnail for images, link for URLs)
  - Submission date
  - XP earned

**Technical Notes:**
- Create `/api/artifacts` GET endpoint for user artifacts
- Create `Portfolio.jsx` page or integrate into `Progress.jsx`
- Implement image thumbnail generation

---

## Epic 8: Course Builder Abstraction

**Goal:** Transform the hardcoded "100 Days of Code" curriculum into a flexible course system that admins can customize and extend.

**Value:** Currently all content is hardcoded. A Course Builder enables creating custom learning tracks, importing external curricula, and adapting the platform to different learning programs.

**FRs Covered:** FR18, FR19

---

### Story 8.1: Course Data Model

As an **Administrator**,
I want a flexible course data model that supports modules, days, and units,
So that the platform can host multiple courses.

**Acceptance Criteria:**

**Given** the database is migrated
**When** the admin creates a course
**Then** the system supports this hierarchy:
  - Course (name, description, total_days)
    - Module (week/section, title, focus)
      - Day (number, title, description)
        - Unit (type: deep_dive|quiz|challenge, content)
**And** existing "100 Days of Code" data is migrated to this structure

**Technical Notes:**
- Create Alembic migrations for `courses`, `modules`, `days`, `units` tables
- Write data migration script for existing content
- Update all existing routers to query by course_id

---

### Story 8.2: Course Admin CRUD API

As an **Administrator**,
I want API endpoints to create, read, update, and delete courses,
So that I can manage course content programmatically.

**Acceptance Criteria:**

**Given** the admin is authenticated with admin role
**When** they call course management endpoints
**Then** support the following operations:
  - `POST /api/admin/courses` - Create course
  - `GET /api/admin/courses` - List all courses
  - `GET /api/admin/courses/{id}` - Get course with modules/days/units
  - `PUT /api/admin/courses/{id}` - Update course metadata
  - `DELETE /api/admin/courses/{id}` - Soft delete course
**And** validate admin JWT claims before allowing mutations

**Technical Notes:**
- Create `app/routers/admin/courses.py` with CRUD operations
- Implement role-based access control (RBAC) middleware
- Add `is_admin` flag to User model

---

### Story 8.3: Course Import from JSON/YAML

As an **Administrator**,
I want to import a course outline from a structured file,
So that I can quickly create courses without manual data entry.

**Acceptance Criteria:**

**Given** the admin uploads a JSON or YAML file via admin interface
**When** the import endpoint processes the file
**Then** validate the structure matches expected schema:
  ```yaml
  name: "My Course"
  description: "Course description"
  modules:
    - title: "Week 1"
      focus: "Basics"
      days:
        - number: 1
          title: "Introduction"
          units:
            - type: "deep_dive"
              content: "Markdown content..."
  ```
**And** report validation errors before import
**And** create all records transactionally (all-or-nothing)
**And** return created course ID on success

**Technical Notes:**
- Create `POST /api/admin/courses/import` endpoint
- Implement JSON Schema or Pydantic validation
- Use SQLAlchemy nested transactions

---

### Story 8.4: Course Selector UI

As a **Learner**,
I want to select which course I'm enrolled in,
So that I can switch between different learning tracks.

**Acceptance Criteria:**

**Given** the platform has multiple courses available
**When** the user visits the Dashboard
**Then** display a course selector dropdown in the header
**And** persist the selected course in user preferences
**And** all pages (Planner, Practice, Progress) filter by active course
**And** default to "100 Days of Code" for existing users

**Technical Notes:**
- Add `active_course_id` to User model
- Create `CourseContext` in React for active course state
- Update `useCourse()` hook to respect selected course
- Update all API calls to include `course_id` parameter

---

## Implementation Priority

| Epic | Priority | Dependencies | Estimated Stories |
|------|----------|--------------|-------------------|
| Epic 5: Progress Unification | 🔥 HIGH | None | 2 stories |
| Epic 6: Flexible Planner | 🟡 MEDIUM | Epic 5 | 2 stories |
| Epic 7: Proof of Work | 🟡 MEDIUM | None | 3 stories |
| Epic 8: Course Builder | 🧊 LOW | None | 4 stories |

**Recommended Sequence:**
1. Epic 5 (quick win, high impact on user perception)
2. Epic 7 (differentiating feature, builds engagement)
3. Epic 6 (enhancement, depends on Epic 5 data)
4. Epic 8 (foundational for scale, but complex)

---

## Verification Plan

### Automated Tests
- E2E: Extend Playwright tests for new quiz→task flow
- API: pytest for new endpoints (`/api/artifacts`, `/api/admin/courses`)
- Component: Vitest for new React components

### Manual Verification
1. Complete a quiz and verify task auto-completes
2. Check Progress page shows unified counts
3. Submit an artifact and verify XP bonus
4. Import a test course via admin API

---

**Document Status:** COMPLETE ✅ | Ready for Sprint Planning
**Last Updated:** 2026-01-04
