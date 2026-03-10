const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC_ROOT = path.join(ROOT, 'frontend', 'src');
const EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx'];

const IGNORE_REACHABILITY = [
    path.join('components', 'content', 'DeepDive'),
    path.join('components', 'ui', 'neural'),
    path.join('test'),
];

function walk(dir, files = []) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walk(fullPath, files);
            continue;
        }
        if (EXTENSIONS.includes(path.extname(entry.name))) {
            files.push(path.normalize(fullPath));
        }
    }
    return files;
}

function shouldIgnore(filePath) {
    const relative = path.relative(SRC_ROOT, filePath);
    return IGNORE_REACHABILITY.some((segment) => relative.includes(segment));
}

function tryResolve(specifier, fromFile) {
    let candidate;
    if (specifier.startsWith('@/')) {
        candidate = path.join(SRC_ROOT, specifier.slice(2));
    } else if (specifier.startsWith('.')) {
        candidate = path.resolve(path.dirname(fromFile), specifier);
    } else {
        return null;
    }

    const checks = [candidate, ...EXTENSIONS.map((ext) => `${candidate}${ext}`), ...EXTENSIONS.map((ext) => path.join(candidate, `index${ext}`))];
    for (const check of checks) {
        if (fs.existsSync(check) && fs.statSync(check).isFile()) {
            return path.normalize(check);
        }
    }
    return null;
}

function collectImports(filePath, content) {
    const imports = [];
    const staticImportRegex = /import\s+(?:[^'"]+from\s+)?['"]([^'"]+)['"]/g;
    const dynamicImportRegex = /import\(\s*['"]([^'"]+)['"]\s*\)/g;

    let match;
    while ((match = staticImportRegex.exec(content)) !== null) {
        const resolved = tryResolve(match[1], filePath);
        if (resolved) imports.push(resolved);
    }

    while ((match = dynamicImportRegex.exec(content)) !== null) {
        const resolved = tryResolve(match[1], filePath);
        if (resolved) imports.push(resolved);
    }

    return imports;
}

function main() {
    if (!fs.existsSync(SRC_ROOT)) {
        console.error('frontend/src not found');
        process.exit(1);
    }

    const files = walk(SRC_ROOT).filter((file) => !file.includes(`${path.sep}__tests__${path.sep}`));
    const graph = new Map();

    for (const file of files) {
        const content = fs.readFileSync(file, 'utf8');
        graph.set(file, new Set(collectImports(file, content)));
    }

    const entrypoints = [
        path.normalize(path.join(SRC_ROOT, 'main.jsx')),
    ].filter((file) => fs.existsSync(file));

    const reachable = new Set();
    const stack = [...entrypoints];

    while (stack.length > 0) {
        const current = stack.pop();
        if (!current || reachable.has(current)) continue;
        reachable.add(current);
        for (const dep of graph.get(current) || []) {
            if (!reachable.has(dep)) {
                stack.push(dep);
            }
        }
    }

    const unreachable = files
        .filter((file) => !reachable.has(file))
        .filter((file) => !shouldIgnore(file));

    if (unreachable.length > 0) {
        console.error('Unused frontend modules detected (not reachable from src/main.jsx):');
        for (const file of unreachable) {
            console.error(` - ${path.relative(ROOT, file)}`);
        }
        process.exit(1);
    }

    console.log('No unreachable frontend modules detected.');
}

main();
