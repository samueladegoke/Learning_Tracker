# SCRIPTS KNOWLEDGE BASE

**Scope:** Automation for content seeding and compliance

## OVERVIEW

Python scripts for curriculum content management. Seeds quiz questions to Supabase, validates content compliance, extracts source material from Udemy course files.

## STRUCTURE

```
scripts/
├── seed_supabase_questions.py  # Main quiz seeder
├── seed_all_questions.py       # Batch seeding
├── compliance_audit.py         # Validates 20+ questions/day
├── audit_questions.py          # Question quality checks
├── utils/
│   ├── extract_day1_content.py # VTT/PDF parser
│   └── generate_day1.py        # Jupyter generator
├── data/                       # Intermediate JSON
└── archive/                    # Legacy scripts
```

## WHERE TO LOOK

| Task | Location |
|------|----------|
| Seed quizzes to prod | `seed_supabase_questions.py` |
| Validate content | `compliance_audit.py` |
| Parse Udemy VTT | `utils/extract_day1_content.py` |
| Batch operations | `seed_all_questions.py` |

## CONVENTIONS

**Supabase Connection**: Uses `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` from `frontend/.env`.

**Content Compliance**: Minimum 20 questions per day, must trace to Udemy source.

**Dry Run**: Most scripts support `--dry-run` flag.

## ANTI-PATTERNS

- **DO NOT** run seeders against prod without `--dry-run` first
- **DO NOT** commit generated content without compliance check
- **DO NOT** use user-facing Supabase key - use service role

## COMMANDS

```bash
# Seed quizzes (with dry run)
python seed_supabase_questions.py --dry-run
python seed_supabase_questions.py

# Compliance check
python compliance_audit.py

# Extract from Udemy source
python utils/extract_day1_content.py ../Udemy*/Day1/
```
