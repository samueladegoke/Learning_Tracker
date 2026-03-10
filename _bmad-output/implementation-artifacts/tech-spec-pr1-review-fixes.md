---
title: 'PR #1 Review Fixes'
slug: 'pr1-review-fixes'
created: '2026-03-08'
updated: '2026-03-09'
status: 'implementation-complete'
stepsCompleted: [1, 2, 3, 4, 5, 6, 7]
completedTasks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
remainingTasks: []
tech_stack: [React, Convex, Vite, TailwindCSS, Clerk]
files_to_modify:
  - frontend/src/pages/Progress.jsx
  - frontend/src/pages/WorldMap.jsx
  - frontend/src/main.jsx
  - frontend/src/pages/Reflections.jsx
  - frontend/src/pages/Dashboard.jsx
  - frontend/src/pages/Practice.jsx
  - frontend/src/components/Quiz/Quiz.jsx
  - convex/artifacts.ts
  - convex/rpg.ts
  - docs/sprint-artifacts/sprint-status.yaml
code_patterns:
  - Convex documents use _id (not id)
  - useRef for timer cleanup in React components
  - getCurrentUser(ctx) for auth in Convex mutations
  - try-catch around JSON.parse for malformed data
test_patterns:
  - Vitest + React Testing Library for component tests
  - Playwright for E2E tests
---

# Tech-Spec: PR #1 Review Fixes

**Created:** 2026-03-08

## Overview

### Problem Statement

PR review identified 11 actionable issues across the codebase. After filtering out auth-related concerns (not applicable — single-user app), we have 11 surgical fixes: 7 from CodeRabbit + 4 from additional verification.

### Solution

Fix all identified bugs with surgical, targeted changes. No architectural modifications needed — all fixes are isolated to specific functions or components.

### Scope

**In Scope:**
- Fix React key bug in Progress.jsx (`badge.id` → `badge._id`)
- Fix stale timeout race condition in WorldMap.jsx drawer
- Make `main.jsx` fail-fast on missing Clerk key in production
- Fix Reflections.jsx initialization race condition
- Add error feedback in Quiz.jsx for coding verification failures
- Add try-catch around JSON.parse in Practice.jsx
- Strengthen GitHub URL validation in convex/artifacts.ts
- Remove unused variables in Dashboard.jsx (questProgress, challengeProgress, shopItems)
- Prevent XP farming via delete+resubmit in `convex/artifacts.ts`
- Prevent cosmetic item double-purchase in `convex/rpg.ts`
- Correct sprint-status.yaml epic/story status inconsistencies

**Out of Scope:**
- Auth bypass fixes (single-user app — not applicable)
- Cross-user data leak prevention (single-user app)
- E2E test improvements (separate follow-up)
- Screenshot base64 storage optimization (deferred)

## Context for Development

### Codebase Patterns

- Convex documents always have `_id` field (not `id`) — this is a Convex convention
- Timer cleanup uses `useRef` + `useEffect` cleanup in React components
- `getCurrentUser(ctx)` is the standard auth helper for Convex mutations/queries
- `levelFromXp(xp)` from `convex/gamification.ts` calculates user level from total XP
- JSON.parse must be wrapped in try-catch when parsing external data
- URL validation should use `new URL()` for proper hostname checking

### Files to Reference

| File | Line(s) | Issue |
|------|---------|-------|
| `frontend/src/pages/Progress.jsx` | 344 | Badge key uses `id` instead of `_id` |
| `frontend/src/pages/WorldMap.jsx` | 14-24 | Drawer timeout never cleared |
| `frontend/src/main.jsx` | 23-25 | Silent Clerk key failure |
| `frontend/src/pages/Reflections.jsx` | 18-43 | Init race condition |
| `frontend/src/pages/Dashboard.jsx` | 89, 132-137 | Unused query and variables |
| `frontend/src/pages/Practice.jsx` | 143-144 | JSON.parse without try-catch |
| `frontend/src/components/Quiz/Quiz.jsx` | 167-169 | No error feedback on coding failure |
| `convex/artifacts.ts` | 85-88, 140-162 | Weak URL validation, no XP deduction |
| `convex/rpg.ts` | 132-137 | No duplicate cosmetic check |
| `docs/sprint-artifacts/sprint-status.yaml` | 66, 72-77 | Epic 8 status wrong |

## Implementation Plan

### Tasks

