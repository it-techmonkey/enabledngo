/**
 * NEON DB FULL MIGRATION SCRIPT
 * ─────────────────────────────
 * 1. Creates all tables in Neon (if not exist)
 * 2. CLEARS old/useless product data from Neon
 * 3. Inserts all data from local JSON files (users, orders, donations, children, etc.)
 * 4. Inserts all 30 products:
 *    - 17 existing products (from products.json)
 *    - 13 new products (requested by Shena / client)
 *
 * Run with: node src/scripts/neon-full-migration.mjs
 */

import fs from 'fs';
import path from 'path';
import { Client } from 'pg';

const DATABASE_URL = process.env.NEON_DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌ Missing NEON_DATABASE_URL — make sure .env.local is loaded');
  console.error('   Run: node --env-file=.env.local src/scripts/neon-full-migration.mjs');
  process.exit(1);
}

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, 'src', 'data');

function readJson(filePath, fallback = []) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8') || '[]');
    return Array.isArray(data) ? data : fallback;
  } catch {
    return fallback;
  }
}

// ── Load all local JSON data ──
const users             = readJson(path.join(DATA_DIR, 'users.json'));
const existingProducts  = readJson(path.join(DATA_DIR, 'products.json'));
const orders            = readJson(path.join(DATA_DIR, 'orders.json'));
const donations         = readJson(path.join(DATA_DIR, 'donations.json'));
const children          = readJson(path.join(DATA_DIR, 'children.json'));
const donorRegistrations = readJson(path.join(DATA_DIR, 'donor_registrations.json'));

