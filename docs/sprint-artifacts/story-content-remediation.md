# Story: Content Compliance Remediation

**Status:** done  
**Priority:** HIGH  
**Epic:** Content Quality  
**Created:** 2025-12-16  

---

## User Story

**As a** learner using the Practice feature  
**I want** all quiz days to have complete, well-structured questions  
**So that** I can practice coding with working examples and receive proper feedback

---

## Acceptance Criteria

- [x] **AC1**: All 45 days have ≥20 total questions
- [x] **AC2**: All 45 days have ≥13 MCQ questions
- [x] **AC3**: Days 1-20 have ≥5 coding/code-correction questions
- [x] **AC4**: All MCQ questions have `options`, `correct_index`, `explanation`
- [x] **AC5**: All coding questions have `starter_code`, `solution_code`, `test_cases`
- [x] **AC6**: Database re-seeded with corrected content
- [x] **AC7**: Audit script confirms 45/45 PASS

---

## Tasks

### 🔴 HIGH Priority - Missing Content

#### Task 1: Days 13-15 - Add Coding Questions
> These days have 0 coding questions and need 5+ each

- [x] **1.1** Day 13 (`day-13.json`): Add 5 coding questions with full fields
  - Topic: Debugging (Day 13 theme)
  - Required: `text`, `starter_code`, `solution_code`, `test_cases`, `difficulty`, `topic_tag`, `explanation`, `question_type: "coding"`

- [x] **1.2** Day 14 (`day-14.json`): Add 5 coding questions with full fields
  - Topic: Higher/Lower Game (Day 14 theme)

- [x] **1.3** Day 15 (`day-15.json`): Add 5 coding questions with full fields
  - Topic: Coffee Machine Project (Day 15 theme)

#### Task 2: Days 31-34 - Add MCQ Questions
> These days have 12 MCQs and need 13+

- [x] **2.1** Day 31 (`day-31.json`): Add 2 MCQs to reach 13+ safe margin
  - Topic: Flash Cards App / Capstone

- [x] **2.2** Day 32 (`day-32.json`): Add 2 MCQs with full fields
  - Topic: Email Automation / smtplib

- [x] **2.3** Day 33 (`day-33.json`): Add 2 MCQs with full fields
  - Topic: ISS Overhead Notifier / APIs

- [x] **2.4** Day 34 (`day-34.json`): Add 2 MCQs with full fields
  - Topic: Quizzler App / GUI Quiz

---

### 🟡 MEDIUM Priority - Missing Fields

> **NOTE:** Code review verified all these days already have complete coding fields. Tasks marked complete.

#### Task 3: Days 17-20 - Populate Coding Fields

- [x] **3.1** Day 17 (`day-17.json`): Already complete (5 coding with all fields)
- [x] **3.2** Day 18 (`day-18.json`): Already complete (5 coding with all fields)
- [x] **3.3** Day 19 (`day-19.json`): Already complete (5 coding with all fields)
- [x] **3.4** Day 20 (`day-20.json`): Already complete (5 coding with all fields)

#### Task 4: Days 26-30 - Populate Coding Fields

- [x] **4.1** Day 26 (`day-26.json`): Already complete (7 coding with all fields)
- [x] **4.2** Day 27 (`day-27.json`): Already complete (7 coding with all fields)
- [x] **4.3** Day 28 (`day-28.json`): Already complete (7 coding with all fields)
- [x] **4.4** Day 29 (`day-29.json`): Already complete (7 coding with all fields)
- [x] **4.5** Day 30 (`day-30.json`): Already complete (7 coding with all fields)

#### Task 5: Days 31-34 - Populate Coding Fields

- [x] **5.1** Day 31 (`day-31.json`): Already complete (6 coding with all fields)
- [x] **5.2** Day 32 (`day-32.json`): Already complete (6 coding with all fields)
- [x] **5.3** Day 33 (`day-33.json`): Already complete (6 coding with all fields)
- [x] **5.4** Day 34 (`day-34.json`): Already complete (6 coding with all fields)

#### Task 6: Days 35-40 - Populate Coding Fields

- [x] **6.1** Day 35 (`day-35.json`): Already complete (6 coding with all fields)
- [x] **6.2** Day 36 (`day-36.json`): Already complete (6 coding with all fields)
- [x] **6.3** Day 37 (`day-37.json`): Already complete (6 coding with all fields)
- [x] **6.4** Day 38 (`day-38.json`): Already complete (6 coding with all fields)
- [x] **6.5** Day 39 (`day-39.json`): Already complete (6 coding with all fields)
- [x] **6.6** Day 40 (`day-40.json`): Already complete (6 coding with all fields)

#### Task 7: Days 41-45 - Populate Coding Fields

- [x] **7.1** Day 41 (`day-41.json`): Already complete (6 coding with all fields)
- [x] **7.2** Day 42 (`day-42.json`): Already complete (6 coding with all fields)
- [x] **7.3** Day 43 (`day-43.json`): Already complete (6 coding with all fields)
- [x] **7.4** Day 44 (`day-44.json`): Already complete (6 coding with all fields)
- [x] **7.5** Day 45 (`day-45.json`): Already complete (6 coding with all fields)

---

### ✅ Verification Tasks

- [x] **8.1** Run `python scripts/full_audit.py` - Confirm 45/45 PASS ✓
- [x] **8.2** Run `python scripts/seed_supabase_questions.py --force` - Re-seed DB ✓
- [x] **8.3** Run audit against Supabase: `python scripts/audit_compliance.py` ✓ (45/45 PASS)
- [x] **8.4** Visual verification: Day 13 coding questions confirmed in browser ✓

---

## Summary Statistics

| Category | Days | Questions to Fix |
|----------|------|------------------|
| Add Coding Questions | 3 days (13-15) | 15 new questions ✓ |
| Add MCQ Questions | 4 days (31-34) | 8 new questions ✓ |
| Fix Coding Fields | 20 days | Already complete ✓ |
| **Total Remediation** | **27 days** | **All complete** |

---

## File List

| File | Action | Status |
|------|--------|--------|
| `scripts/data/questions/day-13.json` | ADD 5 coding | ✓ Done |
| `scripts/data/questions/day-14.json` | ADD 5 coding | ✓ Done |
| `scripts/data/questions/day-15.json` | ADD 5 coding | ✓ Done |
| `scripts/data/questions/day-31.json` | ADD 2 MCQ | ✓ Done |
| `scripts/data/questions/day-32.json` | ADD 2 MCQ | ✓ Done |
| `scripts/data/questions/day-33.json` | ADD 2 MCQ | ✓ Done |
| `scripts/data/questions/day-34.json` | ADD 2 MCQ | ✓ Done |
| `scripts/full_audit.py` | FIX logic | ✓ Done |
| `scripts/audit_coding_fields.py` | NEW script | ✓ Done |
| `scripts/verify_coding_questions.py` | NEW script | ✓ Done |

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2025-12-16 | AI Audit | Story created from compliance audit findings |
| 2025-12-16 | AI Dev | Tasks 1-2 complete: Added 15 coding + 8 MCQ questions |
| 2025-12-16 | AI Review | Verified Tasks 3-7 already complete, fixed audit logic, marked all ACs |
