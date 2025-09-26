import { describe, it, expect } from 'vitest';

describe('prisma setup', () => {
  it('loads env', () => {
    expect(process.env).toBeTruthy();
  });
});




