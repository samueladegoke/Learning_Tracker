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
            'src/**/*.test.js',
            'src/**/*.test.jsx',
            'src/**/*.test.ts',
            'src/**/*.test.tsx',
            'src/**/*.spec.js',
            'src/**/*.spec.jsx',
            'src/**/*.spec.ts',
            'src/**/*.spec.tsx',
        ],
        exclude: [
            'tests/**',
            'node_modules/**',
            'dist/**',
        ],
    },
});
