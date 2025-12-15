---
description: Audit quiz questions for content compliance (20+ per day, 13-15+ MCQ, 5-7+ Coding, required fields)
---

# Content Compliance Audit

Validates that all quiz questions meet the content ingestion workflow requirements.

## Quick Start

1. Ensure frontend (`npm run dev`) and backend (`uvicorn`) are running
2. Navigate browser to `http://localhost:5173/practice`
3. Run the compliance check script via Chrome DevTools

## Workflow Location

Full workflow: `bmad-custom-src/workflows/content-compliance-audit/workflow.md`

## Key Checks

- Minimum 20 questions per day
- 13-15+ MCQ questions
- 5-7+ Coding questions
- All required fields populated (explanation, test_cases, topic_tag, difficulty)
