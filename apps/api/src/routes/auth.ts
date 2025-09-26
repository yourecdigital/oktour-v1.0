import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import argon2 from 'argon2';
import { issueSession, rotateRefresh, verifyRefresh } from '../lib/jwt';

const router = Router();

// Placeholder in-memory users map; replace with Prisma
const users = new Map<string, { id: string; email: string; passwordHash: string; role: string }>();

router.post('/register',
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  body('name').isLength({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { email, password } = req.body;
    if ([...users.values()].some(u => u.email === email)) return res.status(409).json({ error: 'Email exists' });
    const hash = await argon2.hash(password, { type: argon2.argon2id });
    const id = crypto.randomUUID();
    users.set(id, { id, email, passwordHash: hash, role: 'CUSTOMER' });
    const session = issueSession({ sub: id, role: 'CUSTOMER' });
    res.json({ token: session.access, refresh: session.refresh, user: { id, email } });
  }
);

router.post('/login',
  body('email').isEmail(),
  body('password').isString(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { email, password } = req.body;
    const user = [...users.values()].find(u => u.email === email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await argon2.verify(user.passwordHash, password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const session = issueSession({ sub: user.id, role: user.role });
    res.json({ token: session.access, refresh: session.refresh, user: { id: user.id, email: user.email } });
  }
);

router.post('/refresh', body('refresh').isString(), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const parsed = verifyRefresh(req.body.refresh);
  if (!parsed?.tid) return res.status(401).json({ error: 'Invalid refresh' });
  const rotated = rotateRefresh(parsed.tid, { sub: parsed.sub, role: parsed.role });
  if (!rotated) return res.status(401).json({ error: 'Invalid refresh' });
  res.json(rotated);
});

export default router;