**Task 1: Fix badge key in Progress.jsx**
- File: `frontend/src/pages/Progress.jsx`
- Line 344: Change `badge.id` → `badge._id`

**Task 2: Fix stale timeout in WorldMap.jsx**
- File: `frontend/src/pages/WorldMap.jsx`
- Add `useRef` for close timer
- Clear timeout in `handleNodeClick` and `closeDrawer`
- Add `useEffect` cleanup on unmount

**Task 3: Fail-fast on missing Clerk key in main.jsx**
- File: `frontend/src/main.jsx`
- Lines 23-25: Change `console.error` to `throw new Error`

**Task 4: Fix Reflections.jsx initialization race**
- File: `frontend/src/pages/Reflections.jsx`
- Lines 18-43: Guard `hasInitialized` against undefined `reflectionsData`/`weeksData`

**Task 5: Add error feedback in Quiz.jsx**
- File: `frontend/src/components/Quiz/Quiz.jsx`
- Line 168: Add `setError("Failed to verify code. Please try again.")` in catch block
- **Implementation Code:**
  ```javascript
  // Lines 167-170: Change from:
  } catch (err) {
      console.error('Failed to verify coding result:', err)
  }
  // To:
  } catch (err) {
      console.error('Failed to verify coding result:', err)
      setError("Failed to verify code. Please try again.")
  }
  ```

**Task 6: Add try-catch around JSON.parse in Practice.jsx**
- File: `frontend/src/pages/Practice.jsx`
- Lines 143-144: Wrap JSON.parse calls in try-catch with fallback to empty arrays
- **Implementation Code:**
  ```javascript
  // Lines 140-145: Change from:
  const quizQuestions = (quizQuestionsRaw || []).map(q => ({
      ...q,
      id: q._id,
      options: q.options ? (typeof q.options === 'string' ? JSON.parse(q.options) : q.options) : [],
      test_cases: q.test_cases ? (typeof q.test_cases === 'string' ? JSON.parse(q.test_cases) : q.test_cases) : [],
  }))
  // To:
  const quizQuestions = (quizQuestionsRaw || []).map(q => {
      let parsedOptions = [];
      let parsedTestCases = [];
      try {
          parsedOptions = q.options ? (typeof q.options === 'string' ? JSON.parse(q.options) : q.options) : [];
      } catch (e) { console.warn('Failed to parse options:', e); }
      try {
          parsedTestCases = q.test_cases ? (typeof q.test_cases === 'string' ? JSON.parse(q.test_cases) : q.test_cases) : [];
      } catch (e) { console.warn('Failed to parse test_cases:', e); }
      return { ...q, id: q._id, options: parsedOptions, test_cases: parsedTestCases };
  })
  ```

**Task 7: Strengthen GitHub URL validation**
- File: `convex/artifacts.ts`
- Lines 85-88: Replace `includes("github.com")` with proper URL parsing
- **Current Code (weak):**
  ```typescript
  if (!args.content.includes("github.com")) {
    throw new Error("Commit URL must be a valid GitHub URL");
  }
  ```
- **Implementation Code (strong):**
  ```typescript
  // Lines 84-88: Change to:
  } else if (args.artifactType === "commit_url") {
    // Robust GitHub URL validation
    try {
      const url = new URL(args.content);
      if (!["github.com", "www.github.com"].includes(url.hostname)) {
        throw new Error("Commit URL must be a valid GitHub URL");
      }
    } catch {
      throw new Error("Invalid URL format");
    }
  }
  ```

**Task 8: Remove unused variables in Dashboard.jsx**
- File: `frontend/src/pages/Dashboard.jsx`
- Line 89: Remove `shopItems` query (unused)
- Lines 132-137: Remove `questProgress` and `challengeProgress` calculations (unused)
- **Implementation Code:**
  ```javascript
  // Line 89: DELETE this line entirely:
  // const shopItems = useQuery(api.rpg.getShopItems) || [];

  // Lines 132-137: DELETE these lines entirely:
  // const questProgress = activeQuest && activeQuest.boss_hp
  //   ? ((activeQuest.boss_hp - (activeQuest.boss_hp_remaining || activeQuest.boss_hp)) / activeQuest.boss_hp) * 100
  //   : 0;
  // const challengeProgress = activeChallenge && activeChallenge.goal
  //   ? (activeChallenge.progress / activeChallenge.goal) * 100
  //   : 0;

  // These variables are defined but never used anywhere in the component
  ```

