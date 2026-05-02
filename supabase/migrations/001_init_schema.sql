-- ============================================================
-- Casano Platform — Supabase Schema Migration
-- Run this in: Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- 1. PROFILES (synced from Firebase Auth)
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  uid         TEXT UNIQUE NOT NULL,          -- Firebase UID
  phone       TEXT,
  email       TEXT,
  full_name   TEXT,
  photo_url   TEXT,
  role        TEXT DEFAULT 'customer' CHECK (role IN ('customer','vendor','admin')),
  area        TEXT,
  city        TEXT,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- 2. VENDORS
CREATE TABLE IF NOT EXISTS vendors (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id            UUID REFERENCES profiles(id) ON DELETE SET NULL,
  shop_name             TEXT NOT NULL,
  gst_number            TEXT,
  area                  TEXT,
  city                  TEXT,
  address               TEXT,
  lat                   FLOAT,
  lng                   FLOAT,
  is_open               BOOLEAN DEFAULT true,
  delivery_radius_km    FLOAT DEFAULT 2,
  avg_delivery_minutes  INTEGER DEFAULT 30,
  logo_url              TEXT,
  cover_url             TEXT,
  created_at            TIMESTAMPTZ DEFAULT now(),
  updated_at            TIMESTAMPTZ DEFAULT now()
);

-- 3. PRODUCTS
CREATE TABLE IF NOT EXISTS products (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id        UUID REFERENCES vendors(id) ON DELETE CASCADE,
  name             TEXT NOT NULL,
  description      TEXT,
  category         TEXT DEFAULT 'grocery',
  price            NUMERIC(10,2) NOT NULL,
  mrp              NUMERIC(10,2),
  unit             TEXT DEFAULT 'unit',
  image_url        TEXT,
  is_available     BOOLEAN DEFAULT true,
  stock_quantity   INTEGER DEFAULT 0,
  barcode          TEXT,
  created_at       TIMESTAMPTZ DEFAULT now(),
  updated_at       TIMESTAMPTZ DEFAULT now()
);

-- 4. ORDERS
CREATE TABLE IF NOT EXISTS orders (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id             TEXT NOT NULL,            -- Firebase UID
  vendor_id           UUID REFERENCES vendors(id) ON DELETE SET NULL,
  driver_id           UUID,
  status              TEXT DEFAULT 'PLACED' CHECK (status IN ('PLACED','ACCEPTED','PACKING','ON_THE_WAY','DELIVERED','CANCELLED','PAID')),
  payment_type        TEXT DEFAULT 'COD' CHECK (payment_type IN ('ONLINE','COD')),
  payment_status      TEXT DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING','PAID','FAILED','REFUNDED')),
  selected_upi_app    TEXT,
  subtotal            NUMERIC(10,2) DEFAULT 0,
  delivery_fee        NUMERIC(10,2) DEFAULT 0,
  handling_fee        NUMERIC(10,2) DEFAULT 5,
  total_amount        NUMERIC(10,2) NOT NULL,
  delivery_address    TEXT,
  cod_otp_hash        TEXT,
  razorpay_order_id   TEXT,
  razorpay_payment_id TEXT,
  payment_vpa         TEXT,
  meta                JSONB DEFAULT '{}',
  paid_at             TIMESTAMPTZ,
  created_at          TIMESTAMPTZ DEFAULT now(),
  updated_at          TIMESTAMPTZ DEFAULT now()
);

-- 5. ORDER ITEMS
CREATE TABLE IF NOT EXISTS order_items (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id    UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id  UUID REFERENCES products(id) ON DELETE SET NULL,
  name        TEXT NOT NULL,
  quantity    INTEGER NOT NULL CHECK (quantity > 0),
  unit_price  NUMERIC(10,2) NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- 6. MERCHANT WALLETS
CREATE TABLE IF NOT EXISTS merchant_wallets (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id    UUID UNIQUE REFERENCES vendors(id) ON DELETE CASCADE,
  balance      NUMERIC(12,2) DEFAULT 0.00,
  locked       NUMERIC(12,2) DEFAULT 0.00,  -- in-transit / escrow
  updated_at   TIMESTAMPTZ DEFAULT now()
);

-- 7. LEDGER (every credit/debit)
CREATE TABLE IF NOT EXISTS ledger (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id    UUID REFERENCES vendors(id) ON DELETE CASCADE,
  order_id     UUID REFERENCES orders(id) ON DELETE SET NULL,
  type         TEXT CHECK (type IN ('CREDIT','DEBIT','PLATFORM_FEE','PAYOUT')),
  amount       NUMERIC(10,2) NOT NULL,
  note         TEXT,
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- 8. WHOLESALERS
CREATE TABLE IF NOT EXISTS wholesalers (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id   UUID REFERENCES profiles(id) ON DELETE SET NULL,
  company_name TEXT,
  gst_number   TEXT,
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- ── Indexes ──────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_products_vendor    ON products(vendor_id);
CREATE INDEX IF NOT EXISTS idx_products_category  ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_available ON products(is_available);
CREATE INDEX IF NOT EXISTS idx_orders_user        ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_vendor      ON orders(vendor_id);
CREATE INDEX IF NOT EXISTS idx_orders_status      ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order  ON order_items(order_id);

-- ── RLS ──────────────────────────────────────────
ALTER TABLE profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors          ENABLE ROW LEVEL SECURITY;
ALTER TABLE products         ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders           ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items      ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchant_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ledger           ENABLE ROW LEVEL SECURITY;

-- Products: anyone can read, service role writes
DROP POLICY IF EXISTS products_select ON products;
CREATE POLICY products_select ON products FOR SELECT USING (is_available = true);

-- Orders: user sees only their own
DROP POLICY IF EXISTS orders_select_user ON orders;
CREATE POLICY orders_select_user ON orders FOR SELECT USING (user_id = auth.uid()::text);

-- Service role bypasses all RLS (set in backend using service_role key)

-- ── Realtime publications ─────────────────────────
-- Enable in Supabase Dashboard → Database → Replication → products, orders, order_items
-- Or run:
-- ALTER PUBLICATION supabase_realtime ADD TABLE products;
-- ALTER PUBLICATION supabase_realtime ADD TABLE orders;
