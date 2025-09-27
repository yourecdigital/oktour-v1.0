import '@testing-library/jest-dom';
import { expect, afterEach, beforeAll, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import { server } from './mocks/server';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Start MSW server
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

// Cleanup after each test
afterEach(() => {
  cleanup();
  server.resetHandlers();
});

// Stop MSW server
afterAll(() => {
  server.close();
});

