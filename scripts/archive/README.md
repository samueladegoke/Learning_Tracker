# Archived One-Time / Legacy Scripts

Files in this folder are preserved for historical traceability only.
They are **not** part of the active development or CI workflow.

## Archived Items

| File | Why Archived |
|------|--------------|
| `add_cc_questions.py` | One-time content backfill |
| `extract_day_content.py` | Historical ingestion pipeline |
| `extract_portfolio_content.py` | Historical portfolio extraction |
| `fix_explanations.py` | One-time data correction |
| `import_cli.js` | Legacy JS duplicate of active `scripts/import_cli.ts` |
| `day_meta.legacy.js` | Legacy generated day metadata replaced by `frontend/src/data/dayMeta.js` |

## Active Script Entry Points

- `scripts/import_cli.ts`
- `scripts/import_questions.ts`
- `scripts/compliance_audit.py`
- `scripts/seed_supabase_questions.py`
- `scripts/seed_all_questions.py`
