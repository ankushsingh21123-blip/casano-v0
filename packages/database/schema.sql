CREATE EXTENSION IF NOT EXISTS postgis;
CREATE TABLE users (
user_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
phone      VARCHAR(15) UNIQUE NOT NULL,
role       VARCHAR(20) NOT NULL CHECK (role IN ('customer','shopkeeper','delivery', 'admin')),
name       VARCHAR(100),
fcm_token  TEXT,
loyalty_points INT DEFAULT 0,
referral_code  VARCHAR(10) UNIQUE,
current_streak INT DEFAULT 0,
max_streak     INT DEFAULT 0,
last_order_date TIMESTAMP,
created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE shops (
shop_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
owner_id     UUID REFERENCES users(user_id),
shop_name    VARCHAR(200) NOT NULL,
shop_type    VARCHAR(50),
location     GEOMETRY(POINT, 4326),
address      TEXT,
radius_km    FLOAT DEFAULT 3,
rating       FLOAT DEFAULT 5.0,
total_orders INT DEFAULT 0,
is_active    BOOLEAN DEFAULT false,
is_verified  BOOLEAN DEFAULT false,
hours_open   TIME,
hours_close  TIME,
gstin        VARCHAR(50),
created_at   TIMESTAMP DEFAULT NOW()
);

CREATE TABLE products (
product_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
name       VARCHAR(200) NOT NULL,
brand      VARCHAR(100),
category   VARCHAR(100),
barcode    VARCHAR(50),
image_url  TEXT,
tags       TEXT[]
);

CREATE TABLE inventory (
shop_id         UUID REFERENCES shops(shop_id),
product_id      UUID REFERENCES products(product_id),
quantity        INT DEFAULT 0,
price           DECIMAL(10,2),
has_extra_stock BOOLEAN DEFAULT false,
updated_at      TIMESTAMP DEFAULT NOW(),
PRIMARY KEY (shop_id, product_id)
);

CREATE TABLE orders (
order_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
customer_id       UUID REFERENCES users(user_id),
shop_id           UUID REFERENCES shops(shop_id),
delivery_id       UUID REFERENCES users(user_id),
items             JSONB NOT NULL,
status            VARCHAR(30) DEFAULT 'pending',
shop_verified     BOOLEAN DEFAULT false,
delivery_verified BOOLEAN DEFAULT false,
customer_verified BOOLEAN DEFAULT false,
delivery_otp      VARCHAR(6),
item_total        DECIMAL(10,2),
delivery_charge   DECIMAL(10,2),
platform_fee      DECIMAL(10,2),
grand_total       DECIMAL(10,2),
razorpay_order_id VARCHAR(100),
payment_id        VARCHAR(100),
payment_status    VARCHAR(20) DEFAULT 'pending',
created_at        TIMESTAMP DEFAULT NOW(),
delivered_at      TIMESTAMP
);

CREATE TABLE loyalty_ledger (
id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
user_id    UUID REFERENCES users(user_id),
points     INT NOT NULL,
event_type VARCHAR(50),
metadata   JSONB,
created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE referrals (
id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
referrer_id UUID REFERENCES users(user_id),
referred_id UUID REFERENCES users(user_id),
status      VARCHAR(20) DEFAULT 'pending',
created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE refunds (
id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
order_id   UUID REFERENCES orders(order_id),
amount     DECIMAL(10,2),
reason     VARCHAR(50),
status     VARCHAR(30) DEFAULT 'pending',
evidence   JSONB,
created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE offers (
offer_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
user_id     UUID REFERENCES users(user_id),
type        VARCHAR(30),
value       DECIMAL(10,2),
min_order   DECIMAL(10,2) DEFAULT 0,
valid_until TIMESTAMP,
used        BOOLEAN DEFAULT false,
created_at  TIMESTAMP DEFAULT NOW()
);

CREATE INDEX ON shops USING GIST(location);
CREATE INDEX ON orders(customer_id);
CREATE INDEX ON orders(shop_id);
CREATE INDEX ON orders(delivery_id);
CREATE INDEX ON inventory(product_id);
