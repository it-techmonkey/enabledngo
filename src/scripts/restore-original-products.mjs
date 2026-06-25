import fs from 'fs';
import path from 'path';
import { Client } from 'pg';

const DATABASE_URL = process.env.NEON_DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌ Missing NEON_DATABASE_URL');
  process.exit(1);
}

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, 'src', 'data');
const existingProducts = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'products.json'), 'utf8'));

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

async function main() {
  const client = new Client({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();
  
  try {
    await client.query('BEGIN');
    
    console.log('🗑️ Clearing all products from Neon...');
    await client.query('DELETE FROM products');
    
    console.log('📦 Restoring only the original products...');
    const rows = existingProducts.map(normalizeProduct);
    if (rows.length > 0) {
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
        const sql = `INSERT INTO products (${columns.join(',')}) VALUES ${placeholders.join(',')} ON CONFLICT (id) DO UPDATE SET ${assignments}`;
        await client.query(sql, values);
    }
    
    await client.query('COMMIT');
    console.log(`✅ Successfully restored ${rows.length} original products. The 14 new products have been removed.`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error:', err.message);
  } finally {
    await client.end();
  }
}

main();
