const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DOCS_TO_VALIDATE = [
    'AGENTS.md',
    'README.md',
    'docs/architecture.md',
    'docs/prd.md',
    'docs/epics.md',
    'docs/development-guide.md',
    'docs/deployment-guide.md',
    'docs/documentation-index.md',
];

const DISALLOWED_PATTERNS = [
    /FastAPI/i,
    /uvicorn/i,
    /SQLAlchemy/i,
    /SQLite/i,
    /backend\/app/i,
    /backend\/seed\.py/i,
    /Supabase/i,
];

const ARCHIVED_STATUS_PATTERN = /^\s*>\s*Status:\s*Archived\b/im;

function main() {
    const violations = [];

    for (const relativePath of DOCS_TO_VALIDATE) {
        const absolutePath = path.join(ROOT, relativePath);
        if (!fs.existsSync(absolutePath)) {
            violations.push(`${relativePath}: missing file`);
            continue;
        }

        const content = fs.readFileSync(absolutePath, 'utf8');
        const isArchived = ARCHIVED_STATUS_PATTERN.test(content);
        for (const pattern of DISALLOWED_PATTERNS) {
            if (pattern.test(content) && !isArchived) {
                violations.push(`${relativePath}: matched ${pattern}`);
            }
        }
    }

    if (violations.length > 0) {
        console.error('Documentation drift check failed:');
        for (const violation of violations) {
            console.error(` - ${violation}`);
        }
        process.exit(1);
    }

    console.log('Documentation drift check passed.');
}

main();
