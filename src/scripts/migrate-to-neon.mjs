import fs from 'fs';
import path from 'path';
import { Client } from 'pg';

const DATABASE_URL = process.env.NEON_DATABASE_URL;

if (!DATABASE_URL) {
  console.error('Missing NEON_DATABASE_URL');
  process.exit(1);
}

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, 'src', 'data');
const BACKUP_DONOR_FILE = path.join(ROOT, 'backups', 'donor-registrations-backup-1775805828827.json');

function readJson(filePath, fallback = []) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8') || '[]');
    return Array.isArray(data) ? data : fallback;
  } catch {
    return fallback;
  }
}

const users = readJson(path.join(DATA_DIR, 'users.json'));
const products = readJson(path.join(DATA_DIR, 'products.json'));
const orders = readJson(path.join(DATA_DIR, 'orders.json'));
const donations = readJson(path.join(DATA_DIR, 'donations.json'));
const children = readJson(path.join(DATA_DIR, 'children.json'));
const donorRegistrations = readJson(path.join(DATA_DIR, 'donor_registrations.json'), readJson(BACKUP_DONOR_FILE));

function normalizeProduct(p) {
  return {
    id: String(p.id),
    name: p.name ?? null,
    price: Number(p.price ?? 0),
    description: p.description ?? null,
    image: p.image ?? null,
    category: p.category ?? null,
    purchaseurl: p.purchaseUrl ?? p.purchaseurl ?? null,
    pdffile: p.pdfFile ?? p.pdffile ?? null,
    features: Array.isArray(p.features) ? p.features : [],
    quantity: Number(p.quantity ?? 1),
    status: p.status ?? 'Available',
    instock: p.inStock ?? p.instock ?? true,
    createdat: p.createdAt ?? p.createdat ?? new Date().toISOString(),
  };
}

function normalizeOrder(o) {
  return {
    id: String(o.id),
    customer: o.customer ?? null,
    email: o.email ?? null,
    total: Number(o.total ?? o.totalPrice ?? 0),
    totalprice: Number(o.totalPrice ?? o.total ?? 0),
    status: o.status ?? 'Processing',
    address: o.address ?? null,
    products: o.products ?? null,
    items: o.items ?? null,
    date: o.date ?? null,
    createdat: o.createdAt ?? o.createdat ?? new Date().toISOString(),
  };
}

function normalizeChild(c) {
  return {
    id: String(c.id),
    name: c.name ?? null,
    age: Number(c.age ?? 0),
    domicile: c.domicile ?? null,
    parentsoccupation: c.parentsOccupation ?? c.parentsoccupation ?? null,
    description: c.description ?? null,
    image: c.image ?? null,
    createdat: c.createdAt ?? c.createdat ?? new Date().toISOString(),
  };
}

function normalizeDonation(d) {
  return {
    id: String(d.id),
    donor_name: d.donor_name ?? d.title ?? null,
    title: d.title ?? d.donor_name ?? null,
    recipient: d.recipient ?? null,
    amount: Number(d.amount ?? 0),
    program: d.program ?? null,
    status: d.status ?? 'Success',
    date: d.date ?? null,
    image: d.image ?? null,
    description: d.description ?? null,
  };
}

function normalizeUser(u) {
  return {
    id: String(u.id),
    name: u.name ?? null,
    email: u.email ?? null,
    password: u.password ?? null,
    role: u.role ?? 'user',
    createdat: u.createdAt ?? u.createdat ?? new Date().toISOString(),
  };
}

function normalizeDonorRegistration(d) {
  return {
    id: String(d.id),
    name: d.name ?? null,
    email: d.email ?? null,
    phone: d.phone ?? null,
    city: d.city ?? null,
    message: d.message ?? null,
    child_id: d.child_id ?? null,
    child_name: d.child_name ?? null,
    child_age: d.child_age ? Number(d.child_age) : null,
    child_domicile: d.child_domicile ?? null,
    child_image: d.child_image ?? null,
    amount: d.amount ? Number(d.amount) : null,
    duration: d.duration ?? null,
    total_amount: d.total_amount ? Number(d.total_amount) : null,
    submitted_at: d.submitted_at ?? new Date().toISOString(),
  };
}

const ddl = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT,
  password TEXT,
  role TEXT,
  createdat TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT,
  price NUMERIC,
  description TEXT,
  image TEXT,
  category TEXT,
  purchaseurl TEXT,
  pdffile TEXT,
  features JSONB,
  quantity INTEGER DEFAULT 1,
  status TEXT DEFAULT 'Available',
  instock BOOLEAN DEFAULT true,
  createdat TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  customer TEXT,
  email TEXT,
  total NUMERIC,
  totalprice NUMERIC,
  status TEXT DEFAULT 'Processing',
  address JSONB,
  products JSONB,
  items JSONB,
  date TEXT,
  createdat TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS donations (
  id TEXT PRIMARY KEY,
  donor_name TEXT,
  title TEXT,
  recipient TEXT,
  amount NUMERIC,
  program TEXT,
  status TEXT DEFAULT 'Success',
  date TEXT,
  image TEXT,
  description TEXT
);
CREATE TABLE IF NOT EXISTS children (
  id TEXT PRIMARY KEY,
  name TEXT,
  age INTEGER,
  domicile TEXT,
  parentsoccupation TEXT,
  description TEXT,
  image TEXT,
  createdat TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS donor_registrations (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT,
  phone TEXT,
  city TEXT,
  message TEXT,
  child_id TEXT,
  child_name TEXT,
  child_age INTEGER,
  child_domicile TEXT,
  child_image TEXT,
  amount NUMERIC,
  duration TEXT,
  total_amount NUMERIC,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);
`;

async function upsertRows(client, table, rows) {
  if (!rows.length) return;
  const columns = Object.keys(rows[0]);
  const assignments = columns.filter((c) => c !== 'id').map((c) => `${c}=EXCLUDED.${c}`).join(', ');

  const placeholders = [];
  const values = [];
  let i = 1;
  for (const row of rows) {
    placeholders.push(`(${columns.map(() => `$${i++}`).join(',')})`);
    for (const col of columns) {
      const value = row[col];
      if (value !== null && typeof value === 'object') {
        values.push(JSON.stringify(value));
      } else {
        values.push(value);
      }
    }
  }
  const sql = `INSERT INTO ${table} (${columns.join(',')}) VALUES ${placeholders.join(',')} ON CONFLICT (id) DO UPDATE SET ${assignments}`;
  await client.query(sql, values);
}

async function main() {
  const client = new Client({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    await client.query('BEGIN');
    await client.query(ddl);

    await upsertRows(client, 'users', users.map(normalizeUser));
    await upsertRows(client, 'products', products.map(normalizeProduct));
    await upsertRows(client, 'orders', orders.map(normalizeOrder));
    await upsertRows(client, 'donations', donations.map(normalizeDonation));
    await upsertRows(client, 'children', children.map(normalizeChild));
    await upsertRows(client, 'donor_registrations', donorRegistrations.map(normalizeDonorRegistration));

    await client.query('COMMIT');
    console.log('Migration to Neon completed.');
    console.log(`users=${users.length}, products=${products.length}, orders=${orders.length}, donations=${donations.length}, children=${children.length}, donor_registrations=${donorRegistrations.length}`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
