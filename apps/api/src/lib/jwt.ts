import jwt from 'jsonwebtoken';

const ACCESS_TTL_SEC = 15 * 60; // 15 minutes
const REFRESH_TTL_SEC = 7 * 24 * 60 * 60; // 7 days

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'dev-refresh';

export type JwtPayload = { sub: string; role?: string };

export function signAccessToken(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TTL_SEC, algorithm: 'HS256' });
}

export function signRefreshToken(payload: JwtPayload, tokenId: string) {
  return jwt.sign({ ...payload, tid: tokenId }, REFRESH_SECRET, { expiresIn: REFRESH_TTL_SEC, algorithm: 'HS256' });
}

export function verifyAccess(token: string): JwtPayload | null {
  try { return jwt.verify(token, JWT_SECRET) as any; } catch { return null; }
}

export function verifyRefresh(token: string): (JwtPayload & { tid: string }) | null {
  try { return jwt.verify(token, REFRESH_SECRET) as any; } catch { return null; }
}

// Simple in-memory rotation store; replace with Redis/DB in prod
const validRefreshTokenIds = new Set<string>();

export function issueSession(payload: JwtPayload) {
  const tokenId = crypto.randomUUID();
  validRefreshTokenIds.add(tokenId);
  const access = signAccessToken(payload);
  const refresh = signRefreshToken(payload, tokenId);
  return { access, refresh };
}

export function rotateRefresh(oldTid: string, payload: JwtPayload) {
  if (!validRefreshTokenIds.has(oldTid)) return null;
  validRefreshTokenIds.delete(oldTid);
  const newTid = crypto.randomUUID();
  validRefreshTokenIds.add(newTid);
  const access = signAccessToken(payload);
  const refresh = signRefreshToken(payload, newTid);
  return { access, refresh };
}

export function revokeRefresh(tid: string) {
  validRefreshTokenIds.delete(tid);
}