// ── 13 NEW products from Shena (client request) ──
const newProducts = [
  {
    id: 'prod-suction-catheter-fr8',
    name: 'Suction Catheter Fr 8',
    price: 0,
    description: 'Sterile disposable suction catheter Fr 8 for airway suctioning. Smooth tip design for gentle and effective secretion removal.',
    image: '/images/Girly.png',
    category: 'Suction Equipment',
    purchaseUrl: '',
    pdfFile: '',
    features: ['Fr 8 Size', 'Sterile', 'Disposable', 'Smooth Tip'],
    quantity: 23,
    status: 'Available',
    inStock: true,
  },
  {
    id: 'prod-suction-catheter-fr6',
    name: 'Suction Catheter Fr 6',
    price: 0,
    description: 'Sterile disposable suction catheter Fr 6 for pediatric airway suctioning. Flexible PVC with measurement markings.',
    image: '/images/Girly.png',
    category: 'Suction Equipment',
    purchaseUrl: '',
    pdfFile: '',
    features: ['Fr 6 Size', 'Pediatric', 'Sterile', 'Flexible PVC'],
    quantity: 56,
    status: 'Available',
    inStock: true,
  },
  {
    id: 'prod-trach-tube-holder',
    name: 'Trach Tube Holder',
    price: 0,
    description: 'Secure tracheostomy tube holder with adjustable Velcro neck strap. Prevents tube displacement and keeps the airway stable.',
    image: '/images/Girly.png',
    category: 'Tracheostomy',
    purchaseUrl: '',
    pdfFile: '',
    features: ['Adjustable', 'Velcro Strap', 'Secure Fit', 'Comfortable'],
    quantity: 2,
    status: 'Available',
    inStock: true,
  },
  {
    id: 'prod-syringe-50ml-catheter',
    name: 'Disposable Syringe 50ml Catheter Tip',
    price: 0,
    description: 'Sterile 50ml disposable syringe with catheter tip for tube feeding and irrigation. Large capacity for efficient use.',
    image: '/images/Girly.png',
    category: 'Medical Supplies',
    purchaseUrl: '',
    pdfFile: '',
    features: ['50ml Capacity', 'Catheter Tip', 'Sterile', 'Disposable'],
    quantity: 10,
    status: 'Available',
    inStock: true,
  },
  {
    id: 'prod-maxineb-nebuliser',
    name: 'Maxineb Nebuliser',
    price: 0,
    description: 'Maxineb compact nebuliser for home respiratory therapy. Delivers medication directly to the lungs. Quiet operation suitable for children.',
    image: '/images/Girly.png',
    category: 'Respiratory',
    purchaseUrl: '',
    pdfFile: '',
    features: ['Compact Design', 'Quiet Operation', 'Child Friendly', 'Home Use'],
    quantity: 1,
    status: 'Available',
    inStock: true,
  },
  {
    id: 'prod-silicon-stomach-tube',
    name: 'All Silicon Stomach Tube',
    price: 0,
    description: 'Medical grade all-silicon stomach tube for enteral feeding and gastric decompression. Soft, flexible, and biocompatible.',
    image: '/images/Girly.png',
    category: 'Medical Supplies',
    purchaseUrl: '',
    pdfFile: '',
    features: ['100% Silicone', 'Biocompatible', 'Flexible', 'Enteral Feeding'],
    quantity: 1,
    status: 'Available',
    inStock: true,
  },
  {
    id: 'prod-feeding-tube-fr10',
    name: 'Feeding Tube Fr 10',
    price: 0,
    description: 'Nasogastric feeding tube Fr 10 for enteral nutrition delivery. Radiopaque line for X-ray verification of placement.',
    image: '/images/Girly.png',
    category: 'Medical Supplies',
    purchaseUrl: '',
    pdfFile: '',
    features: ['Fr 10 Size', 'Radiopaque', 'Enteral Nutrition', 'Sterile'],
    quantity: 4,
    status: 'Available',
    inStock: true,
  },
  {
    id: 'prod-feeding-tube-fr8',
    name: 'Feeding Tube Fr 8',
    price: 0,
    description: 'Nasogastric feeding tube Fr 8 for pediatric enteral nutrition. Soft PVC material with smooth tip for comfortable insertion.',
    image: '/images/Girly.png',
    category: 'Medical Supplies',
    purchaseUrl: '',
    pdfFile: '',
    features: ['Fr 8 Size', 'Pediatric', 'Soft PVC', 'Smooth Tip'],
    quantity: 2,
    status: 'Available',
    inStock: true,
  },
  {
    id: 'prod-salter-labs-oxygen',
    name: 'Salter Labs Oxygen Cannula',
    price: 0,
    description: 'Salter Labs premium nasal oxygen cannula for continuous oxygen delivery. Soft flared nasal prongs for patient comfort during long-term use.',
    image: '/images/Girly.png',
    category: 'Oxygen Therapy',
    purchaseUrl: '',
    pdfFile: '',
    features: ['Salter Labs', 'Soft Prongs', 'Long-Term Use', 'Comfortable'],
    quantity: 1,
    status: 'Available',
    inStock: true,
  },
  {
    id: 'prod-ped-trach-cuffless-30',
    name: 'Ped Trach Tube Cuffless 3.0 PEF',
    price: 0,
    description: 'Pediatric cuffless tracheostomy tube size 3.0 PEF. Designed for small pediatric patients requiring long-term airway management.',
    image: '/images/Girly.png',
    category: 'Tracheostomy',
    purchaseUrl: '',
    pdfFile: '',
    features: ['Size 3.0', 'Cuffless', 'Pediatric', 'PEF Type'],
    quantity: 1,
    status: 'Available',
    inStock: true,
  },
  {
    id: 'prod-ped-trach-cuffless-35',
    name: 'Ped Trach Tube Cuffless 3.5 PEF',
    price: 0,
    description: 'Pediatric cuffless tracheostomy tube size 3.5 PEF. Smooth inner cannula for easy suctioning and airway clearance.',
    image: '/images/Girly.png',
    category: 'Tracheostomy',
    purchaseUrl: '',
    pdfFile: '',
    features: ['Size 3.5', 'Cuffless', 'Pediatric', 'PEF Type'],
    quantity: 1,
    status: 'Available',
    inStock: true,
  },
  {
    id: 'prod-ped-trach-cuffless-45',
    name: 'Ped Trach Tube Cuffless 4.5 PED',
    price: 0,
    description: 'Pediatric cuffless tracheostomy tube size 4.5 PED. Medical-grade PVC for biocompatibility and patient safety.',
    image: '/images/Girly.png',
    category: 'Tracheostomy',
    purchaseUrl: '',
    pdfFile: '',
    features: ['Size 4.5', 'Cuffless', 'Medical Grade PVC', 'PED Type'],
    quantity: 1,
    status: 'Available',
    inStock: true,
  },
  {
    id: 'prod-ped-trach-cuffless-50',
    name: 'Ped Tracheostomy Tube Cuffless 5.0 PEF',
    price: 0,
    description: 'Pediatric cuffless tracheostomy tube size 5.0 PEF. Suitable for older pediatric patients. Includes inner cannula and obturator.',
    image: '/images/Girly.png',
    category: 'Tracheostomy',
    purchaseUrl: '',
    pdfFile: '',
    features: ['Size 5.0', 'Cuffless', 'Includes Obturator', 'PEF Type'],
    quantity: 2,
    status: 'Available',
    inStock: true,
  },
  {
    id: 'prod-syringe-3ml',
    name: 'Disposable Syringe 3ml',
    price: 0,
    description: 'Sterile 3ml disposable syringe for precise medication dosing. Clear barrel with easy-to-read graduation markings.',
    image: '/images/Girly.png',
    category: 'Medical Supplies',
    purchaseUrl: '',
    pdfFile: '',
    features: ['3ml Capacity', 'Sterile', 'Clear Barrel', 'Precise Dosing'],
    quantity: 46,
    status: 'Available',
    inStock: true,
  },
];

