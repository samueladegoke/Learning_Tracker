# Test Automation

This directory contains the test suite for the Learning Tracker frontend.

## Structure

- `e2e/`: End-to-End tests using Playwright.
- `component/`: Component tests using Vitest & React Testing Library.
- `archive/e2e-legacy/`: Archived Playwright suite kept for historical reference only.

## Running Tests

### Unit & Component Tests
Run using Vitest:
```bash
npm run test
npm run test:unit
npm run test:component
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
