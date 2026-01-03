# Story: Authentication Guards and Guest Views

**Status:** done  
**Epic:** 1 (Enhancement)  
**ID:** 1.5 (Tracked retroactively)

## Story
As a Developer,  
I want the application to handle unauthenticated users gracefully,  
So that guests can explore the curriculum without encountering 401 errors or empty loading states.

## Acceptance Criteria
- [x] Unauthenticated users see a "Ready to master Python?" landing view on the Dashboard.
- [x] Progress, Calendar, and Reflections pages show a "Sign In Required" view for guests.
- [x] API calls to protected endpoints are guarded by `isAuthenticated` checks.
- [x] Planner allows guests to browse weeks but disables task toggling.
- [x] Document title updates dynamically via `CourseContext`.
- [x] Navigation from guest views uses React Router `<Link>` or `useNavigate`.
- [x] Zero 401 console errors for unauthenticated users.

## Tasks/Subtasks
- [x] Implement `isAuthenticated` guard in `Dashboard.jsx`, `Progress.jsx`, `Calendar.jsx`, `Reflections.jsx`, and `Practice.jsx`.
- [x] Create Guest Landing View in `Dashboard.jsx`.
- [x] Create "Sign In Required" fallback views for restricted pages.
- [x] Implement `canEdit` logic in `Planner.jsx`.
- [x] Add dynamic document title to `CourseContext.jsx`.
- [x] Refactor `window.location.href` to `<Link>` in fallback views.
- [x] Fix `fetchWeeks` API leak in `Planner.jsx` (unguarded call).
- [x] Clean up `ProtectedRoute` in `App.jsx`.

## Dev Agent Record
### File List
- `frontend/src/App.jsx`
- `frontend/src/pages/Dashboard.jsx`
- `frontend/src/pages/Progress.jsx`
- `frontend/src/pages/Calendar.jsx`
- `frontend/src/pages/Reflections.jsx`
- `frontend/src/pages/Planner.jsx`
- `frontend/src/pages/Practice.jsx`
- `frontend/src/contexts/CourseContext.jsx`

### Change Log
- Removed `ProtectedRoute` forced redirects to allow inline guest views.
- Added premium landing content for unauthenticated users.
- Standardized guest state across all protected routes.
- Abstracted branding into `CourseContext`.

## Senior Developer Review (AI)
### Findings
- **H2: Planner API Leak**: `fetchWeeks` was called without an `isAuthenticated` check.
- **H3: Navigation Pattern**: `window.location.href` was used instead of React Router primitives.
- **H4: Animation Mismatch**: Authenticated dashboard was missing entrance animations.
- **M1: Dead Code**: `getBadgeName` was unused in Dashboard.
- **M2: Inconsistent Polish**: Calendar and Reflections guest views lacked Framer Motion.

### Resolution
- [x] Fixed API leak in `Planner.jsx`.
- [x] Standardized navigation to use `<Link>`.
- [x] Added missing entrance animations.
- [x] Cleaned up dead code and imports.
