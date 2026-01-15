# Supabase to Convex Migration

## Context

### Original Request
Migrate the 100 Days of Code Learning Tracker from Supabase (PostgreSQL + Auth) to Convex with Clerk authentication. Full replacement of FastAPI backend with Convex serverless functions.

### Interview Summary

**Key Discussions**:
- **Current Architecture**: React+Vite frontend calls FastAPI+SQLAlchemy backend. Supabase used only as PostgreSQL host (no SDK) and for auth JWT tokens.
- **Backend has NO Supabase SDK usage**: Pure SQLAlchemy ORM with 10 routers, 20+ models
- **Migration Drivers**: Real-time reactivity, simplified architecture, better DX, cost optimization, learning
- **User Scenario**: Single user - link existing data to new Clerk ID
- **File Storage**: No files in UserArtifact - no migration needed
- **Quiz Data**: Script-seeded from JSON - can re-seed to Convex

**Research Findings**:
- 20+ SQLAlchemy models with complex relationships (User as hub with 8+ junction tables)
- SM2 spaced repetition: `SRS_INTERVALS = [1, 3, 7, 14]`, mastery = 3+ successes at max interval
- XP formula: `100 * level^1.2` (shared between FE/BE)
- Task completion is atomic transaction: XP + gold + badges + achievements + quest damage in single commit
- Test infrastructure: Vitest + Playwright (frontend), Pytest (backend)
- Convex testing: `convex-test` library with Vitest

### Metis Review

**Identified Gaps** (addressed):
- User ID mapping: Single user scenario - simple linking
- Rollback strategy: Full PostgreSQL backup before cutover
- File storage: Confirmed no files to migrate
- Quiz data: Script-seeded, can re-seed to Convex

---

## Work Objectives

### Core Objective
Replace the FastAPI + SQLAlchemy + Supabase stack with Convex serverless functions and Clerk authentication, while preserving all existing functionality and enabling real-time reactivity.

### Concrete Deliverables
- `convex/` directory with schema.ts and all function modules
- Clerk integration with ConvexProviderWithClerk
- All 10 router equivalents as Convex queries/mutations
- Data migration scripts and verification
- Updated frontend using Convex React hooks
- Removal of FastAPI backend and Supabase dependencies

### Definition of Done
- [x] `npm run dev` starts Convex dev server
- [x] All 32 curriculum weeks load via Convex
- [x] Task completion awards XP/gold/badges atomically
- [x] Quest damage applies correctly
- [x] SRS daily review returns correct due questions
- [ ] Real-time updates visible within 200ms on Dashboard
- [ ] All existing Playwright E2E tests pass
- [ ] Production deployed to Vercel with Convex

### Must Have
- Atomic task completion (XP + badges + quests in single mutation)
- SM2 algorithm with exact intervals `[1, 3, 7, 14]`
- XP formula: `100 * level^1.2`
- Streak calculation (consecutive days)
- Dev mode auth bypass for local testing
- Full PostgreSQL backup before migration

### Must NOT Have (Guardrails)
- ❌ Auth migration before schema is stable
- ❌ Delete Supabase before full verification
- ❌ Production deployment before staging verification
- ❌ Redesign gamification formulas (port exactly, refactor later)
- ❌ Add new auth features (SSO, OAuth providers beyond current)
- ❌ Expand test coverage scope (port existing tests only)
- ❌ Use Convex Ents (evaluate for v2, use vanilla Convex first)

---

## Verification Strategy (MANDATORY)

### Test Decision
- **Infrastructure exists**: YES (Vitest + Playwright)
- **User wants tests**: YES
- **Framework**: Vitest + convex-test for Convex functions, Playwright for E2E

### Testing Pattern

**Convex Functions (convex-test):**
```typescript
import { convexTest } from "convex-test";
import schema from "./schema";

const t = convexTest(schema);

test("completeTask awards XP", async () => {
  await t.run(async (ctx) => {
    // Setup user and task
    // Call mutation
    // Assert XP increased
  });
});
```

**React Components:**
Use @testing-library/react with mocked Convex hooks

**E2E:**
Keep existing Playwright tests, update selectors as needed

---

## Task Flow

```
Phase 1 (Foundation)
    ↓
Phase 2 (Curriculum) → Phase 3 (Gamification)
                           ↓
                    Phase 4 (RPG)
                           ↓
                    Phase 5 (Learning)
                           ↓
                    Phase 6 (Data Migration)
                           ↓
                    Phase 7 (Cleanup)
```

## Parallelization

