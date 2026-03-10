# Story 7.1: Artifact Submission UI

As a **Learner**,
I want to submit proof of my work (screenshot, commit link, or reflection) when completing a task,
So that I can demonstrate my learning and earn bonus XP.

## Acceptance Criteria

- [x] **Given** the user completes a quiz or challenge
- [x] **When** they click "Complete Day"
- [x] **Then** display an optional artifact submission modal with options:
  - Upload screenshot (PNG/JPG, max 5MB)
  - Paste GitHub commit URL
  - Write a short reflection (min 50 characters)
- [x] **And** allow skipping artifact submission (reduced XP)
- [x] **And** award +10 bonus XP for artifact submission

## Technical Notes
- Create `ArtifactSubmissionModal.jsx` component ✅
- Use Convex for artifact storage (userArtifacts table) ✅
- Create `userArtifacts` table with `user_id`, `day_number`, `artifact_type`, `content`, `file_url`, `xp_awarded`, `created_at` ✅

## Implementation Status
**COMPLETED** ✅

### Files Created/Modified:
1. `convex/schema.ts` - Added `userArtifacts` table
2. `convex/artifacts.ts` - New file with artifact mutations and queries
3. `frontend/src/components/ArtifactSubmissionModal.jsx` - New modal component
4. `frontend/src/components/Quiz/QuizResult.jsx` - Integrated artifact modal
5. `frontend/src/components/Quiz/Quiz.jsx` - Pass dayNumber to QuizResult

### How It Works:
1. User completes quiz with passing score (≥70%)
2. QuizResult shows "Complete Day X" button alongside "Try Again"
3. Clicking "Complete Day" opens ArtifactSubmissionModal
4. User can upload screenshot, paste GitHub URL, or write reflection
5. On submit, artifact is stored and +10 bonus XP awarded
6. User can skip to proceed without bonus XP

---

## Code Review Record

**Review Date:** 2026-03-06
**Reviewer:** Adversarial Code Review Agent
**Review Passes:** 3 (Initial + Simplify + Final)

### Pass 1 - Initial Code Review Issues:

| ID | Severity | Issue | Status |
|----|----------|-------|--------|
| C1 | CRITICAL | Missing `level` update after XP award | ✅ Fixed |
| C2 | CRITICAL | Missing `last_activity_date` update (breaks streak) | ✅ Fixed |
| H1 | HIGH | Constants duplicated across backend/frontend | ✅ Fixed |
| H2 | HIGH | Missing `last_activity_date` in XP patch | ✅ Fixed |
| H3 | HIGH | Missing `levelFromXp` import | ✅ Fixed |
| H4 | HIGH | Redundant state (`filePreview` duplicated `content`) | ✅ Fixed |
| M1 | MEDIUM | setTimeout without cleanup on unmount | ✅ Fixed |
| M2 | MEDIUM | File input not reset on modal close | ✅ Fixed |
| L1 | LOW | Hardcoded +10 in QuizResult | ✅ Fixed |

### Pass 2 - Simplify Review Issues:

| ID | Severity | Issue | Status |
|----|----------|-------|--------|
| S1 | IMPORTANT | Timeout not cleared on manual modal close | ✅ Fixed |
| S2 | IMPORTANT | dayNumber extraction fragile (no validation) | ✅ Fixed |
| S3 | IMPORTANT | GitHub URL validation too permissive | ✅ Fixed |
| S4 | SUGGESTION | Triple-duplicated constants | ✅ Fixed |

### Final Changes Applied:

1. **Backend (`convex/artifacts.ts`):**
   - Added `import { levelFromXp } from "./gamification"`
   - Updated XP patch to include `level: levelFromXp(newXp)` and `last_activity_date: Date.now()`

2. **Frontend - ArtifactSubmissionModal.jsx:**
   - Removed redundant `filePreview` state, using `content` directly for preview
   - Added `useEffect` cleanup for setTimeout on component unmount
   - Added timeout clear on manual close in `handleClose()`
   - Added file input reset in `resetState()` function
   - Imported constants from shared file

3. **Frontend - QuizResult.jsx:**
   - Imported `ARTIFACT_XP_BONUS` from shared constants file

4. **Frontend - Quiz.jsx:**
   - Improved `dayNumber` extraction with regex validation and fallback

5. **New File - `frontend/src/constants/artifacts.js`:**
   - Created shared constants file for artifact system
   - Added `isValidGitHubUrl()` utility function

### Verification:
- ✅ ESLint passed with no warnings
- ✅ Build completed successfully
- ✅ Convex functions compiled with new indexes created
