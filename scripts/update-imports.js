const fs = require('fs');
const path = require('path');

const dir = 'frontend/src/components/content/DeepDive';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

let updated = 0;
let failed = 0;

files.forEach(f => {
    const filePath = path.join(dir, f);
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        const newContent = content.replace(
            /import CodeBlock from '\.\.\/\.\.\/CodeBlock'/g,
            "import CodeBlock from '@/components/CodeBlock'"
        );
        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent);
            console.log(`Updated: ${f}`);
            updated++;
        }
    } catch (err) {
        console.log(`Failed: ${f} - ${err.message}`);
        failed++;
    }
});

console.log(`Done! Updated: ${updated}, Failed: ${failed}`);
