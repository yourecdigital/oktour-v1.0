import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.{test,spec}.ts?(x)'],
    coverage: {
      enabled: true,
      reporter: ['text', 'lcov'],
      lines: 90,
      functions: 90,
      branches: 90,
      statements: 90,
    },
  },
});




