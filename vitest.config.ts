import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        'build/',
        'coverage/',
        '**/*.d.ts',
        '**/*.config.*',
        'e2e/',
        'test-results/',
        'playwright-report/',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
    reporters: [
      'default',
      'json',
      'html',
      'junit',
    ],
    outputFile: {
      json: './test-results/test-results.json',
      html: './test-results/test-results.html',
      junit: './test-results/test-results.xml',
    },
  },
});
