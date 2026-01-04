# Story 6.1: Day-Level Planner Breakdown

As a **Learner**,
I want to see each day as a separate completable item in the Planner,
So that I can track my progress with finer granularity.

## Acceptance Criteria

- [ ] **Given** the user navigates to the Planner page
- [ ] **When** they expand a week accordion
- [ ] **Then** display each individual day (1-100) as a separate task row
- [ ] **And** each day shows its completion status independently
- [ ] **And** the week progress bar reflects the count of completed days within that week

## Technical Notes
- Modify `WeekAccordion.jsx` to render day-level items
- Update `/api/weeks/{id}` to return day-level completion data
- Consider lazy loading days to optimize performance