**Task 9: Deduct XP on artifact delete**
- File: `convex/artifacts.ts`
- Lines 158-167: After delete, subtract `artifact.xp_awarded` from user XP using `Math.max(0, ...)`

**Task 10: Prevent cosmetic double-purchase**
- File: `convex/rpg.ts`
- Lines 131-137: Query `userInventory` to check for existing item before allowing purchase

**Task 11: Correct sprint-status.yaml**
- File: `docs/sprint-artifacts/sprint-status.yaml`
- Epic 8: Change status from `done` → `in-progress` (only 8-1 is complete)

### Acceptance Criteria

**AC1 - Badge Key:**
- Given: The Progress page renders with badges data
- When: Badges are mapped to BadgeCard components
- Then: Each BadgeCard uses `badge._id` as the React key (no console warnings)

**AC2 - WorldMap Drawer:**
- Given: User opens a module drawer on the WorldMap
- When: User quickly closes and opens a different module
- Then: The new module data is displayed (not wiped by stale timeout)

**AC3 - Clerk Fail-Fast:**
- Given: App runs in production mode (DEV_MODE=false)
- When: VITE_CLERK_PUBLISHABLE_KEY is missing
- Then: App throws an error immediately instead of rendering with broken auth

**AC4 - Reflections Init:**
- Given: Reflections page loads
- When: `weeksData` resolves before `reflectionsData`
- Then: Initialization waits for both queries before selecting a week

**AC5 - Quiz Error Feedback:**
- Given: User submits code for a coding challenge
- When: Verification fails due to network or server error
- Then: User sees error message "Failed to verify code. Please try again."

**AC6 - JSON Parse Safety:**
- Given: Quiz data contains malformed JSON in options or test_cases
- When: Practice page loads the quiz
- Then: Page renders with empty arrays fallback instead of crashing

**AC7 - GitHub URL Validation:**
- Given: User submits artifact with commit_url type
- When: URL is `https://evil.com?fake=github.com`
- Then: Backend rejects with "Commit URL must be a valid GitHub URL"

**AC8 - Unused Code Removed:**
- Given: Dashboard component renders
- When: Component loads
- Then: No unused queries or variables exist (shopItems, questProgress, challengeProgress removed)

**AC9 - Artifact Delete XP:**
- Given: User has an artifact with xp_awarded > 0
- When: User deletes the artifact
- Then: User's XP is reduced by the artifact's xp_awarded amount (minimum 0)

**AC10 - Cosmetic Double-Purchase:**
- Given: User already owns a cosmetic item
- When: User attempts to buy it again
- Then: Purchase is rejected with "Already owned" message

## Additional Context

### Dependencies

- `convex/gamification.ts` — `levelFromXp()` function for recalculating level after XP deduction

### Testing Strategy

- **Automated:** Existing component tests verify rendering changes
- **Manual:** Push changes and trigger CodeRabbit re-review on the PR

### Notes

- All changes are on the existing `chore/cleanup-and-consolidation` branch
- Push after all fixes to trigger PR re-review

## Implementation Status (Updated 2026-03-09)

### All Tasks Completed ✅

| Task | Status | Evidence |
|------|--------|----------|
| Task 1 | ✅ DONE | `Progress.jsx:344` uses `badge._id` |
| Task 2 | ✅ DONE | `WorldMap.jsx:13-18` has useRef + useEffect cleanup |
| Task 3 | ✅ DONE | `main.jsx:23-25` throws error on missing Clerk key |
| Task 4 | ✅ DONE | `Reflections.jsx:28-31` guards against undefined data |
| Task 5 | ✅ DONE | `Quiz.jsx:168` now calls `setError()` on catch |
| Task 6 | ✅ DONE | `Practice.jsx:143-154` wraps JSON.parse in try-catch |
| Task 7 | ✅ DONE | `artifacts.ts:85-94` uses `new URL()` for validation |
| Task 8 | ✅ DONE | `Dashboard.jsx` removed shopItems, questProgress, challengeProgress |
| Task 9 | ✅ DONE | `artifacts.ts:160-167` deducts XP on delete |
| Task 10 | ✅ DONE | `rpg.ts:132-141` checks for existing item |
| Task 11 | ✅ DONE | `sprint-status.yaml:73` shows epic-8 as `in-progress` |

