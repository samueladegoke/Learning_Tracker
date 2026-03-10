import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./src/test/setup.js'],
        include: [
            'tests/component/**/*.test.js',
            'tests/component/**/*.test.jsx',
            'tests/component/**/*.test.ts',
            'tests/component/**/*.test.tsx',
            'tests/component/**/*.spec.js',
            'tests/component/**/*.spec.jsx',
            'tests/component/**/*.spec.ts',
            'tests/component/**/*.spec.tsx',
        ],
        exclude: [
            'src/**',
            'tests/e2e/**',
            'tests/archive/**',
            'node_modules/**',
            'dist/**',
        ],
    },
});
