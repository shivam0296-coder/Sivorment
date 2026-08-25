import bcrypt from 'bcryptjs';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { config } from '../../config.js';

export const hashPassword = (password: string) => bcrypt.hash(password, 12);
export const verifyPassword = (password: string, hash: string) => bcrypt.compare(password, hash);
export const signSession = (user: { id: string; email: string; role: 'customer' | 'seller' | 'admin' }) => jwt.sign({ role: user.role, email: user.email }, config.jwtSecret, { subject: user.id, expiresIn: config.jwtExpiresIn as SignOptions['expiresIn'], issuer: 'sivorment-api', audience: 'sivorment-web' });