| Group | Tasks | Reason |
|-------|-------|--------|
| A | 2.1, 2.2 | Schema and queries are independent |
| B | 3.1, 3.2 | User schema and badge schema independent |
| C | 5.1, 5.2 | SRS and Quiz modules independent |

| Task | Depends On | Reason |
|------|------------|--------|
| All Phase 2+ | 1.3 | Need Convex + Clerk working first |
| 4.* | 3.1 | RPG needs User gamification fields |
| 6.* | All 2-5 | Data migration needs all schemas complete |
| 7.* | 6.3 | Cleanup only after verification |

---

## TODOs

### Phase 1: Foundation (Week 1)

- [x] 1.1. Initialize Convex Project

  **What to do**:
  - Run `npx convex dev` to initialize project
  - Login to Convex dashboard
  - Create `convex/schema.ts` with basic structure
  - Verify dev server starts

  **Must NOT do**:
  - Don't create all tables yet - just foundation
  - Don't configure production yet

  **Parallelizable**: NO (first task)

  **References**:
  
  **Pattern References**:
  - `frontend/.env` lines with `CONVEX_ACCESS_KEY` - Existing key location
  
  **External References**:
  - Convex docs: https://docs.convex.dev/quickstart - Initialization guide
  
  **Acceptance Criteria**:
  - [ ] `convex/` directory created with `_generated/`, `schema.ts`
  - [ ] `npx convex dev` runs without error
  - [ ] Convex dashboard shows project at https://dashboard.convex.dev

  **Commit**: YES
  - Message: `feat(convex): initialize convex project`
  - Files: `convex/`, `package.json`, `.env.local`

---

- [x] 1.2. Setup Clerk Authentication

  **What to do**:
  - Create Clerk application at clerk.com
  - Install `@clerk/clerk-react` and `@clerk/nextjs` (if needed)
  - Configure Clerk environment variables
  - Create Clerk webhook for user sync (optional for single user)

  **Must NOT do**:
  - Don't add OAuth providers beyond email/password
  - Don't configure SSO

  **Parallelizable**: YES (with 1.1 after initialization)

  **References**:
  
  **Pattern References**:
  - `frontend/src/lib/supabase.js` - Current auth pattern to replace
  - `backend/app/auth.py:get_current_user()` lines 45-78 - JWT validation pattern
  
  **External References**:
  - Clerk + Convex docs: https://docs.convex.dev/auth/clerk
  
  **Acceptance Criteria**:
  - [ ] Clerk dashboard shows application
  - [ ] `CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` in `.env.local`
  - [ ] `clerk.com` → Webhooks configured (if using user sync)

  **Commit**: YES
  - Message: `feat(auth): setup clerk authentication`
  - Files: `.env.local`, `package.json`

---

- [x] 1.3. Integrate ConvexProviderWithClerk

  **What to do**:
  - Wrap app with `ClerkProvider` and `ConvexProviderWithClerk`
  - Create `convex/auth.config.ts` for Clerk integration
  - Implement dev mode bypass: if no auth, use test user identity
  - Test that `ctx.auth.getUserIdentity()` returns identity

  **Must NOT do**:
  - Don't remove old AuthContext yet - keep for reference
  - Don't break existing app functionality

  **Parallelizable**: NO (depends on 1.1 and 1.2)

  **References**:
  
  **Pattern References**:
  - `frontend/src/main.jsx` - App entry point, provider location
  - `frontend/src/contexts/AuthContext.jsx` - Current auth context pattern
  - `backend/app/auth.py:24-32` - Dev mode bypass pattern (`ENABLE_AUTH=False`)
  
  **External References**:
  - Convex + Clerk: https://docs.convex.dev/auth/clerk
  
  **Acceptance Criteria**:
  - [ ] App renders with ConvexProviderWithClerk
  - [ ] Using Playwright: Navigate to app, verify no console auth errors
  - [ ] Create test mutation that logs `ctx.auth.getUserIdentity()` - returns identity
  - [ ] With `ENABLE_AUTH=false` in dev, app still functions (dev bypass)

  **Commit**: YES
  - Message: `feat(auth): integrate convex with clerk provider`
  - Files: `frontend/src/main.jsx`, `convex/auth.config.ts`

---

### Phase 2: Curriculum (Week 2)

