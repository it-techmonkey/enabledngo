import fs from 'fs';
import path from 'path';
import { supabase } from './supabase';

const DATA_DIR = path.join(process.cwd(), 'src/data');
// Longer TTLs = fewer DB hits; invalidated on write
const CACHE_TTL_MS = 2 * 60 * 1000;       // 2 min products, orders, donations
const USERS_CACHE_TTL_MS = 5 * 60 * 1000; // 5 min users (auth speed; invalidated on signup)

const getFilePath = (filename) => path.join(DATA_DIR, filename);

const memoryCache = new Map();
const cacheTimestamps = new Map();
const pendingReads = new Map(); // request coalescing: one in-flight read per key
const SUPABASE_TIMEOUT_MS = 4000;

function getCached(key) {
    const ts = cacheTimestamps.get(key);
    const ttl = key === 'users.json' ? USERS_CACHE_TTL_MS : CACHE_TTL_MS;
    if (ts && Date.now() - ts < ttl) {
        return memoryCache.get(key);
    }
    return undefined;
}

/** Returns cached value even if expired (for stale-while-revalidate). */
function getStale(key) {
    return memoryCache.get(key);
}

/** True if cache is missing or expired and we should refresh in background. */
function isStale(key) {
    const ts = cacheTimestamps.get(key);
    const ttl = key === 'users.json' ? USERS_CACHE_TTL_MS : CACHE_TTL_MS;
    return !ts || Date.now() - ts >= ttl;
}

function setCached(key, value) {
    memoryCache.set(key, value);
    cacheTimestamps.set(key, Date.now());
}

function invalidateCached(filename) {
    memoryCache.delete(filename);
    cacheTimestamps.delete(filename);
    pendingReads.delete(filename);
}

async function withTimeout(promise, timeoutMs = SUPABASE_TIMEOUT_MS) {
    return Promise.race([
        promise,
        new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Timeout')), timeoutMs);
        })
    ]);
}

/** Delete a single row by id from Supabase (and invalidate cache). Use before saving filtered array so DB stays in sync. */
export async function deleteRow(filename, id) {
    invalidateCached(filename);
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        const table = TABLE_MAP[filename];
        if (table && id != null) {
            try {
                const { error } = await withTimeout(supabase.from(table).delete().eq('id', String(id)));
                if (error) throw error;
                return true;
            } catch (err) {
                console.error(`Supabase delete error for ${table}:`, err);
                return false;
            }
        }
        return false;
    }
    return true;
}

// Supabase helper: Maps JSON filenames to table names
const TABLE_MAP = {
    'users.json': 'users',
    'products.json': 'products',
    'orders.json': 'orders',
    'donations.json': 'donations',
    'donor_registrations.json': 'donor_registrations',
    'children.json': 'children'
};

// Mapping helpers for Supabase (CamelCase to lowercase)
const FIELD_MAPPINGS = {
    'products': {
        from: (item) => ({
            ...item,
            purchaseUrl: item.purchaseurl,
            pdfFile: item.pdffile,
            inStock: item.instock,
            createdAt: item.createdat,
        }),
        to: (item) => ({
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
            instock: item.inStock,
            createdat: item.createdAt,
        })
    },
    'orders': {
        from: (item) => ({
            ...item,
            totalPrice: item.totalprice,
            createdAt: item.createdat
        }),
        to: (item) => ({
            id: item.id,
            customer: item.customer,
            email: item.email,
            total: item.total,
            totalprice: item.totalPrice,
            status: item.status,
            address: item.address,
            products: item.products,
            items: item.items,
            date: item.date,
            createdat: item.createdAt || new Date().toISOString()
        })
    },
    'donations': {
        from: (item) => item,
        to: (item) => ({
            id: item.id,
            donor_name: item.donor_name || item.title,
            title: item.title || item.donor_name,
            recipient: item.recipient,
            amount: item.amount,
            program: item.program,
            status: item.status,
            date: item.date,
            image: item.image,
            description: item.description
        })
    },
    'children': {
        from: (item) => ({
            ...item,
            parentsOccupation: item.parentsoccupation || item.parentsOccupation,
            createdAt: item.createdat || item.createdAt,
        }),
        to: (item) => ({
            id: item.id,
            name: item.name,
            age: item.age,
            domicile: item.domicile,
            parentsoccupation: item.parentsOccupation || item.parentsoccupation,
            description: item.description,
            image: item.image,
            createdat: item.createdAt || new Date().toISOString(),
        })
    },
    'donor_registrations': {
        from: (item) => item,
        to: (item) => ({
            id: item.id,
            name: item.name,
            email: item.email,
            phone: item.phone,
            city: item.city,
            message: item.message,
            child_id: item.child_id,
            child_name: item.child_name,
            child_age: item.child_age,
            child_domicile: item.child_domicile,
            child_image: item.child_image,
            amount: item.amount,
            duration: item.duration,
            total_amount: item.total_amount,
            submitted_at: item.submitted_at || new Date().toISOString()
        })
    }
};

