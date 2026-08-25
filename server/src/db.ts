import pg from 'pg';
import { config } from './config.js';

const { Pool } = pg;
export const pool = config.databaseUrl ? new Pool({ connectionString: config.databaseUrl, max: 10, idleTimeoutMillis: 30_000, connectionTimeoutMillis: 5_000, ssl: config.nodeEnv === 'production' ? { rejectUnauthorized: true } : undefined }) : null;

export function requireDatabase() {
  if (!pool) {
    const error = new Error('Database operations require DATABASE_URL.');
    Object.assign(error, { status: 503, code: 'DATABASE_NOT_CONFIGURED' });
    throw error;
  }
  return pool;
}
