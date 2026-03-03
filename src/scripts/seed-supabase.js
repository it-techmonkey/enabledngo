const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local
const envPath = path.join(process.cwd(), '.env.local');
let supabaseUrl, supabaseAnonKey;

if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    lines.forEach(line => {
        if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) supabaseUrl = line.split('=')[1].trim();
        if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) supabaseAnonKey = line.split('=')[1].trim();
    });
}

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const DATA_FILES = [
    { file: 'users.json', table: 'users' },
    { file: 'products.json', table: 'products' },
    { file: 'orders.json', table: 'orders' },
    { file: 'donations.json', table: 'donations' }
];

async function seed() {
    console.log('🚀 Starting Supabase Seeding...');

    const MAPPINGS = {
        'products': (item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            description: item.description,
            image: item.image,
            category: item.category,
            purchaseurl: item.purchaseUrl,
            pdffile: item.pdfFile,
            features: item.features,
            quantity: item.quantity,
            status: item.status,
            instock: item.inStock
        }),
        'orders': (item) => ({
            id: item.id || item._id, // Map both to id
            customer: item.customer,
            email: item.email,
            total: item.total || item.totalPrice,
            totalprice: item.totalPrice || item.total,
            status: item.status,
            address: item.address,
            products: item.products,
            items: item.items,
            date: item.date,
            createdat: item.createdAt || new Date().toISOString()
        }),
        'donations': (item) => ({
            id: item.id,
            donor_name: item.donor_name || item.title,
            title: item.title || item.donor_name,
            recipient: item.recipient,
            amount: item.amount || 0,
            program: item.program,
            status: item.status || 'Success',
            date: item.date,
            image: item.image,
            description: item.description
        })
    };

    for (const item of DATA_FILES) {
        const filePath = path.join(process.cwd(), 'src/data', item.file);
        if (!fs.existsSync(filePath)) {
            console.warn(`⚠️  Skip: ${item.file} not found.`);
            continue;
        }

        let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (!data || data.length === 0) {
            console.warn(`⚠️  Skip: ${item.file} is empty.`);
            continue;
        }

        // Apply mapping if exists
        if (MAPPINGS[item.table]) {
            data = data.map(MAPPINGS[item.table]);
        }

        console.log(`📦 Seeding ${item.table} (${data.length} records)...`);

        // Upsert data to Supabase
        const { error } = await supabase.from(item.table).upsert(data);

        if (error) {
            console.error(`❌ Error seeding ${item.table}:`, error.message);
        } else {
            console.log(`✅ ${item.table} seeded successfully.`);
        }
    }

    console.log('✨ Seeding completion.');
}

seed();
