-- ============================================================
-- CASANO — Supabase Schema + RLS Policies
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  role text check (role in ('user', 'vendor', 'wholesaler')) default 'user',
  full_name text,
  phone text,
  area text,
  city text,
  created_at timestamptz default now()
);

create table if not exists vendors (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references profiles(id) on delete cascade,
  shop_name text not null,
  shop_type text check (shop_type in ('kirana', 'sabziwala', 'dairy', 'food', 'other')) default 'kirana',
  description text,
  address text,
  area text,
  city text,
  lat float,
  lng float,
  is_open boolean default true,
  delivery_radius_km float default 2,
  avg_delivery_minutes int default 20,
  rating float default 0,
  total_orders int default 0,
  is_active boolean default false,
  created_at timestamptz default now()
);

create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  vendor_id uuid references vendors(id) on delete cascade,
  name text not null,
  description text,
  category text,
  price numeric not null,
  unit text,
  stock_quantity int default 0,
  image_url text,
  is_available boolean default true,
  created_at timestamptz default now()
);

create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete set null,
  vendor_id uuid references vendors(id) on delete set null,
  status text check (status in ('pending','accepted','preparing','out_for_delivery','delivered','cancelled')) default 'pending',
  total_amount numeric not null,
  delivery_address text,
  delivery_area text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  quantity int not null,
  price_at_order numeric not null
);

create table if not exists wholesalers (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references profiles(id) on delete cascade,
  business_name text not null,
  category text check (category in ('produce','grocery','dairy','fmcg','other')) default 'grocery',
  min_order_value numeric default 0,
  area text,
  city text,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists wholesale_products (
  id uuid primary key default uuid_generate_v4(),
  wholesaler_id uuid references wholesalers(id) on delete cascade,
  name text not null,
  category text,
  price_per_unit numeric not null,
  unit text,
  min_quantity int default 1,
  stock_available int default 0,
  image_url text,
  is_available boolean default true
);

create table if not exists wholesale_inquiries (
  id uuid primary key default uuid_generate_v4(),
  vendor_id uuid references vendors(id) on delete cascade,
  wholesaler_id uuid references wholesalers(id) on delete cascade,
  product_id uuid references wholesale_products(id) on delete set null,
  quantity_requested int not null,
  status text check (status in ('pending','accepted','rejected')) default 'pending',
  message text,
  created_at timestamptz default now()
);

-- ============================================================
-- REALTIME
-- ============================================================
alter publication supabase_realtime add table orders;
alter publication supabase_realtime add table wholesale_inquiries;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table profiles enable row level security;
alter table vendors enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table wholesalers enable row level security;
alter table wholesale_products enable row level security;
alter table wholesale_inquiries enable row level security;

-- ---- profiles ----
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

-- ---- vendors ----
create policy "Anyone authenticated can read active vendors" on vendors for select to authenticated using (is_active = true);
create policy "Vendors can manage own record" on vendors for all using (profile_id = auth.uid());

-- ---- products ----
create policy "Anyone authenticated can read available products" on products for select to authenticated using (is_available = true);
create policy "Vendors can manage own products" on products for all using (
  vendor_id in (select id from vendors where profile_id = auth.uid())
);

-- ---- orders ----
create policy "Users can read own orders" on orders for select using (user_id = auth.uid());
create policy "Users can insert orders" on orders for insert with check (user_id = auth.uid());
create policy "Vendors can read their orders" on orders for select using (
  vendor_id in (select id from vendors where profile_id = auth.uid())
);
create policy "Vendors can update their orders" on orders for update using (
  vendor_id in (select id from vendors where profile_id = auth.uid())
);

-- ---- order_items ----
create policy "Users can read own order items" on order_items for select using (
  order_id in (select id from orders where user_id = auth.uid())
);
create policy "Users can insert order items" on order_items for insert with check (
  order_id in (select id from orders where user_id = auth.uid())
);
create policy "Vendors can read their order items" on order_items for select using (
  order_id in (select id from orders where vendor_id in (select id from vendors where profile_id = auth.uid()))
);

-- ---- wholesalers ----
create policy "Authenticated users can read wholesalers" on wholesalers for select to authenticated using (is_active = true);
create policy "Wholesalers can manage own record" on wholesalers for all using (profile_id = auth.uid());

-- ---- wholesale_products ----
create policy "Authenticated users can read wholesale products" on wholesale_products for select to authenticated using (is_available = true);
create policy "Wholesalers can manage own products" on wholesale_products for all using (
  wholesaler_id in (select id from wholesalers where profile_id = auth.uid())
);

-- ---- wholesale_inquiries ----
create policy "Vendors can manage own inquiries" on wholesale_inquiries for all using (
  vendor_id in (select id from vendors where profile_id = auth.uid())
);
create policy "Wholesalers can read and update their inquiries" on wholesale_inquiries for select using (
  wholesaler_id in (select id from wholesalers where profile_id = auth.uid())
);
create policy "Wholesalers can update inquiry status" on wholesale_inquiries for update using (
  wholesaler_id in (select id from wholesalers where profile_id = auth.uid())
);

-- ============================================================
-- STORAGE BUCKET (run separately or via Supabase dashboard)
-- ============================================================
-- insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true);
-- create policy "Anyone can view product images" on storage.objects for select using (bucket_id = 'product-images');
-- create policy "Authenticated users can upload product images" on storage.objects for insert to authenticated with check (bucket_id = 'product-images');