- [ ] 2.1. Create Curriculum Schema

  **What to do**:
  - Define `courses`, `weeks`, `tasks` tables in `convex/schema.ts`
  - Create indexes: `weeks.by_course`, `tasks.by_week`
  - Match SQLAlchemy model fields exactly
  - Run `npx convex dev` to push schema

  **Must NOT do**:
  - Don't include user-specific tables yet (UserTaskStatus)
  - Don't change field names or types from SQLAlchemy

  **Parallelizable**: NO (first schema task)

  **References**:
  
  **Pattern References**:
  - `backend/app/models.py:Course` lines 20-35 - Course SQLAlchemy model
  - `backend/app/models.py:Week` lines 37-55 - Week model with fields
  - `backend/app/models.py:Task` lines 57-90 - Task model, note all fields
  
  **External References**:
  - Convex schema docs: https://docs.convex.dev/database/schemas
  
  **Acceptance Criteria**:
  - [ ] `convex/schema.ts` exports tables: courses, weeks, tasks
  - [ ] `npx convex dev` → "Schema pushed" without errors
  - [ ] Convex dashboard → Tables show courses, weeks, tasks with correct columns

  **Commit**: YES
  - Message: `feat(schema): add curriculum tables (courses, weeks, tasks)`
  - Files: `convex/schema.ts`

---

- [ ] 2.2. Create UserTaskStatus Schema

  **What to do**:
  - Add `userTaskStatuses` table with user_id, task_id, completed, completed_at
  - Create compound index: `by_user_and_task`
  - Define relationship fields using `v.id("users")`, `v.id("tasks")`

  **Must NOT do**:
  - Don't implement completion logic yet

  **Parallelizable**: YES (with 2.1 if done simultaneously)

  **References**:
  
  **Pattern References**:
  - `backend/app/models.py:UserTaskStatus` lines 92-115 - Junction table model
  - `backend/app/models.py` line 102 - Composite unique index pattern
  
  **Acceptance Criteria**:
  - [ ] `userTaskStatuses` table in schema with correct fields
  - [ ] Index `by_user_and_task` defined
  - [ ] `npx convex dev` → Schema pushed

  **Commit**: YES (group with 2.1)
  - Message: `feat(schema): add userTaskStatuses table`
  - Files: `convex/schema.ts`

---

- [x] 2.3. Implement Curriculum Queries

  **What to do**:
  - Create `convex/curriculum.ts` with queries:
    - `getWeeks`: List all weeks for a course
    - `getTasks`: List tasks for a week
    - `getWeekProgress`: Count completed tasks per week
  - Use `ctx.db.query()` with indexes

  **Must NOT do**:
  - Don't implement mutations yet
  - Don't add user-specific data yet

  **Parallelizable**: NO (depends on 2.1)

  **References**:
  
  **Pattern References**:
  - `backend/app/routers/weeks.py` - Week query patterns
  - `frontend/src/api/client.js:weeksAPI` lines 45-60 - Current API shape

  **External References**:
  - Convex queries: https://docs.convex.dev/functions/query-functions
  
  **Acceptance Criteria**:
  - [ ] `convex/curriculum.ts` exports `getWeeks`, `getTasks`, `getWeekProgress`
  - [ ] Using Convex dashboard Functions tab: Run `getWeeks` → returns array
  - [ ] Test: `npm run test` for curriculum.test.ts passes (3 query tests)

  **Commit**: YES
  - Message: `feat(curriculum): implement week and task queries`
  - Files: `convex/curriculum.ts`, `convex/curriculum.test.ts`

---

- [x] 2.4. Update Frontend to Use Convex Curriculum

  **What to do**:
  - Replace `weeksAPI.getAll()` calls with `useQuery(api.curriculum.getWeeks)`
  - Update WeeksList component
  - Update TaskList component
  - Keep old API code commented for reference

  **Must NOT do**:
  - Don't remove old API client yet
  - Don't change UI layout

  **Parallelizable**: NO (depends on 2.3)

  **References**:
  
  **Pattern References**:
  - `frontend/src/pages/Dashboard.jsx` - Uses weeksAPI
  - `frontend/src/components/WeeksList.jsx` - Week display component
  - `frontend/src/api/client.js:weeksAPI` - Old API to replace

  **External References**:
  - Convex React: https://docs.convex.dev/client/react
  
  **Acceptance Criteria**:
  - [ ] Dashboard loads weeks from Convex (Network tab shows Convex WebSocket, not /api/weeks)
  - [ ] Using Playwright: `page.goto('/dashboard')` → weeks visible within 2s
  - [ ] Console shows no "weeksAPI" fetch requests

  **Commit**: YES
  - Message: `refactor(frontend): use convex for curriculum queries`
  - Files: `frontend/src/pages/Dashboard.jsx`, `frontend/src/components/WeeksList.jsx`

---

### Phase 3: Gamification (Week 2-3)

