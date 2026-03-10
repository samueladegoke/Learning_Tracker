# Documentation Master Index

**Updated:** 2026-02-19

## Core Docs (Current)

| Document | Purpose | Status |
|----------|---------|--------|
| [architecture.md](architecture.md) | System architecture and design decisions | ✅ Current |
| [prd.md](prd.md) | Product requirements and scope | ✅ Current |
| [epics.md](epics.md) | Product stories and acceptance criteria | ✅ Current |
| [development-guide.md](development-guide.md) | Local setup and daily workflows | ✅ Current |
| [deployment-guide.md](deployment-guide.md) | Release and deployment instructions | ✅ Current |

## Technical References

| Document | Purpose | Status |
|----------|---------|--------|
| [technology-stack.md](technology-stack.md) | Framework/library inventory | ⚠️ Review periodically |
| [ui-component-inventory-frontend.md](ui-component-inventory-frontend.md) | Frontend component catalog | ⚠️ Review periodically |
| [devops-info.md](devops-info.md) | Environments and operations notes | ⚠️ Review periodically |

## Active Work Tracking

| Document | Purpose |
|----------|---------|
| [sprint-artifacts/sprint-status.yaml](sprint-artifacts/sprint-status.yaml) | Sprint state and story status |
| [sprint-artifacts/](sprint-artifacts/) | Story-level implementation records |

## Archival / Historical

These files are retained for history and audits, not as the source of truth for the current runtime stack:
Archived markdown docs should include a top-line banner in the form:
`> Status: Archived (...)`

- `docs/system-architecture.md`
- `docs/source-tree-analysis.md`
- `docs/integration-analysis.md`
- older point-in-time reports in `docs/`
- migration and one-time execution records in `docs/sprint-artifacts/`

## Suggested Reading Order

1. `architecture.md`
2. `development-guide.md`
3. `deployment-guide.md`
4. relevant sprint artifact for in-flight work
