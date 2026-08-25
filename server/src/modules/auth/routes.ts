import { createHash, randomBytes } from 'node:crypto';
import { Router } from 'express';
import { z } from 'zod';
import { requireDatabase } from '../../db.js';
import { authenticate } from '../../middleware/auth.js';
import { hashPassword, signSession, verifyPassword } from './security.js';

const registerSchema = z.object({ name: z.string().trim().min(2).max(80), email: z.email().transform((value) => value.toLowerCase()), password: z.string().min(10).max(128) });
const loginSchema = z.object({ email: z.email().transform((value) => value.toLowerCase()), password: z.string().min(1).max(128) });
export const authRouter = Router();

authRouter.post('/register', async (request, response) => {
  const input = registerSchema.parse(request.body);
  const db = requireDatabase();
  const existing = await db.query('SELECT id FROM users WHERE email = $1', [input.email]);
  if (existing.rowCount) return response.status(409).json({ error: { code: 'EMAIL_IN_USE', message: 'An account already exists for this email.' } });
  const passwordHash = await hashPassword(input.password);
  const result = await db.query<{ id: string; email: string; role: 'customer' }>(`INSERT INTO users (email, password_hash, display_name, role_id) SELECT $1, $2, $3, id FROM roles WHERE name = 'customer' RETURNING id, email, 'customer'::text AS role`, [input.email, passwordHash, input.name]);
  const user = result.rows[0];
  const token = signSession(user);
  response.cookie('sivorment_session', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 15 * 60 * 1000, path: '/' });
  return response.status(201).json({ data: { user }, token });
});

authRouter.post('/login', async (request, response) => {
  const input = loginSchema.parse(request.body);
  const db = requireDatabase();
  const result = await db.query<{ id: string; email: string; display_name: string; password_hash: string; role: 'customer' | 'seller' | 'admin' }>('SELECT u.id, u.email, u.display_name, u.password_hash, r.name AS role FROM users u JOIN roles r ON r.id = u.role_id WHERE u.email = $1 AND u.deleted_at IS NULL', [input.email]);
  const user = result.rows[0];
  if (!user || !(await verifyPassword(input.password, user.password_hash))) return response.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Email or password is incorrect.' } });
  const token = signSession(user);
  await db.query('UPDATE users SET last_login_at = now() WHERE id = $1', [user.id]);
  response.cookie('sivorment_session', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 15 * 60 * 1000, path: '/' });
  return response.json({ data: { user: { id: user.id, email: user.email, displayName: user.display_name, role: user.role } }, token });
});

authRouter.post('/logout', (_request, response) => {
  response.clearCookie('sivorment_session', { path: '/' });
  return response.status(204).end();
});

authRouter.get('/me', authenticate, (request, response) => response.json({ data: { user: request.user } }));

authRouter.post('/password-reset/request', async (request, response) => {
  const { email } = z.object({ email: z.email().transform((value) => value.toLowerCase()) }).parse(request.body);
  const db = requireDatabase();
  const user = await db.query<{ id: string }>('SELECT id FROM users WHERE email = $1 AND deleted_at IS NULL', [email]);
  if (user.rows[0]) {
    const rawToken = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(rawToken).digest('hex');
    await db.query('INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, now() + interval \'30 minutes\')', [user.rows[0].id, tokenHash]);
    if (process.env.NODE_ENV !== 'production') console.info(`Password reset requested for user ${user.rows[0].id}; connect an email provider to deliver the token.`);
  }
  return response.status(202).json({ data: { message: 'If the account exists, password reset instructions will be sent.' } });
});
