import { Pool } from 'pg';

let pool;

function getPool() {
  if (!process.env.NEON_DATABASE_URL) return null;
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.NEON_DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 5,
    });
  }
  return pool;
}

export async function neonQuery(text, params = []) {
  const p = getPool();
  if (!p) {
    throw new Error('NEON_DATABASE_URL is not configured');
  }
  return p.query(text, params);
}

