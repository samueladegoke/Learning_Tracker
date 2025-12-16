# Story: Test Infrastructure Setup

## Story ID
`story-test-infrastructure`

## Epic
Quality Assurance & Testing

## Priority
High

## Status
`[ ] Ready for Development`

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
- [ ] Vitest configured and running
- [ ] React Testing Library installed
- [ ] At least 3 component tests passing
- [ ] Test script in package.json (`npm test`)

### AC2: Backend Test Framework  
- [ ] pytest configured with pytest-cov
- [ ] Test database fixture (SQLite in-memory)
- [ ] At least 3 API endpoint tests passing
- [ ] Test script working (`pytest`)

### AC3: CI Integration Ready
- [ ] Tests can run in headless mode
- [ ] Exit codes properly indicate pass/fail
- [ ] Coverage reports generated

---

## Tasks

### Task 1: Frontend Test Setup
- [ ] 1.1 Install Vitest and dependencies
  ```bash
  npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
  ```
- [ ] 1.2 Create `vitest.config.js`
- [ ] 1.3 Add test script to `package.json`
- [ ] 1.4 Create `frontend/src/__tests__/` directory

### Task 2: Frontend Initial Tests
- [ ] 2.1 Test `CodeBlock` component renders
- [ ] 2.2 Test `InlineCode` component renders
- [ ] 2.3 Test `quizApi` mock responses

### Task 3: Backend Test Setup
- [ ] 3.1 Install pytest dependencies
  ```bash
  pip install pytest pytest-cov httpx pytest-asyncio
  ```
- [ ] 3.2 Create `backend/tests/` directory
- [ ] 3.3 Create `conftest.py` with fixtures
- [ ] 3.4 Update `requirements.txt`

### Task 4: Backend Initial Tests
- [ ] 4.1 Test `/api/health` endpoint
- [ ] 4.2 Test `/api/quizzes/{quiz_id}/questions` endpoint
- [ ] 4.3 Test quiz submission logic

### Task 5: Documentation
- [ ] 5.1 Add testing section to `development-guide.md`
- [ ] 5.2 Document test commands

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
- [ ] All tests passing locally
- [ ] Coverage > 20% for initial setup
- [ ] Documentation updated
- [ ] No regressions in existing functionality
