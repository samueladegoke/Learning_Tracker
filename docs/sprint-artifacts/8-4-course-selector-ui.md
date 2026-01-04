# Story 8.4: Course Selector UI

As a **Learner**,
I want to select which course I'm enrolled in,
So that I can switch between different learning tracks.

## Acceptance Criteria

- [ ] **Given** the platform has multiple courses available
- [ ] **When** the user visits the Dashboard
- [ ] **Then** display a course selector dropdown in the header
- [ ] **And** persist the selected course in user preferences
- [ ] **And** all pages (Planner, Practice, Progress) filter by active course
- [ ] **And** default to "100 Days of Code" for existing users

## Technical Notes
- Add `active_course_id` to User model
- Create `CourseContext` in React for active course state
- Update `useCourse()` hook to respect selected course
- Update all API calls to include `course_id` parameter
