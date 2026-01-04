# Story 5.1: Automatic Task Completion on Quiz Pass

As a **Learner**,
I want my daily task to be marked complete when I pass the quiz,
So that my progress tracking reflects my actual accomplishments.

## Acceptance Criteria

- [ ] **Given** the user is on the Practice page for Day X
- [ ] **When** they complete the quiz with a passing score (≥70%)
- [ ] **Then** the corresponding task for Day X should be marked as complete
- [ ] **And** XP should be awarded once (not double-counted from task + quiz)
- [ ] **And** the Dashboard should reflect the updated task count immediately

## Technical Notes
- Modify `POST /api/quizzes/verify` to call task completion logic
- Ensure idempotency (re-completing quiz doesn't duplicate XP)
- Update `getProgress()` to consider quiz completion status
