import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';

type TokenPayload = { sub: string; role: 'customer' | 'seller' | 'admin'; email: string };

export function authenticate(request: Request, response: Response, next: NextFunction) {
  const cookieToken = request.headers.cookie?.split(';').map((value) => value.trim()).find((value) => value.startsWith('sivorment_session='))?.slice('sivorment_session='.length);
  const token = request.headers.authorization?.startsWith('Bearer ') ? request.headers.authorization.slice(7) : cookieToken;
  if (!token) return response.status(401).json({ error: { code: 'AUTH_REQUIRED', message: 'Sign in to continue.' } });
  try {
    const payload = jwt.verify(token, config.jwtSecret) as TokenPayload;
    request.user = { id: payload.sub, role: payload.role, email: payload.email };
    next();
  } catch {
    return response.status(401).json({ error: { code: 'INVALID_SESSION', message: 'Your session has expired. Please sign in again.' } });
  }
}

export const authorize = (...roles: Array<'customer' | 'seller' | 'admin'>) => (request: Request, response: Response, next: NextFunction) => {
  if (!request.user || !roles.includes(request.user.role)) return response.status(403).json({ error: { code: 'FORBIDDEN', message: 'You do not have permission to perform this action.' } });
  next();
};
