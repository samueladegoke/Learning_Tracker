# Story: Spaced Repetition System (SRS) Implementation

**Epic:** Learning Retention (SRS)
**Status:** in-progress
**Assigned:** Dev Agent (Antigravity)
**Priority:** High

## Description
Implement a Spaced Repetition System (SRS) to enhance learning retention. Questions that the user finds difficult or misses during regular quizzes should be added to a review queue. The review interval should increase as the user demonstrates mastery.

## Acceptance Criteria
1. [x] Database model `UserQuestionReview` added to track question state (interval, due date, success count).
2. [x] REST API endpoints created for fetching daily reviews, submitting results, and adding questions to the queue.
3. [x] "Combat Training" widget on the Dashboard displaying review stats (Due Now, In Queue, Mastered).
4. [ ] "Review Mode" on the Practice page allows users to go through their daily review queue.
5. [x] Mastery logic: Concepts marked as "mastered" after 3+ successful reviews at maximum interval.
6. [x] XP Rewards: Users receive XP for each correct review and a bonus for mastery.
7. [x] Security: All endpoints secured with User ID dependency (Rule #99).

## Tasks & Subtasks
### Backend Implementation
- [x] Create `UserQuestionReview` model in `models.py`
- [x] Create and apply Alembic migration
- [x] Implement `spaced_repetition` router
    - [x] `GET /api/srs/daily-review`
    - [x] `POST /api/srs/review-result`
    - [x] `POST /api/srs/add-to-review/{question_id}`
    - [x] `GET /api/srs/stats`

### Frontend Integration
- [x] Add `srsAPI` to `client.js`
- [x] Create `DailyReviewWidget.jsx` component
- [x] Integrate `DailyReviewWidget` into `Dashboard.jsx`
- [ ] Implement Review Mode in `Practice.jsx`
- [ ] Implement Mastery animations and feedback

## Dev Agent Record
### File List
- `backend/app/models.py`: Added `UserQuestionReview` model.
- `backend/app/routers/spaced_repetition.py`: New router for SRS logic.
- `backend/app/main.py`: Registered SRS router.
- `frontend/src/api/client.js`: Added `srsAPI`.
- `frontend/src/components/DailyReviewWidget.jsx`: New dashboard widget.
- `frontend/src/pages/Dashboard.jsx`: Integrated SRS widget.

### Change Log
- Implemented backend storage and API for SRS.
- Added a dashboard widget to surface review needs.
- Prepared frontend for full review session integration.
