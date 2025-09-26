import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    coverage: {
      enabled: true,
      reporter: ['text', 'lcov'],
      lines: 90,
      functions: 90,
      branches: 90,
      statements: 90,
    },
    ui: true,
  },
});