- [x] 3.1. Create Gamification Schema

  **What to do**:
  - Add `users` table with ALL gamification fields:
    - xp, level, gold, streak, hearts, focus_points
    - streak_freeze_active, last_activity_date
    - clerk_user_id (identity mapping)
  - Create index: `by_clerk_id`
  - Add helper functions for XP→Level calculation

  **Must NOT do**:
  - Don't change XP formula: `100 * level^1.2`
  - Don't add fields not in SQLAlchemy model

  **Parallelizable**: NO (foundational for all gamification)

  **References**:
  
  **Pattern References**:
  - `backend/app/models.py:User` lines 120-180 - All user fields
  - `backend/app/utils/gamification.py` lines 20-25 - XP formula: `100 * (level ** 1.2)`

  **Acceptance Criteria**:
  - [ ] `users` table in schema with 15+ gamification fields
  - [ ] XP formula function: `levelFromXP(1500)` returns expected level
  - [ ] `npx convex dev` → Schema pushed

  **Commit**: YES
  - Message: `feat(schema): add users table with gamification fields`
  - Files: `convex/schema.ts`, `convex/lib/xp.ts`

---

- [x] 3.2. Create Badge/Achievement Schema

  **What to do**:
  - Add tables: `badges`, `achievements`, `userBadges`, `userAchievements`
  - Match all fields from SQLAlchemy models
  - Create indexes for efficient user queries

  **Must NOT do**:
  - Don't implement unlock logic yet

  **Parallelizable**: YES (with 3.1)

  **References**:
  
  **Pattern References**:
  - `backend/app/models.py:Badge` lines 200-220 - Badge model
  - `backend/app/models.py:Achievement` lines 222-245 - Achievement model
  - `backend/app/models.py:UserBadge` lines 247-260 - Junction table
  - `backend/app/routers/badges.py` - Badge query patterns

  **Acceptance Criteria**:
  - [ ] 4 tables created: badges, achievements, userBadges, userAchievements
  - [ ] Indexes: `userBadges.by_user`, `userAchievements.by_user`
  - [ ] `npx convex dev` → Schema pushed

  **Commit**: YES
  - Message: `feat(schema): add badge and achievement tables`
  - Files: `convex/schema.ts`

---

- [x] 3.3. Implement Task Completion Mutation (CRITICAL)

  **What to do**:
  - Create `convex/tasks.ts:completeTask` mutation
  - Port EXACT logic from `backend/app/routers/tasks.py:_complete_task_internal`
  - MUST be atomic: XP + gold + badges + achievements + quest damage
  - Implement streak calculation (consecutive days)
  - Implement badge award logic (STREAK_BADGES mapping)

  **Must NOT do**:
  - Don't simplify the logic - port exactly
  - Don't skip any award conditions
  - Don't break atomicity

  **Parallelizable**: NO (critical path, needs 3.1 + 3.2)

  **References**:
  
  **Pattern References**:
  - `backend/app/routers/tasks.py:287-473` - Complete task logic (187 lines)
  - `backend/app/routers/tasks.py:62-75` - Quest damage calculation
  - `backend/app/routers/tasks.py:217-252` - Streak recalculation
  - `backend/app/routers/tasks.py:DIFFICULTY_MULTIPLIER` line 25 - XP multipliers
  - `backend/app/routers/tasks.py:STREAK_BADGES` line 30 - Streak thresholds
  
  **External References**:
  - Convex mutations: https://docs.convex.dev/functions/mutation-functions
  
  **Acceptance Criteria**:
  - [ ] `completeTask` mutation exists in `convex/tasks.ts`
  - [ ] Test: Complete task with difficulty "hard" → XP += base * 1.5
  - [ ] Test: Complete 7 tasks consecutively → streak badge awarded
  - [ ] Test: Transaction rollback on error (simulate failure, verify no partial state)
  - [ ] convex-test: 5 tests pass for completeTask scenarios

  **Commit**: YES
  - Message: `feat(tasks): implement atomic task completion mutation`
  - Files: `convex/tasks.ts`, `convex/tasks.test.ts`

---

