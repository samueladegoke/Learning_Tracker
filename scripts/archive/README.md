# Archived One-Time Utility Scripts

These scripts were used during the initial content generation phase of the 100 Days of Code project.
They are preserved here for reference but are **not needed for normal development**.

## Scripts

| Script | Purpose | Original Usage |
|--------|---------|----------------|
| `add_cc_questions.py` | Added code-correction questions to Days 7-25 | Run once to populate initial CC questions |
| `extract_day_content.py` | Parsed VTT transcripts and HTML from Udemy course | Used for initial curriculum extraction |
| `extract_portfolio_content.py` | Parsed portfolio HTML assignments (Days 82-100) | Used for portfolio project metadata |
| `fix_explanations.py` | Batch-added explanations to coding questions | One-time schema fix |

## Note

The active seeding scripts are located in `scripts/`:
- `seed_supabase_questions.py` - Seeds questions to production Supabase
- `seed_all_questions.py` - Seeds all days to local SQLite

---
*Archived: 2025-12-31 during 5-pass code review cleanup*
