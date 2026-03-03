-- Run this in Supabase SQL Editor to sync admin panel and website with the database.
-- Creates tables if missing and adds any required columns.

-- PRODUCTS (admin panel + Impact Shop website)
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
ALTER TABLE products ADD COLUMN IF NOT EXISTS instock BOOLEAN DEFAULT true;
ALTER TABLE products ADD COLUMN IF NOT EXISTS purchaseurl TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS pdffile TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS status TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS createdat TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE products ADD COLUMN IF NOT EXISTS features JSONB;

-- ORDERS (website checkout + admin orders list)
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
ALTER TABLE orders ADD COLUMN IF NOT EXISTS total NUMERIC;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS totalprice NUMERIC;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS items JSONB;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS date TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS createdat TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE orders ADD COLUMN IF NOT EXISTS address JSONB;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS products JSONB;

-- DONATIONS
ALTER TABLE donations ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE donations ADD COLUMN IF NOT EXISTS donor_name TEXT;
ALTER TABLE donations ADD COLUMN IF NOT EXISTS recipient TEXT;
ALTER TABLE donations ADD COLUMN IF NOT EXISTS amount NUMERIC;
ALTER TABLE donations ADD COLUMN IF NOT EXISTS program TEXT;
ALTER TABLE donations ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Success';
ALTER TABLE donations ADD COLUMN IF NOT EXISTS date TEXT;
ALTER TABLE donations ADD COLUMN IF NOT EXISTS image TEXT;
ALTER TABLE donations ADD COLUMN IF NOT EXISTS description TEXT;

-- CHILDREN (managed from admin panel, shown on be-a-donor page)
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

-- DONOR REGISTRATIONS (donations submitted from the Be a Donor page)
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
