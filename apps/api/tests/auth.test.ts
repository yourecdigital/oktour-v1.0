import { describe, it, expect } from 'vitest';
import argon2 from 'argon2';

describe('argon2id', () => {
  it('hash/verify', async () => {
    const hash = await argon2.hash('secret1234', { type: argon2.argon2id });
    const ok = await argon2.verify(hash, 'secret1234');
    expect(ok).toBe(true);
  });
});




