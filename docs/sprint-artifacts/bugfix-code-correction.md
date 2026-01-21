---
key: BUGFIX-CODE-CORRECTION
title: Bugfix Code Correction Rendering
status: done
---

# Bugfix: Code Correction Rendering

## Story
As a user, I want `code-correction` questions to render correctly in the Practice tab so I can learn from debugging exercises.

## Acceptance Criteria
- [x] Questions with `question_type: "code-correction"` display a distinct code block with the "buggy" code.
- [x] Options are displayed below the code block.
- [x] Selecting the correct option awards points correctly.
- [x] Backend API serves the questions with the `code` field populated.

## Tasks
- [x] Revert JSON files (Days 17-20) to `code-correction` type.
- [x] Update `Practice.jsx` to render `code-correction` questions.
- [x] Update database schema to include `code` column.
- [x] Verify rendering in browser.

## Dev Agent Record
- Modified `Practice.jsx` to add rendering logic.
- Modified `day-17.json` to `day-20.json`.
- Ran migration `add_code_column_to_questions`.
- Ran seed script.
