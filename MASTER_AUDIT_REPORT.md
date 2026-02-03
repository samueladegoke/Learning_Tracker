# 🔍 Master Audit Report: Learning_Tracker Repository

**Audit Date:** 2026-02-02  
**Auditor:** OpenClaw Architect Agent  
**Repository:** `/home/azureuser/.openclaw/workspace/Learning_Tracker`  
**Tech Stack:** React/Vite + Convex Backend + Clerk Auth

---

## 📋 Executive Summary

The Learning_Tracker is a gamified Python learning platform ("100 Days of Code") with a React/Vite frontend and Convex serverless backend. Overall, the codebase is **production-functional** but has several **medium and high severity issues** that should be addressed before scaling or wider deployment.

### Risk Level: **MEDIUM-HIGH** 🟠

| Category | Status | Issues Found |
|----------|--------|--------------|
| **Security** | ⚠️ Warning | 4 issues |
| **Architecture** | ⚠️ Warning | 5 issues |
| **Logic Errors** | 🔴 Critical | 3 issues |
| **Performance** | ⚠️ Warning | 3 issues |
| **Deployment** | ⚠️ Warning | 4 issues |
| **Code Quality** | ✅ Acceptable | Minor issues |

---

## 🔴 Critical Issues (Must Fix)

### 1. **CRITICAL: Dead Python Backend Reference in Vercel Config**

**Location:** `vercel.json` + `api/index.py`

**Issue:** The Vercel configuration references a Python backend that imports from `backend.app.main` which **does not exist** in the repository (likely archived/deleted):

```json
// vercel.json
{
    "src": "api/index.py",
    "use": "@vercel/python"
}
```

```python
# api/index.py
from backend.app.main import app  # ❌ This module doesn't exist!
```

**Impact:** API routes will fail on Vercel deployment. Any request to `/api/*` will crash.

**Fix:** Either:
- Remove the Python API entirely from `vercel.json` if not needed (frontend uses Convex directly)
- Or restore/create the backend module

---

### 2. **CRITICAL: Supabase Dead Code Creates Confusion**

**Location:** `frontend/src/lib/supabase.js`

**Issue:** The codebase has Supabase client code still present despite migrating to Convex+Clerk. This creates:
- Confusing import paths
- Environment variable requirements for unused features
- Potential for accidental data leakage if old Supabase keys are still configured

```javascript
// frontend/src/lib/supabase.js - This file is orphaned!
export const supabase = createClient(supabaseUrl, supabaseAnonKey || 'missing-key-placeholder')
```

**Impact:** Confusion for developers; potential security risk if old credentials exist.

**Fix:** Remove `frontend/src/lib/supabase.js` entirely and clean up any remaining imports.

---

### 3. **CRITICAL: Quiz Answer Verification is Client-Side Mock**

**Location:** `frontend/src/components/Quiz/Quiz.jsx:100-115`

**Issue:** The quiz answer verification is **mocked on the frontend** and does not actually validate against correct answers from the backend:

```javascript
// Always returns true - SECURITY RISK!
const verifyResult = {
    is_correct: true, // 🚨 Mocking success for visual overhaul verification
    correct_index: optionIndex,
    explanation: "Great job! (Mock explanation)"
}
```

**Impact:** 
- Users can get "correct" for any answer
- XP/progress tracking is unreliable
- Leaderboard data is meaningless

**Fix:** Integrate with `api.quizzes.checkAnswer` mutation which exists and works correctly:

```javascript
// Should call backend:
const result = await checkAnswerMutation({ 
    clerkUserId: user.id,
    questionId: currentQuestion.id,
    selectedIndex: optionIndex 
});
```

---

## ⚠️ High Severity Issues

### 4. **Security: Mutations Accept User ID in Arguments (Partial)**

**Location:** `convex/quizzes.ts:checkAnswer`

**Issue:** The `checkAnswer` mutation accepts `clerkUserId` as an argument instead of deriving it exclusively from `ctx.auth.getUserIdentity()`. This could allow impersonation if exploited:

