---
key: COMPLIANCE-FIX
title: Fix Content Compliance Issues (Days 8-40)
status: done

> **NOTE:** This story was superseded and fully completed by `story-content-remediation.md` (45/45 PASS verified).
---

# Story: Fix Content Compliance Issues

**As a** Student
**I want** complete and compliant practice content for all days
**So that** I don't encounter missing or broken quizzes.

## Acceptance Criteria
1. **Day 8**: Total >= 20, MCQ >= 13, Coding >= 5.
2. **Day 9**: Content exists, Total >= 20.
3. **Day 11**: Coding >= 5, MCQs have explanations.
4. **Day 12**: Coding >= 5, MCQs have explanations.
5. **Days 35-40**: MCQ >= 13.
6. **Verification**: Audit script returns PASS for all days.

## Dev Agent Record

### File List
- `scripts/data/questions/day-8.json`
- `scripts/data/questions/day-9.json`
- `scripts/data/questions/day-11.json`
- `scripts/data/questions/day-12.json`
- `scripts/data/questions/day-35.json` to `day-40.json`

### Tasks/Subtasks
- [x] **Day 8 Verification**
    - [x] Content exists (audit false negative due to partial seed)
    - [ ] Re-seed Day 8
- [x] **Day 9 Verification**
    - [x] Content exists (13KB, valid JSON). Audit false negative due to no-seed.
    - [ ] Re-seed Day 9
- [x] **Day 11 Fixes**
    - [x] Fix Question Types (MCQ -> Coding)
- [x] **Day 12 Fixes**
    - [x] Fix Question Types (MCQ -> Coding)
- [ ] **Days 35-40 Fixes**
    - [ ] Add 1 MCQ to each day (Current: 12, Target: 13)
    - [ ] Re-seed Days 35-40
- [ ] **Verification**
    - [ ] Seed Database
    - [ ] Run Audit Script
