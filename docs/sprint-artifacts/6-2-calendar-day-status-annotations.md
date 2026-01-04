# Story 6.2: Calendar Day Status Annotations

As a **Learner**,
I want the Calendar to show which specific activities I completed each day,
So that I can see patterns in my learning (quiz days vs. project days).

## Acceptance Criteria

- [ ] **Given** the user navigates to the Calendar page
- [ ] **When** they view a date cell for a completed day
- [ ] **Then** display icons indicating completed activities:
  - 📚 Deep Dive read
  - ✅ Quiz passed
  - 💻 Challenge submitted
- [ ] **And** hovering on the date shows a tooltip with details
- [ ] **And** "missed" days show a different indicator (e.g., red outline)

## Technical Notes
- Extend calendar API to include activity type per day
- Add tooltip component with activity breakdown
- Update `completion_dates` structure to include activity metadata