```typescript
// quizzes.ts
export const checkAnswer = mutation({
  args: {
    clerkUserId: v.string(),  // ⚠️ Should NOT be a parameter
    questionId: v.id("questions"),
    ...
  },
```

**Note:** Other mutations like `completeTask`, `submitQuizResult`, `buyItem` correctly use auth identity. Inconsistency is the issue.

**Fix:** Remove `clerkUserId` from args, always derive from auth:
```typescript
const identity = await ctx.auth.getUserIdentity();
if (!identity) throw new Error("Unauthorized");
const clerkUserId = identity.subject;
```

---

### 5. **Security: Auth Config Uses Environment Variable at Runtime**

**Location:** `convex/auth.config.ts`

```typescript
export default {
  providers: [{
    domain: process.env.CLERK_JWT_ISSUER_DOMAIN,  // ⚠️ Must be set at deploy time
    applicationID: "convex",
  }],
};
```

**Issue:** If `CLERK_JWT_ISSUER_DOMAIN` is not properly set in Convex dashboard, authentication will silently fail.

**Fix:** Add validation and better error messaging. Document the required setup clearly.

---

### 6. **Architecture: No Error Handling on Convex Mutations**

**Location:** `frontend/src/pages/Dashboard.jsx:91-103`

**Issue:** Mutation calls lack proper error handling and user feedback:

```javascript
const handleTaskToggle = async (taskId, complete) => {
    if (!isAuthenticated) return;
    try {
        if (complete) {
            await completeTaskMutation({ clerkUserId, taskId });  // ⚠️ clerkUserId shouldn't be needed
            soundManager.completeTask();
        }
    } catch (err) {
        console.error('Failed to toggle task:', err);  // ⚠️ No user notification!
        soundManager.error();
    }
}
```

**Fix:** Add toast notifications or UI feedback for errors.

---

### 7. **Logic Error: Dashboard Passes `clerkUserId` to Mutations That Derive It Internally**

**Location:** `frontend/src/pages/Dashboard.jsx`

**Issue:** Mutations are being called with `clerkUserId` but the backend mutations (`completeTask`, etc.) derive the user from auth context. This creates confusion and the frontend argument is ignored:

```javascript
await completeTaskMutation({ clerkUserId, taskId });  // clerkUserId is ignored!
```

**Fix:** Remove `clerkUserId` from mutation calls since backend derives it from auth.

---

### 8. **Performance: Full Table Scan for Leaderboard**

**Location:** `convex/quizzes.ts:getLeaderboard`

```typescript
const users = await ctx.db.query("users").collect();  // ⚠️ Full scan!
return users.sort((a, b) => b.xp - a.xp).slice(0, limit);
```

**Impact:** As user count grows, this becomes O(n) and will hit Convex query limits.

**Fix:** Add an index on XP or implement cursor-based pagination.

---

## ⚠️ Medium Severity Issues

### 9. **ProtectedRoute Logic is Sound** ✅

**Location:** `frontend/src/components/ProtectedRoute.jsx`

The ProtectedRoute implementation is correct:
- Shows loading spinner during auth check
- Redirects to login with return URL
- Properly renders children when authenticated

**No issues found.**

---

### 10. **Orphaned Client File**

**Location:** `frontend/src/api/client.old.js`

Old API client file should be removed to prevent confusion.

---

### 11. **Missing Index for Legacy Task Lookup**

**Location:** `convex/curriculum.ts:getTaskByLegacyId`

```typescript
// Since task_id is now in metadata, we need to scan
const tasks = await ctx.db.query("tasks").collect();
return tasks.find(t => t.metadata?.legacy_task_id === args.legacyTaskId);
```

**Impact:** Full table scan on every legacy lookup.

**Fix:** Add index on metadata field or restructure schema.

---

### 12. **Week Progress Calculation is N+1 Query**

**Location:** `convex/curriculum.ts:getWeekProgress`

```typescript
for (const task of tasks) {
    const status = await ctx.db.query("userTaskStatuses")...  // ⚠️ N queries!
}
```

**Fix:** Batch fetch all statuses for user, then filter in memory.

---

