import { createClient } from '@supabase/supabase-js';

const OLD_URL = process.env.OLD_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const OLD_ANON_KEY = process.env.OLD_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const NEW_URL = process.env.NEW_SUPABASE_URL;
const NEW_ANON_KEY = process.env.NEW_SUPABASE_ANON_KEY;

const TABLES = [
  'users',
  'products',
  'orders',
  'donations',
  'donor_registrations',
  'children',
];

function requireEnv(name, value) {
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
}

async function getAllRows(client, table) {
  const { data, error } = await client.from(table).select('*');
  if (error) {
    throw new Error(`Read failed for ${table}: ${error.message}`);
  }
  return data || [];
}

function sanitizeRows(rows) {
  return rows.map((row) => {
    const cleaned = { ...row };
    // Some projects use createdat/updatedat, others created_at/updated_at.
    // Keep destination-compatible payload by removing unknown underscored variants.
    delete cleaned.created_at;
    delete cleaned.updated_at;
    return cleaned;
  });
}

async function upsertRows(client, table, rows) {
  if (!rows.length) return;
  const safeRows = sanitizeRows(rows);
  const { error } = await client.from(table).upsert(safeRows);
  if (error) {
    throw new Error(`Write failed for ${table}: ${error.message}`);
  }
}

async function countRows(client, table) {
  const { count, error } = await client
    .from(table)
    .select('*', { count: 'exact', head: true });
  if (error) {
    throw new Error(`Count failed for ${table}: ${error.message}`);
  }
  return count || 0;
}

async function migrateTable(oldClient, newClient, table) {
  const sourceRows = await getAllRows(oldClient, table);
  await upsertRows(newClient, table, sourceRows);
  const targetCount = await countRows(newClient, table);
  console.log(
    `[${table}] source=${sourceRows.length} target_after=${targetCount} status=${
      targetCount >= sourceRows.length ? 'ok' : 'needs-check'
    }`
  );
}

async function main() {
  requireEnv('OLD_SUPABASE_URL', OLD_URL);
  requireEnv('OLD_SUPABASE_ANON_KEY', OLD_ANON_KEY);
  requireEnv('NEW_SUPABASE_URL', NEW_URL);
  requireEnv('NEW_SUPABASE_ANON_KEY', NEW_ANON_KEY);

  const oldClient = createClient(OLD_URL, OLD_ANON_KEY);
  const newClient = createClient(NEW_URL, NEW_ANON_KEY);

  for (const table of TABLES) {
    try {
      await migrateTable(oldClient, newClient, table);
    } catch (err) {
      console.error(`[${table}] ${err.message}`);
    }
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