// ── Merge: existing + new (new ones take precedence if same id) ──
const newIds = new Set(newProducts.map((p) => String(p.id)));
const allProducts = [
  ...existingProducts.filter((p) => !newIds.has(String(p.id))),
  ...newProducts,
];

// ── Normalize functions ──
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

// ── DDL: Create tables ──
const ddl = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY, name TEXT, email TEXT, password TEXT, role TEXT,
  createdat TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY, name TEXT, price NUMERIC, description TEXT,
  image TEXT, category TEXT, purchaseurl TEXT, pdffile TEXT,
  features JSONB, quantity INTEGER DEFAULT 1,
  status TEXT DEFAULT 'Available', instock BOOLEAN DEFAULT true,
  createdat TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY, customer TEXT, email TEXT, total NUMERIC,
  totalprice NUMERIC, status TEXT DEFAULT 'Processing',
  address JSONB, products JSONB, items JSONB, date TEXT,
  createdat TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS donations (
  id TEXT PRIMARY KEY, donor_name TEXT, title TEXT, recipient TEXT,
  amount NUMERIC, program TEXT, status TEXT DEFAULT 'Success',
  date TEXT, image TEXT, description TEXT
);
CREATE TABLE IF NOT EXISTS children (
  id TEXT PRIMARY KEY, name TEXT, age INTEGER, domicile TEXT,
  parentsoccupation TEXT, description TEXT, image TEXT,
  createdat TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS donor_registrations (
  id TEXT PRIMARY KEY, name TEXT, email TEXT, phone TEXT, city TEXT,
  message TEXT, child_id TEXT, child_name TEXT, child_age INTEGER,
  child_domicile TEXT, child_image TEXT, amount NUMERIC,
  duration TEXT, total_amount NUMERIC,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);
`;

// ── Upsert helper ──
async function upsertRows(client, table, rows) {
  if (!rows.length) { console.log(`  ⏭  ${table}: no rows to insert`); return; }
  const columns = Object.keys(rows[0]);
  const assignments = columns.filter((c) => c !== 'id').map((c) => `${c}=EXCLUDED.${c}`).join(', ');
  const placeholders = [];
  const values = [];
  let i = 1;
  for (const row of rows) {
    placeholders.push(`(${columns.map(() => `$${i++}`).join(',')})`);
    for (const col of columns) {
      const v = row[col];
      values.push(v !== null && typeof v === 'object' ? JSON.stringify(v) : v);
    }
  }
  const sql = `INSERT INTO ${table} (${columns.join(',')}) VALUES ${placeholders.join(',')} ON CONFLICT (id) DO UPDATE SET ${assignments}`;
  await client.query(sql, values);
  console.log(`  ✅ ${table}: ${rows.length} rows upserted`);
}

// ── Main ──
async function main() {
  const client = new Client({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();
  console.log('✅ Connected to Neon DB\n');

  try {
    await client.query('BEGIN');

    // STEP 1: Create tables
    console.log('📋 STEP 1: Creating tables...');
    await client.query(ddl);
    console.log('  ✅ All tables created/verified\n');

    // STEP 2: Clear old Neon product data
    console.log('🗑️  STEP 2: Clearing old products from Neon...');
    await client.query('DELETE FROM products');
    console.log('  ✅ Old products cleared\n');

    // STEP 3: Insert all data
    console.log('📦 STEP 3: Inserting all data...');
    await upsertRows(client, 'users',              users.map(normalizeUser));
    await upsertRows(client, 'products',           allProducts.map(normalizeProduct));
    await upsertRows(client, 'orders',             orders.map(normalizeOrder));
    await upsertRows(client, 'donations',          donations.map(normalizeDonation));
    await upsertRows(client, 'children',           children.map(normalizeChild));
    await upsertRows(client, 'donor_registrations', donorRegistrations.map(normalizeDonorRegistration));

    await client.query('COMMIT');

    console.log('\n🎉 Migration complete!');
    console.log(`   users=${users.length}`);
    console.log(`   products=${allProducts.length} (${existingProducts.length} existing + ${newProducts.length} new from Shena)`);
    console.log(`   orders=${orders.length}`);
    console.log(`   donations=${donations.length}`);
    console.log(`   children=${children.length}`);
    console.log(`   donor_registrations=${donorRegistrations.length}`);
    console.log('\n✅ All products are now in Neon DB and will show on the live website!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('\n❌ Migration failed:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
