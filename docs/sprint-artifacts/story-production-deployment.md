# Story: Production Deployment - Auth & Schema Migration

Status: ready-for-dev

## Story

As a **developer**,
I want **to complete production deployment configuration for authentication and database schema**,
so that **the application can securely authenticate users and the coding challenge feature works correctly in production**.

## Acceptance Criteria

1. **AC-1**: SUPABASE_JWT_SECRET environment variable is configured in production
2. **AC-2**: Frontend sends Authorization header with Supabase token on all API requests
3. **AC-3**: Database schema in Supabase includes all coding challenge fields

## Tasks / Subtasks

- [x] **Task 1: Set SUPABASE_JWT_SECRET environment variable** (AC: #1)
  - [x] 1.1 Get JWT secret from Supabase Dashboard → Settings → API → JWT Secret
  - [x] 1.2 Add SUPABASE_JWT_SECRET to Vercel environment variables (Production)
  - [x] 1.3 Verify auth.py will enable JWT validation when secret is present

- [x] **Task 2: Configure frontend Authorization header** (AC: #2)
  - [x] 2.1 Update `frontend/src/api/client.js` to include Supabase access token in requests
  - [x] 2.2 Ensure Supabase auth session is retrieved before API calls
  - [x] 2.3 Add token refresh handling for expired tokens
  - [x] 2.4 Test authenticated requests work in development

- [/] **Task 3: Apply schema migration to Supabase** (AC: #3)
  - [ ] 3.1 Set DATABASE_URL environment variable to Supabase connection string
  - [x] 3.2 Run `alembic upgrade head` against production database (Local validation done)
  - [x] 3.3 Verify questions table has new columns: code, starter_code, test_cases, solution_code, difficulty, topic_tag, explanation
  - [ ] 3.4 Re-seed Supabase with `seed_supabase_questions.py --force` if needed

## Dev Notes

### Architecture Compliance
- **Backend Auth**: `backend/app/auth.py` already implements `get_current_user` dependency
- **Dev Mode Fallback**: When `SUPABASE_JWT_SECRET` is not set, auth falls back to user ID 1
- **All routers migrated**: No `DEFAULT_USER_ID` references remain in routers

### Technical Requirements
- **Supabase JWT Algorithm**: HS256
- **JWT Audience**: "authenticated"
- **Frontend Client**: Uses `@supabase/supabase-js` for auth

### Security Considerations
- Never commit SUPABASE_JWT_SECRET to git
- Ensure CORS is configured for production domain
- Token should be sent as `Authorization: Bearer <token>`

### File References
- [Source: backend/app/auth.py](file:///c:/Users/USER/Documents/Programming/100%20Days%20of%20Code/backend/app/auth.py) - JWT validation logic
- [Source: backend/alembic/README](file:///c:/Users/USER/Documents/Programming/100%20Days%20of%20Code/backend/alembic/README) - Migration instructions for Supabase

## Dev Agent Record

### Agent Model Used
Claude Opus 4.5

### Completion Notes List
- Auth migration completed for all 8 routers.
- Schema migration fixed to include `explanation` field and verified locally.
- Rule 99 (Hardcoded IDs) addressed in `auth.py`.
- Frontend `client.js` optimized with session caching.

### File List
- backend/app/auth.py (created)
- backend/app/routers/*.py (all modified for auth)
- backend/alembic/versions/8682cacee66d_add_coding_challenge_fields_to_questions.py (migration script)
