const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Standard connection assuming Docker is running on localhost:5432
const db = new Pool({ connectionString: process.env.DATABASE_URL || 'postgres://postgres:secret@localhost:5432/antigravity' });

async function seedDatabase() {
    console.log("🌱 Starting Antigravity Database Seeding Process...");

    const client = await db.connect();

    try {
        await client.query('BEGIN');

        // 1. Ensure Schema Exists
        console.log("1️⃣  Executing schema.sql...");
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        await client.query(schema);
        console.log("   ✅ Schema created successfully.");

        // 2. Clear Existing Data (for clean runs)
        console.log("2️⃣  Clearing existing data...");
        await client.query('TRUNCATE shops, products, inventory, users CASCADE;');

        // 3. Insert Mock Products (Every Kirana store has these)
        console.log("3️⃣  Inserting Core Products Catalog...");
        const products = [
            { name: 'Amul Taaza Milk 500ml', category: 'Dairy', weight: '500ml', image_url: 'https://placehold.co/400x400/1e40af/ffffff?text=Amul+Milk' },
            { name: 'Britannia White Bread', category: 'Bakery', weight: '400g', image_url: 'https://placehold.co/400x400/991b1b/ffffff?text=Britannia+Bread' },
            { name: 'Aashirvaad Whole Wheat Atta', category: 'Staples', weight: '5kg', image_url: 'https://placehold.co/400x400/065f46/ffffff?text=Aashirvaad+Atta' },
            { name: 'Maggi 2-Minute Noodles', category: 'Snacks', weight: '280g', image_url: 'https://placehold.co/400x400/ca8a04/ffffff?text=Maggi+Noodles' },
            { name: 'Coca-Cola Can', category: 'Beverages', weight: '300ml', image_url: 'https://placehold.co/400x400/b91c1c/ffffff?text=Coca+Cola' }
        ];

        const productIds = [];
        for (const p of products) {
            const res = await client.query(
                `INSERT INTO products (name, category, image_url) VALUES ($1, $2, $3) RETURNING product_id`,
                [p.name, p.category, p.image_url]
            );
            productIds.push(res.rows[0].product_id);
        }

        // 4. Insert Mock Shops (Scattered around a central point, e.g., Connaught Place, Delhi)
        console.log("4️⃣  Inserting Local Kirana Shops (Geo-Spatial Data)...");
        // Center: Lat: 28.6304, Lng: 77.2177 (Delhi)
        const shops = [
            { name: "Gupta General Store", phone: "+919876543210", gst: "22AAAAA0000A1Z5", lat: 28.6310, lng: 77.2180 }, // Very close
            { name: "Sharma Provision Store", phone: "+919876543211", gst: "22BBBBB0000B1Z5", lat: 28.6290, lng: 77.2150 }, // Close
            { name: "SuperMart 24/7", phone: "+919876543212", gst: "22CCCCC0000C1Z5", lat: 28.6400, lng: 77.2200 }   // A bit further
        ];

        const shopIds = [];
        for (const s of shops) {
            const res = await client.query(
                `INSERT INTO shops (shop_name, gstin, location) 
                 VALUES ($1, $2, ST_SetSRID(ST_MakePoint($3, $4), 4326)) 
                 RETURNING shop_id`,
                [s.name, s.gst, s.lng, s.lat] // Note PostGIS requires Lng, Lat order
            );
            shopIds.push(res.rows[0].shop_id);
        }

        // 5. Seed Inventory Levels (Assigning products to shops with prices and quantities)
        console.log("5️⃣  Populating Shop Inventory...");
        for (const sid of shopIds) {
            for (const pid of productIds) {
                // Randomize stock (0 to 50) and slight price variations
                const qty = Math.floor(Math.random() * 50);
                // e.g., Base price 50, varies by up to 10 rupees
                const price = 50 + Math.floor(Math.random() * 10);

                await client.query(
                    `INSERT INTO inventory (shop_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)`,
                    [sid, pid, qty, price]
                );
            }
        }

        await client.query('COMMIT');
        console.log("🎉 Database Successfully Seeded! The API is ready for testing.");

    } catch (e) {
        await client.query('ROLLBACK');
        console.error("❌ Seeding Failed. Rolling back changes:", e);
    } finally {
        client.release();
        await db.end();
    }
}

seedDatabase();
