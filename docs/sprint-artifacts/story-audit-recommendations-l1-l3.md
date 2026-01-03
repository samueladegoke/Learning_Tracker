# Story: Audit Recommendations Implementation (L1-L3)

## Status
- **Status:** ready-for-dev
- **Priority:** Medium
- **Epic:** Maintenance & UX Polish

## Context
Implement the low-severity recommendations from the recent audit to improve visual uniformity, accessibility, and rebranding capabilities.

## Acceptance Criteria
1. **L1: Whitespace Uniformity**
   - [ ] Dashboard guest view has consistent bottom padding with other pages (e.g., `pb-12`).
2. **L2: Accessibility roles**
   - [ ] All guest-facing gated content prompts have `role="region"` and descriptive `aria-label`.
3. **L3: Branding abstraction**
   - [ ] Hardcoded guest teaser strings are moved to `CourseContext.guestPrompts`.
   - [ ] Dashboard, Progress, Calendar, Reflections, and Practice pages consume these context strings.

## Tasks
### L1-L3 Implementation
- [x] Add bottom padding to Dashboard guest view
- [x] Add accessibility roles/labels to guest prompts (Dashboard, Progress, Calendar, Reflections, Practice)
- [x] Abstract guest strings into `CourseContext`
- [x] Update frontend components to consume context strings

## Dev Agent Record
### File List
- `frontend/src/App.jsx`
- `frontend/src/pages/Dashboard.jsx`
- `frontend/src/pages/Progress.jsx`
- `frontend/src/pages/Calendar.jsx`
- `frontend/src/pages/Reflections.jsx`
- `frontend/src/pages/Practice.jsx`
- `frontend/src/pages/Planner.jsx`
- `frontend/src/contexts/CourseContext.jsx`

### Change Log
- Removed `ProtectedRoute` in `App.jsx` to allow landing views.
- Added `pb-12` to `Dashboard.jsx` guest container for spacing uniformity (L1).
- Added `role="region"` and `aria-label` to all guest view containers for accessibility (L2).
- Centralized guest messaging in `CourseContext.jsx` for white-labeling (L3).
- Guarded API calls in `Planner.jsx` and `Progress.jsx` for unauthenticated states.
- Verified changes render correctly in browser.
