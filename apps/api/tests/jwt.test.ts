import { describe, it, expect } from 'vitest';
import { issueSession, verifyAccess, verifyRefresh, rotateRefresh } from '../src/lib/jwt';

describe('jwt session', () => {
  it('issues and verifies access/refresh', async () => {
    const { access, refresh } = issueSession({ sub: 'user-1', role: 'CUSTOMER' });
    const acc = verifyAccess(access);
    const ref = verifyRefresh(refresh);
    expect(acc?.sub).toBe('user-1');
    expect(ref?.sub).toBe('user-1');
    expect(ref?.tid).toBeTruthy();
  });

  it('rotates refresh token', async () => {
    const { refresh } = issueSession({ sub: 'user-2', role: 'CUSTOMER' });
    const parsed = verifyRefresh(refresh)!;
    const rotated = rotateRefresh(parsed.tid, { sub: parsed.sub, role: parsed.role });
    expect(rotated).toBeTruthy();
    const old = rotateRefresh(parsed.tid, { sub: parsed.sub, role: parsed.role });
    expect(old).toBeNull();
  });
});




