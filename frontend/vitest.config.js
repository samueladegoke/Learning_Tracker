import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

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
            'tests/e2e/**',
            'tests/support/**',
            'e2e/**',
            'node_modules/**',
            'dist/**',
        ],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: [
                'node_modules/',
                'src/test/',
                '**/*.d.ts',
            ],
        },
    },
})