### 13. **Hardcoded Default Course Start Date**

**Location:** `frontend/src/contexts/CourseContext.jsx`

```javascript
startDate: new Date('2025-11-20'),  // ⚠️ Hardcoded past date
```

**Impact:** "Today's day" calculation may be incorrect.

**Fix:** Make this configurable or dynamic.

---

## 📋 Deployment Readiness Checklist

| Item | Status | Notes |
|------|--------|-------|
| Convex deployment configured | ⚠️ | Needs `CONVEX_DEPLOYMENT` env var |
| Clerk keys configured | ⚠️ | Needs `VITE_CLERK_PUBLISHABLE_KEY` |
| Clerk JWT issuer in Convex | ⚠️ | Needs `CLERK_JWT_ISSUER_DOMAIN` |
| Python backend removed | ❌ | `api/index.py` references missing module |
| Frontend builds | ⚠️ | Not tested (no node_modules) |
| Tests pass | ⚠️ | Not tested (no node_modules) |
| CORS headers correct | ✅ | COI/COEP headers for SharedArrayBuffer |
| SPA routing configured | ✅ | Vercel rewrites configured |

---

## 🏗️ Architecture Overview

```
Learning_Tracker/
├── frontend/              # React + Vite SPA
│   ├── src/
│   │   ├── components/    # UI components (Quiz, Dashboard, etc.)
│   │   ├── contexts/      # Auth, Course, Python contexts
│   │   ├── pages/         # Route pages
│   │   └── lib/           # Utilities (includes orphaned supabase.js)
│   └── tests/             # E2E and component tests
├── convex/                # Convex serverless backend
│   ├── schema.ts          # Database schema
│   ├── tasks.ts           # Task completion logic
│   ├── quizzes.ts         # Quiz management
│   ├── srs.ts             # Spaced repetition system
│   ├── rpg.ts             # Gamification (shop, quests)
│   ├── users.ts           # User management
│   └── *.test.ts          # Backend unit tests
├── api/                   # ❌ Dead Python API stub
└── scripts/               # Data import utilities
```

---

## ✅ What's Working Well

1. **Convex Schema Design** - Well-structured with proper indexes
2. **Clerk Integration** - Auth adapter pattern is clean
3. **Security Tests** - `security.test.ts` validates auth requirements
4. **Protected Routes** - Proper loading/redirect flow
5. **Gamification Logic** - XP, streaks, badges system is complete
6. **SRS Implementation** - Spaced repetition intervals are correct
7. **UI/UX** - Neural HUD theme is consistent

---

## 📝 Recommended Action Plan

### Immediate (Before Deploy)
1. ❌ Remove or fix `api/index.py` (Critical)
2. ❌ Fix Quiz.jsx mock verification (Critical)
3. ❌ Remove `frontend/src/lib/supabase.js` (Critical)

### Short-term (This Sprint)
4. ⚠️ Remove `clerkUserId` from mutation args/calls
5. ⚠️ Add error toast notifications in Dashboard
6. ⚠️ Fix leaderboard query performance

### Medium-term (Next Sprint)
7. Add indexes for legacy task lookup
8. Refactor N+1 queries in curriculum.ts
9. Make course start date configurable
10. Set up proper CI/CD with test runs

---

## 📊 Files Reviewed

| Category | Files Reviewed |
|----------|----------------|
| **Schema** | `convex/schema.ts` |
| **Auth** | `auth.config.ts`, `AuthContext.jsx`, `ProtectedRoute.jsx` |
| **Backend Logic** | `tasks.ts`, `quizzes.ts`, `srs.ts`, `rpg.ts`, `users.ts`, `gamification.ts` |
| **Frontend Core** | `App.jsx`, `main.jsx`, `Dashboard.jsx`, `Practice.jsx`, `Login.jsx` |
| **Tests** | `security.test.ts`, `tasks.test.ts`, `quizzes.test.ts` |
| **Config** | `vercel.json`, `.env.example`, `package.json` |

---

**Report Generated:** 2026-02-02 13:57 UTC  
**Auditor:** OpenClaw Architect (Subagent Session)
