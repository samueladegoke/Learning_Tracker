# Story: Test Infrastructure Setup

## Story ID
`story-test-infrastructure`

## Epic
Quality Assurance & Testing

## Priority
High

## Status
`[x] Completed`

---

## User Story
**As a** developer  
**I want** automated test suites for both frontend and backend  
**So that** I can catch regressions early and deploy with confidence

---

## Description
Set up comprehensive test infrastructure for the Learning Tracker project. This includes:
- **Frontend**: Vitest + React Testing Library for component/unit tests
- **Backend**: pytest + pytest-cov for API/unit tests
- Initial test suites covering critical paths

---

## Acceptance Criteria

### AC1: Frontend Test Framework
- [x] Vitest configured and running
- [x] React Testing Library installed
- [x] At least 3 component tests passing
- [x] Test script in package.json (`npm test`)

### AC2: Backend Test Framework  
- [x] pytest configured with pytest-cov
- [x] Test database fixture (SQLite in-memory)
- [x] At least 3 API endpoint tests passing
- [x] Test script working (`pytest`)

### AC3: CI Integration Ready
- [x] Tests can run in headless mode
- [x] Exit codes properly indicate pass/fail
- [x] Coverage reports generated

---

## Tasks

### Task 1: Frontend Test Setup
- [x] 1.1 Install Vitest and dependencies
  ```bash
  npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
  ```
- [x] 1.2 Create `vitest.config.js`
- [x] 1.3 Add test script to `package.json`
- [x] 1.4 Create `frontend/src/__tests__/` directory

### Task 2: Frontend Initial Tests
- [x] 2.1 Test `CodeBlock` component renders
- [x] 2.2 Test `InlineCode` component renders
- [x] 2.3 Test `quizApi` mock responses

### Task 3: Backend Test Setup
- [x] 3.1 Install pytest dependencies
  ```bash
  pip install pytest pytest-cov httpx pytest-asyncio
  ```
- [x] 3.2 Create `backend/tests/` directory
- [x] 3.3 Create `conftest.py` with fixtures
- [x] 3.4 Update `requirements.txt`

### Task 4: Backend Initial Tests
- [x] 4.1 Test `/api/health` endpoint
- [x] 4.2 Test `/api/quizzes/{quiz_id}/questions` endpoint
- [x] 4.3 Test quiz submission logic

### Task 5: Documentation
- [x] 5.1 Add testing section to `development-guide.md`
- [x] 5.2 Document test commands

---

## Estimated Effort
**Points:** 5  
**Time:** ~4-6 hours

---

## Dependencies
- Node.js 18+
- Python 3.11+
- Existing codebase stable

---

## Technical Notes

### Frontend Stack
```
vitest: ^1.0.0
@testing-library/react: ^14.0.0
@testing-library/jest-dom: ^6.0.0
jsdom: ^23.0.0
```

### Backend Stack
```
pytest: ^7.4.0
pytest-cov: ^4.1.0
pytest-asyncio: ^0.21.0
httpx: ^0.25.0
```

### Test Structure
```
frontend/
└── src/
    └── __tests__/
        ├── components/
        │   ├── CodeBlock.test.jsx
        │   └── InlineCode.test.jsx
        └── api/
            └── quizApi.test.js

backend/
└── tests/
    ├── conftest.py
    ├── test_health.py
    └── test_quizzes.py
```

---

## Definition of Done
- [x] All tests passing locally
- [x] Coverage > 20% for initial setup
- [x] Documentation updated
- [x] No regressions in existing functionality
