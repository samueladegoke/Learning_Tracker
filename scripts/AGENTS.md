# SCRIPTS KNOWLEDGE BASE

## OVERVIEW

Automation scripts for question ingestion, audits, and migration support.

## ACTIVE SCRIPTS

- `seed_supabase_questions.py` (external DB seeding utility)
- `seed_all_questions.py` (batch seeding helper)
- `compliance_audit.py` (question completeness validation)
- `audit_questions.py` (question quality checks)
- `import_cli.ts` (Convex migration import utility)
- `import_questions.ts` (question-specific import utility)

## LEGACY / ARCHIVED

All one-time or deprecated scripts are moved under `scripts/archive/` and are not part of daily development workflows.

## CONVENTIONS

- External DB seeding uses `SUPABASE_URL` + `SUPABASE_SERVICE_KEY`.
- Always run dry-run/audit mode before production-impacting script execution.
- Keep generated outputs out of runtime paths unless explicitly required.

## COMMON COMMANDS

```bash
python compliance_audit.py
python seed_supabase_questions.py --dry-run
python seed_supabase_questions.py
node --loader ts-node/esm import_cli.ts
```
