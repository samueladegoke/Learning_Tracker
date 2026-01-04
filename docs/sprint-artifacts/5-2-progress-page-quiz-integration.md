# Story 5.2: Progress Page Quiz Integration

As a **Learner**,
I want the Progress page to show my quiz scores alongside task completion,
So that I can see a complete picture of my learning journey.

## Acceptance Criteria

- [ ] **Given** the user navigates to the Progress page
- [ ] **When** the page loads
- [ ] **Then** display a "Quiz Mastery" section showing:
  - Days completed via quiz (count)
  - Average quiz score across all attempts
  - Best quiz score (leaderboard entry)
- [ ] **And** the "tasks done" count should match actual quiz completions

## Technical Notes
- Query `user_question_status` aggregate data
- Create new `/api/progress/quiz-stats` endpoint
- Update `Progress.jsx` to fetch and display quiz stats
