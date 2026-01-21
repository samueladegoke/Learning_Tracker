# Test Automation

This directory contains the test suite for the Learning Tracker frontend.

## Structure

- `e2e/`: End-to-End tests using Playwright.
- `component/`: Component tests using Vitest & React Testing Library.
- `support/`: Shared test infrastructure.
    - `fixtures/`: Playwright fixtures (Auth, API, etc.).
    - `factories/`: Data generation factories (e.g., `user.factory.ts`).
    - `helpers/`: Utility helpers (e.g., `wait-for.ts`).

## Running Tests

### Unit & Component Tests
Run using Vitest:
```bash
npm run test
```

### End-to-End Tests
Run using Playwright:
```bash
npm run test:e2e
```
To run specific tests:
```bash
npx playwright test auth.spec.ts
```

## Fixtures

We use a Composable Fixture pattern.
- `auth.fixture.ts`: Mocks Supabase authentication via network interception.
- `merge.fixture.ts`: Combines all fixtures for use in tests.

Import `test` from `../support/fixtures/merge.fixture` to use these capabilities.