- [x] 3.4. Implement Uncomplete Task Mutation

  **What to do**:
  - Create `convex/tasks.ts:uncompleteTask` mutation
  - Port rollback logic from `backend/app/routers/tasks.py:uncomplete_task`
  - Reverse XP, gold, streak, quest damage, challenge progress

  **Must NOT do**:
  - Don't skip rollback of any component

  **Parallelizable**: YES (with 3.3 after it's started)

  **References**:
  
  **Pattern References**:
  - `backend/app/routers/tasks.py:551-646` - Uncomplete task logic
  - `backend/app/routers/tasks.py:uncomplete_task` - Entry point
  
  **Acceptance Criteria**:
  - [ ] `uncompleteTask` mutation in `convex/tasks.ts`
  - [ ] Test: Complete then uncomplete → XP returns to original
  - [ ] Test: Uncomplete breaks streak → streak resets
  - [ ] convex-test: 3 tests pass

  **Commit**: YES (group with 3.3)
  - Message: `feat(tasks): implement uncomplete task mutation`
  - Files: `convex/tasks.ts`, `convex/tasks.test.ts`

---

- [x] 3.5. Update Frontend Task Completion

  **What to do**:
  - Replace `tasksAPI.complete()` with `useMutation(api.tasks.completeTask)`
  - Add optimistic updates for instant UI feedback
  - Implement real-time subscription for dashboard stats

  **Must NOT do**:
  - Don't change task completion UX flow

  **Parallelizable**: NO (depends on 3.3)

  **References**:
  
  **Pattern References**:
  - `frontend/src/pages/DayDetail.jsx` - Task completion UI
  - `frontend/src/api/client.js:tasksAPI.complete` - Old API
  - `frontend/src/contexts/CourseContext.jsx` - State management
  
  **Acceptance Criteria**:
  - [ ] Click task checkbox → mutation fires (Network tab shows Convex)
  - [ ] XP counter updates in <200ms (real-time)
  - [ ] Using Playwright: Complete task, verify XP increase visible immediately
  - [ ] Console shows no tasksAPI fetch requests

  **Commit**: YES
  - Message: `refactor(frontend): use convex for task completion`
  - Files: `frontend/src/pages/DayDetail.jsx`, `frontend/src/components/TaskCheckbox.jsx`

---

### Phase 4: RPG System (Week 3)

- [x] 4.1. Create Quest/Challenge Schema

  **What to do**:
  - Add tables: `quests`, `questTasks`, `userQuests`
  - Add tables: `challenges`, `userChallenges`
  - Add `userInventory` table for shop items
  - Create all necessary indexes

  **Must NOT do**:
  - Don't implement shop logic yet

  **Parallelizable**: NO (depends on 3.1)

  **References**:
  
  **Pattern References**:
  - `backend/app/models.py:Quest` lines 280-310 - Quest model
  - `backend/app/models.py:QuestTask` lines 312-330 - M2M junction
  - `backend/app/models.py:UserQuest` lines 332-355 - User progress
  - `backend/app/models.py:Challenge` lines 360-390 - Challenge model
  - `backend/app/models.py:UserInventory` lines 400-420 - Inventory
  
  **Acceptance Criteria**:
  - [ ] 6 tables created for RPG system
  - [ ] `npx convex dev` → Schema pushed
  - [ ] Indexes: `userQuests.by_user`, `userChallenges.by_user`

  **Commit**: YES
  - Message: `feat(schema): add quest, challenge, and inventory tables`
  - Files: `convex/schema.ts`

---

- [x] 4.2. Implement RPG State Query

  **What to do**:
  - Create `convex/rpg.ts:getRPGState` query
  - Return: XP, level, gold, streak, focus_points, hearts
  - Include: active_quest, active_challenges, inventory
  - Make it real-time reactive

  **Must NOT do**:
  - Don't include mutations yet

  **Parallelizable**: NO (depends on 4.1)

  **References**:
  
  **Pattern References**:
  - `backend/app/routers/rpg.py:get_rpg_state` lines 20-65 - RPG state query
  - `frontend/src/components/RPGWidget.jsx` - Consumer of RPG state
  
  **Acceptance Criteria**:
  - [ ] `getRPGState` query returns all required fields
  - [ ] Using Playwright: Navigate to dashboard, RPG widget shows stats
  - [ ] Real-time: Update XP in dashboard, widget updates without refresh

  **Commit**: YES
  - Message: `feat(rpg): implement getRPGState query`
  - Files: `convex/rpg.ts`

---

- [x] 4.3. Implement Shop Mutations

  **What to do**:
  - Create `convex/rpg.ts:buyItem` mutation
  - Implement items: streak_freeze, potion_focus, heart_refill
  - Deduct gold, add to inventory, apply effects

  **Must NOT do**:
  - Don't add new shop items
  - Don't change item prices

  **Parallelizable**: YES (with 4.2 after 4.1)

  **References**:
  
  **Pattern References**:
  - `backend/app/routers/rpg.py:buy_item` lines 75-130 - Shop logic
  - `backend/app/routers/rpg.py` line 80 - Item prices dict
  
  **Acceptance Criteria**:
  - [ ] `buyItem` mutation for all 3 items
  - [ ] Test: Buy streak_freeze with 50 gold → gold -50, inventory +1
  - [ ] Test: Insufficient gold → mutation throws error
  - [ ] convex-test: 4 shop tests pass

  **Commit**: YES
  - Message: `feat(rpg): implement shop buyItem mutation`
  - Files: `convex/rpg.ts`, `convex/rpg.test.ts`

---

- [x] 4.4. Integrate Quest Damage with Task Completion

  **What to do**:
  - Update `completeTask` to call quest damage logic
  - Port `apply_quest_damage` function
  - Handle boss HP reduction and quest completion

  **Must NOT do**:
  - Don't break task completion atomicity

  **Parallelizable**: NO (modifies 3.3)

  **References**:
  
  **Pattern References**:
  - `backend/app/routers/tasks.py:62-75` - apply_quest_damage
  - `backend/app/routers/tasks.py:435-450` - Quest damage in complete flow
  
  **Acceptance Criteria**:
  - [ ] Complete task → boss HP decreases
  - [ ] Boss HP reaches 0 → quest completed, bonus XP awarded
  - [ ] Test: 5 task completions reduce boss HP proportionally

  **Commit**: YES
  - Message: `feat(tasks): integrate quest damage into task completion`
  - Files: `convex/tasks.ts`, `convex/lib/quests.ts`

---

### Phase 5: Learning System (Week 4)

- [x] 5.1. Create SRS Schema

  **What to do**:
  - Add `questions` table with options, test_cases (JSON fields)
  - Add `userQuestionReviews` table for SRS state
  - Create indexes: `by_user_and_due_date`, `by_question`

  **Must NOT do**:
  - Don't change SRS_INTERVALS: `[1, 3, 7, 14]`

  **Parallelizable**: YES (independent of Phase 4)

  **References**:
  
  **Pattern References**:
  - `backend/app/models.py:Question` lines 430-460 - Question model
  - `backend/app/models.py:UserQuestionReview` lines 462-490 - SRS state
  - `backend/app/routers/spaced_repetition.py:SRS_INTERVALS` line 15
  
  **Acceptance Criteria**:
  - [ ] `questions` table with options as JSON field
  - [ ] `userQuestionReviews` with interval_index, consecutive_successes, next_review_date
  - [ ] Index for due date queries

  **Commit**: YES
  - Message: `feat(schema): add questions and SRS review tables`
  - Files: `convex/schema.ts`

---

- [x] 5.2. Implement SM2 Spaced Repetition

  **What to do**:
  - Create `convex/srs.ts` with queries and mutations
  - `getDailyReview`: Get max 10 due questions
  - `submitReviewResult`: Advance/reset intervals
  - Port SM2 algorithm EXACTLY

  **Must NOT do**:
  - Don't modify mastery conditions (3+ at max interval)
  - Don't change intervals from `[1, 3, 7, 14]`

  **Parallelizable**: YES (with 5.1)

  **References**:
  
  **Pattern References**:
  - `backend/app/routers/spaced_repetition.py:SRS_INTERVALS` line 15 - Intervals
  - `backend/app/routers/spaced_repetition.py:get_daily_review` lines 30-65
  - `backend/app/routers/spaced_repetition.py:submit_review_result` lines 70-120
  - `backend/app/routers/spaced_repetition.py` line 95 - Mastery condition
  
  **Acceptance Criteria**:
  - [ ] `getDailyReview` returns max 10 questions due today
  - [ ] Correct answer → interval advances (1→3→7→14 days)
  - [ ] Incorrect answer → interval resets to 1
  - [ ] 3 correct at interval 14 → mastered flag set
  - [ ] convex-test: 6 SRS tests pass

  **Commit**: YES
  - Message: `feat(srs): implement SM2 spaced repetition`
  - Files: `convex/srs.ts`, `convex/srs.test.ts`

---

- [x] 5.3. Implement Quiz Queries

  **What to do**:
  - Create `convex/quizzes.ts` with quiz-related queries
  - Get questions by week, by type
  - Record quiz results

  **Must NOT do**:
  - Don't change quiz scoring logic

  **Parallelizable**: YES (with 5.2)

  **References**:
  
  **Pattern References**:
  - `backend/app/routers/quizzes.py` - Quiz queries and mutations
  - `frontend/src/pages/Practice.jsx` - Quiz UI consumer
  
  **Acceptance Criteria**:
  - [ ] `getQuizQuestions` returns questions for a week
  - [ ] `submitQuizResult` records score
  - [ ] convex-test: 3 quiz tests pass

  **Commit**: YES
  - Message: `feat(quizzes): implement quiz queries and mutations`
  - Files: `convex/quizzes.ts`, `convex/quizzes.test.ts`

---

- [x] 5.4. Update Frontend for SRS and Quizzes

  **What to do**:
  - Replace srsAPI calls with Convex queries/mutations
  - Replace quizzesAPI calls
  - Add real-time updates for mastery progress

  **Must NOT do**:
  - Don't change Practice page layout

  **Parallelizable**: NO (depends on 5.2, 5.3)

  **References**:
  
  **Pattern References**:
  - `frontend/src/pages/Practice.jsx` - Practice/Quiz UI
  - `frontend/src/api/client.js:srsAPI` - Old SRS API
  - `frontend/src/api/client.js:quizzesAPI` - Old Quiz API
  
  **Acceptance Criteria**:
  - [ ] Practice page loads questions from Convex
  - [ ] Submit answer → interval updates in real-time
  - [ ] Using Playwright: Complete review session, verify mastery count updates

  **Commit**: YES
  - Message: `refactor(frontend): use convex for SRS and quizzes`
  - Files: `frontend/src/pages/Practice.jsx`, `frontend/src/components/ReviewCard.jsx`

---

### Phase 6: Data Migration (Week 5)

- [ ] 6.1. Export Supabase Data

  **What to do**:
  - Create full PostgreSQL dump (pg_dump)
  - Export each table as JSON using Python script
  - Verify row counts match
  - Store backups in `data/migration/`

  **Must NOT do**:
  - Don't delete any Supabase data

  **Parallelizable**: NO (first migration task)

  **References**:
  
  **Pattern References**:
  - `backend/.env` - Supabase connection string
  - `scripts/seed_supabase_questions.py` - Example of Supabase data access
  
  **Acceptance Criteria**:
  - [ ] `data/migration/backup.sql` contains full PostgreSQL dump
  - [ ] `data/migration/*.json` for each table
  - [ ] Row count verification log: `data/migration/counts.txt`

  **Commit**: YES
  - Message: `chore(migration): export supabase data`
  - Files: `data/migration/`, `scripts/export_supabase.py`

---

- [ ] 6.2. Transform and Import to Convex

  **What to do**:
  - Create `scripts/import_to_convex.ts` 
  - Transform SQLAlchemy IDs to Convex document IDs
  - Maintain ID mapping for relationships
  - Import in dependency order: courses → weeks → tasks → users → etc.

  **Must NOT do**:
  - Don't lose any data during transform
  - Don't break relationship integrity

  **Parallelizable**: NO (depends on 6.1)

  **References**:
  
  **Pattern References**:
  - `data/migration/*.json` - Source data from 6.1
  - `convex/schema.ts` - Target schema
  
  **External References**:
  - Convex data import: https://docs.convex.dev/database/import-export
  
  **Acceptance Criteria**:
  - [ ] All tables imported with correct row counts
  - [ ] Relationships preserved (task.week_id → valid Convex ID)
  - [ ] User XP totals match source: `SELECT SUM(xp) FROM users`

  **Commit**: YES
  - Message: `chore(migration): import data to convex`
  - Files: `scripts/import_to_convex.ts`

---

- [ ] 6.3. Verify Data Integrity

  **What to do**:
  - Create verification script comparing Supabase vs Convex
  - Check: row counts, XP totals, streak values, quest progress
  - Verify all relationships resolve correctly
  - Test task completion with migrated data

  **Must NOT do**:
  - Don't proceed to cleanup without 100% verification

  **Parallelizable**: NO (depends on 6.2)

  **References**:
  
  **Pattern References**:
  - `data/migration/counts.txt` - Expected counts from 6.1
  
  **Acceptance Criteria**:
  - [ ] Verification script outputs "ALL CHECKS PASSED"
  - [ ] XP total in Convex matches PostgreSQL
  - [ ] Complete a task with migrated data → works correctly
  - [ ] All Playwright E2E tests pass with Convex data

  **Commit**: YES
  - Message: `chore(migration): verify data integrity`
  - Files: `scripts/verify_migration.ts`

---

### Phase 7: Cleanup (Week 5)

- [ ] 7.1. Remove FastAPI Backend

  **What to do**:
  - Delete `backend/` directory
  - Remove backend scripts from package.json
  - Update README with new architecture

  **Must NOT do**:
  - Don't delete until Phase 6 is complete
  - Don't delete Supabase account yet

  **Parallelizable**: NO (depends on 6.3)

  **References**:
  
  **Pattern References**:
  - `package.json` - Remove dev:backend script
  - `README.md` - Update architecture section
  
  **Acceptance Criteria**:
  - [ ] `backend/` directory deleted
  - [ ] `npm run dev` starts only frontend + Convex
  - [ ] No Python/FastAPI references in package.json

  **Commit**: YES
  - Message: `chore(cleanup): remove fastapi backend`
  - Files: Delete `backend/`, update `package.json`, `README.md`

---

- [ ] 7.2. Remove Supabase Dependencies

  **What to do**:
  - Remove `@supabase/supabase-js` from frontend
  - Delete `frontend/src/lib/supabase.js`
  - Remove old AuthContext if not needed
  - Clean up old API client

  **Must NOT do**:
  - Don't delete Supabase project yet (keep as backup)

  **Parallelizable**: YES (with 7.1)

  **References**:
  
  **Pattern References**:
  - `frontend/package.json` - Remove supabase dependencies
  - `frontend/src/lib/supabase.js` - File to delete
  - `frontend/src/api/client.js` - Old API to remove
  
  **Acceptance Criteria**:
  - [ ] No `supabase` in package.json
  - [ ] No import of supabase in any frontend file
  - [ ] `npm run build` succeeds

  **Commit**: YES
  - Message: `chore(cleanup): remove supabase dependencies`
  - Files: `frontend/package.json`, delete supabase files

---

- [ ] 7.3. Update Deployment Configuration

  **What to do**:
  - Update `vercel.json` to remove API routes
  - Configure Convex production deployment
  - Update environment variables in Vercel
  - Deploy to production

  **Must NOT do**:
  - Don't delete Render backend until Convex is verified in prod

  **Parallelizable**: NO (final task)

  **References**:
  
  **Pattern References**:
  - `vercel.json` - Current config
  - `render.yaml` - Backend config (to remove later)
  
  **External References**:
  - Convex production: https://docs.convex.dev/production
  
  **Acceptance Criteria**:
  - [ ] Vercel deployment succeeds
  - [ ] Production URL works: https://learning-tracker-nu-tan.vercel.app
  - [ ] All E2E tests pass against production
  - [ ] Real-time updates work in production

  **Commit**: YES
  - Message: `chore(deploy): configure convex production deployment`
  - Files: `vercel.json`, `.env.production`

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 1.1 | `feat(convex): initialize convex project` | convex/, package.json | `npx convex dev` |
| 1.2 | `feat(auth): setup clerk authentication` | .env.local | Clerk dashboard |
| 1.3 | `feat(auth): integrate convex with clerk` | main.jsx, auth.config.ts | App renders |
| 2.1-2.2 | `feat(schema): add curriculum tables` | schema.ts | `npx convex dev` |
| 2.3 | `feat(curriculum): implement queries` | curriculum.ts | Convex dashboard |
| 2.4 | `refactor(frontend): use convex curriculum` | Dashboard.jsx | Playwright |
| 3.1 | `feat(schema): add users table` | schema.ts | `npx convex dev` |
| 3.2 | `feat(schema): add badge tables` | schema.ts | `npx convex dev` |
| 3.3-3.4 | `feat(tasks): implement task completion` | tasks.ts | convex-test |
| 3.5 | `refactor(frontend): use convex tasks` | DayDetail.jsx | Playwright |
| 4.1-4.4 | `feat(rpg): implement rpg system` | rpg.ts, schema.ts | convex-test |
| 5.1-5.3 | `feat(srs): implement learning system` | srs.ts, quizzes.ts | convex-test |
| 5.4 | `refactor(frontend): use convex learning` | Practice.jsx | Playwright |
| 6.1-6.3 | `chore(migration): complete data migration` | scripts/, data/ | Verification script |
| 7.1-7.3 | `chore(cleanup): finalize migration` | Delete backend/, update deploy | Production E2E |

---

## Success Criteria

### Verification Commands
```bash
# Convex dev server running
npx convex dev  # Expected: "Convex functions ready"

# All tests pass
npm run test     # Expected: XX tests passed
npm run test:e2e # Expected: All Playwright tests pass

# Build succeeds
npm run build    # Expected: Build successful

# Production works
curl https://learning-tracker-nu-tan.vercel.app/api/health
# Expected: 200 OK
```

### Final Checklist
- [ ] All 32 curriculum weeks load from Convex
- [ ] Task completion awards XP atomically (<200ms)
- [ ] Real-time updates visible on Dashboard
- [ ] Quest damage applies correctly
- [ ] SRS intervals match `[1, 3, 7, 14]`
- [ ] All Playwright E2E tests pass
- [ ] FastAPI backend removed
- [ ] Supabase dependencies removed
- [ ] Production deployed and verified
- [ ] No console errors in browser
- [ ] XP totals match pre-migration values