async function doReadData(filename) {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        const table = TABLE_MAP[filename];
        if (table) {
            try {
                const { data, error } = await withTimeout(supabase.from(table).select('*'));
                if (error) throw error;
                let result = FIELD_MAPPINGS[table] ? (data || []).map(FIELD_MAPPINGS[table].from) : (data || []);
                // If children table is empty, use local file so be-a-donor and admin show same seeded data
                if (table === 'children' && (!result || result.length === 0)) {
                    const filePath = getFilePath(filename);
                    if (fs.existsSync(filePath)) {
                        const content = fs.readFileSync(filePath, 'utf8');
                        const local = JSON.parse(content || '[]');
                        result = Array.isArray(local) ? local : [];
                    }
                }
                setCached(filename, result);
                return result;
            } catch (err) {
                const msg = String(err?.message ?? '');
                const details = String(err?.details ?? '');
                const isNetwork = msg.includes('fetch failed') || msg.includes('Timeout') || details.includes('Timeout') || details.includes('ECONNREFUSED') || err?.code === 'ECONNREFUSED';
                if (isNetwork) {
                    console.warn(`[db] Supabase unreachable (network/timeout) for ${table}, using local data.`);
                } else {
                    console.error(`Supabase read error for ${table}:`, err);
                }
            }
        }
    }
    try {
        const filePath = getFilePath(filename);
        if (!fs.existsSync(filePath)) return [];
        const content = fs.readFileSync(filePath, 'utf8');
        const result = JSON.parse(content || '[]');
        setCached(filename, result);
        return result;
    } catch (error) {
        console.error(`Error reading ${filename}:`, error);
        return [];
    }
}

export async function readData(filename) {
    const cached = getCached(filename);
    if (cached !== undefined) return cached;

    const stale = getStale(filename);
    if (stale !== undefined && isStale(filename)) {
        doReadData(filename).catch(() => {}).finally(() => {}); // refresh in background
    }
    if (stale !== undefined) return stale; // instant: return previous data while revalidating

    let promise = pendingReads.get(filename);
    if (promise) return promise;

    promise = doReadData(filename).finally(() => {
        pendingReads.delete(filename);
    });
    pendingReads.set(filename, promise);
    return promise;
}

export async function writeData(filename, data) {
    invalidateCached(filename);
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        const table = TABLE_MAP[filename];
        if (table) {
            try {
                let mappedData = Array.isArray(data) ? data : [data];

                // Map to Supabase lowercase
                if (FIELD_MAPPINGS[table]) {
                    mappedData = mappedData.map(FIELD_MAPPINGS[table].to);
                }

                const { error } = await withTimeout(supabase.from(table).upsert(mappedData));
                if (error) throw error;
                // Keep local file in sync so both admin and website see same data and local fallback works
                try {
                    const filePath = getFilePath(filename);
                    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
                } catch (e) {
                    console.warn(`Local sync write for ${filename}:`, e?.message);
                }
                return true;
            } catch (err) {
                console.error(`Supabase write error for ${table}:`, err);
                // When Supabase is configured, do not silently fall back to local file.
                // Returning false makes API routes surface the failure to admins.
                return false;
            }
        }
        return false;
    }

    try {
        const filePath = getFilePath(filename);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error(`Error writing ${filename}:`, error);
        return false;
    }
}

// Specialized helpers
export const getProducts = () => readData('products.json');
export const saveProducts = (data) => writeData('products.json', data);

export const getDonations = () => readData('donations.json');
export const saveDonations = (data) => writeData('donations.json', data);

export const getOrders = () => readData('orders.json');
export const saveOrders = (data) => writeData('orders.json', data);

export const getUsers = () => readData('users.json');
export const saveUsers = (data) => writeData('users.json', data);

export const getDonorRegistrations = () => readData('donor_registrations.json');
export const saveDonorRegistrations = (data) => writeData('donor_registrations.json', data);

export const getChildren = () => readData('children.json');
export const saveChildren = (data) => writeData('children.json', data);

/** Insert a single user (direct to Supabase when available). */
export async function insertUser(user) {
    invalidateCached('users.json');
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        try {
            const { error } = await withTimeout(supabase.from('users').insert(user));
            if (error) throw error;
            return true;
        } catch (err) {
            console.error('Supabase insert user error:', err);
            return false;
        }
    }
    const filePath = getFilePath('users.json');
    let list = [];
    if (fs.existsSync(filePath)) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            list = JSON.parse(content || '[]');
        } catch (_) {}
    }
    list.push(user);
    try {
        fs.writeFileSync(filePath, JSON.stringify(list, null, 2), 'utf8');
        return true;
    } catch (err) {
        console.error('Error writing users.json:', err);
        return false;
    }
}

/** Delete a user by id (direct from Supabase when available). */
export async function deleteUserById(userId) {
    invalidateCached('users.json');
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        try {
            const { error } = await withTimeout(supabase.from('users').delete().eq('id', userId));
            if (error) throw error;
            return true;
        } catch (err) {
            console.error('Supabase delete user error:', err);
            return false;
        }
    }
    const filePath = getFilePath('users.json');
    if (!fs.existsSync(filePath)) return false;
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const list = JSON.parse(content || '[]').filter((u) => u.id !== userId);
        fs.writeFileSync(filePath, JSON.stringify(list, null, 2), 'utf8');
        return true;
    } catch (err) {
        console.error('Error updating users.json:', err);
        return false;
    }
}

/** Fetch one user by email without loading entire users table. */
export async function getUserByEmail(email) {
    const emailLower = (email || '').trim().toLowerCase();
    if (!emailLower) return null;

    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        try {
            const { data, error } = await withTimeout(
                supabase.from('users').select('*').eq('email', emailLower).limit(1).maybeSingle()
            );
            if (error) throw error;
            return data || null;
        } catch (err) {
            console.error('Supabase get user by email error:', err);
        }
    }

    const users = await readData('users.json');
    return users.find((u) => (u.email || '').trim().toLowerCase() === emailLower) || null;
}
