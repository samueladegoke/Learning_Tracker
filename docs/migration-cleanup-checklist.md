# Supabase to Convex Migration: Cleanup Checklist

## Overview
This document provides the final cleanup steps after verifying the Convex migration works correctly.

**⚠️ IMPORTANT**: Only proceed with cleanup AFTER:
1. Convex deployment is working in production
2. All data has been migrated and verified
3. Frontend is fully operational with Convex backend
4. At least 1 week of production testing

---

## Phase 7.1: Remove FastAPI Backend

### Files to Remove
```bash
# Backend directory (ENTIRE DIRECTORY)
rm -rf backend/

# Root-level backend files
rm -f requirements.txt
rm -f Procfile
rm -f render.yaml

# Python virtual environment
rm -rf venv/
rm -rf .venv/

# Python cache
rm -rf __pycache__/
find . -name "*.pyc" -delete
find . -name "__pycache__" -type d -delete

# SQLite databases (local development)
rm -f learning_tracker.db
rm -f *.db
```

### Package.json Updates
Remove these scripts from root `package.json`:
```json
{
  "scripts": {
    // REMOVE THESE:
    "dev:backend": "...",
    "start:backend": "...",
    "test:backend": "..."
  }
}
```

### Environment Files
Remove backend-related env vars:
- `DATABASE_URL` (Supabase PostgreSQL connection)
- `SUPABASE_SERVICE_KEY` (keep only if frontend needs it)

---

## Phase 7.2: Remove Supabase Dependencies

### Frontend Package Removals
```bash
cd frontend
npm uninstall @supabase/supabase-js @supabase/auth-helpers-react
```

### Files to Update/Remove
```
frontend/src/api/supabase.js     # DELETE
frontend/src/api/index.js        # UPDATE - remove Supabase imports
frontend/src/contexts/AuthContext.jsx  # UPDATE - use Clerk only
```

### API Directory Cleanup
Remove or update these files:
```
frontend/src/api/
├── supabase.js       # DELETE
├── tasks.js          # UPDATE - remove Supabase fallbacks
├── weeks.js          # UPDATE - remove Supabase fallbacks  
├── rpg.js            # UPDATE - remove Supabase fallbacks
├── badges.js         # DELETE or UPDATE
└── index.js          # UPDATE
```

### Auth Context Updates
Replace Supabase auth with Clerk-only:
```jsx
// OLD (with Supabase fallback)
const { isAuthenticated } = useAuth()
const clerkUserId = user?.id || 'dev-user'

// NEW (Clerk only)
const { isSignedIn, user } = useUser()
if (!isSignedIn) return <SignIn />
```

---

## Phase 7.3: Update Deployment Configuration

### Vercel Configuration
Update `vercel.json`:
```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    // REMOVE API proxy rewrites
    // Convex handles its own routing
  ],
  "env": {
    "VITE_CONVEX_URL": "@convex-url",
    "VITE_CLERK_PUBLISHABLE_KEY": "@clerk-publishable-key"
  }
}
```

### Remove Render Deployment
If using Render for FastAPI backend:
1. Go to Render dashboard
2. Delete the Python web service
3. Remove `render.yaml` from repo

### Update GitHub Actions
Remove Python/FastAPI CI steps:
```yaml
# DELETE THESE JOBS:
- name: Set up Python
- name: Install Python dependencies
- name: Run backend tests
- name: Deploy to Render
```

### DNS/Domain Updates
If you have custom domain pointing to FastAPI:
1. Remove API subdomain (e.g., `api.yourapp.com`)
2. Update any external integrations pointing to old API

---

## Verification Checklist

Before declaring migration complete:

- [ ] All Convex functions deployed and working
- [ ] All data migrated and verified
- [ ] Frontend works with Convex-only backend
- [ ] Authentication works with Clerk
- [ ] Task completion awards XP correctly
- [ ] RPG state (quests, challenges) works
- [ ] SRS/Quiz system works
- [ ] No console errors in production
- [ ] Performance is acceptable (<200ms for queries)
- [ ] Old Supabase data backed up

---

## Rollback Plan

If issues arise after cleanup:

### Quick Rollback
1. Restore `backend/` from git history: `git checkout HEAD~1 -- backend/`
2. Restore Supabase deps: `npm install @supabase/supabase-js`
3. Restore env vars from backup
4. Redeploy FastAPI to Render

### Full Rollback
1. Checkout pre-migration commit
2. Restore Supabase database from backup
3. Redeploy all services
4. Update DNS to point back to FastAPI

---

## Post-Migration Tasks

After successful migration:

1. **Archive old backend**: `git tag pre-convex-migration`
2. **Update documentation**: 
   - Update README.md with new architecture
   - Update AGENTS.md with Convex commands
3. **Monitor**: Watch error rates for 1-2 weeks
4. **Clean up**: Delete Supabase project (after backup verification)
5. **Cost analysis**: Compare Supabase vs Convex costs

---

## Files Created by Migration

New Convex files:
```
frontend/convex/
├── schema.ts           # Database schema (all tables)
├── gamification.ts     # Task completion, XP, badges
├── rpg.ts              # Quests, challenges, shop
├── srs.ts              # Spaced repetition system
├── quizzes.ts          # Quiz queries and mutations
├── curriculum.ts       # Weeks and tasks queries
├── auth.config.ts      # Clerk auth configuration
└── lib/
    └── xp.ts           # XP formula utilities
```

Migration scripts:
```
scripts/export_supabase.py           # Export Supabase to JSON
frontend/scripts/run_import.ts       # Import to Convex
frontend/convex/migrations/          # Convex import mutations
```

---

## Summary

| Phase | Status | Action |
|-------|--------|--------|
| 7.1 Remove FastAPI | READY | Run cleanup commands above |
| 7.2 Remove Supabase | READY | npm uninstall + file updates |
| 7.3 Update Deploy | READY | vercel.json + remove Render |

**Total cleanup can be done in ~30 minutes once migration is verified.**
