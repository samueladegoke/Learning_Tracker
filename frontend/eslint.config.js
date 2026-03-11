import importPlugin from 'eslint-plugin-import';
import tseslint from '@typescript-eslint/parser';

export default [
    {
        ignores: [
            'dist/**',
            'node_modules/**',
            'tests/e2e/**',
            'tests/archive/**',
            'src/components/content/DeepDive/**',
        ],
    },
    {
        files: ['src/**/*.{js,jsx}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        plugins: {
            import: importPlugin,
        },
        rules: {
            'import/no-duplicates': 'error',
        },
    },
    {
        files: ['src/**/*.{ts,tsx}', 'tests/component/**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parser: tseslint,
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        plugins: {
            import: importPlugin,
        },
        rules: {
            'import/no-duplicates': 'error',
        },
    },
];
