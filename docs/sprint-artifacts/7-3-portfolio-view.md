# Story 7.3: Portfolio View

As a **Learner**,
I want to view all my submitted artifacts in one place,
So that I can reflect on my learning journey and share my portfolio.

## Acceptance Criteria

- [ ] **Given** the user navigates to a new "Portfolio" page (or Progress sub-tab)
- [ ] **When** the page loads
- [ ] **Then** display a gallery of all submitted artifacts grouped by week
- [ ] **And** for each artifact, show:
  - Day number and title
  - Artifact preview (thumbnail for images, link for URLs)
  - Submission date
  - XP earned

## Technical Notes
- Create `/api/artifacts` GET endpoint for user artifacts
- Create `Portfolio.jsx` page or integrate into `Progress.jsx`
- Implement image thumbnail generation
