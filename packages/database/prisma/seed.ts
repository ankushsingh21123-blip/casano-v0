import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing old data...');
  await prisma.salesLog.deleteMany();
  await prisma.returnRequest.deleteMany();
  await prisma.order.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.product.deleteMany();
  await prisma.merchant.deleteMany();

  console.log('Seeding new Hyperlocal Demo data...');

  // 1. Create Core Merchants (The "Nodes")
  const merchants = [
    { name: "Sri Balaji Kirana", lat: 12.9716, lng: 77.5946, status: "Active" }, // Central
    { name: "A1 Stationery & Xerox", lat: 12.9698, lng: 77.5960, status: "Active" }, // Nearby
    { name: "Gupta General Store", lat: 12.9750, lng: 77.5900, status: "Active" }, // Node 3
    { name: "FreshMart Daily", lat: 12.9650, lng: 77.6000, status: "Active" } // Edge of 1km
  ];

  const createdMerchants = [];
  for (const m of merchants) {
    const mc = await prisma.merchant.create({
      data: {
        name: m.name,
        latitude: m.lat,
        longitude: m.lng,
        platform_fee_percent: 5.0
      }
    });
    createdMerchants.push(mc);
  }

  const mainMerchant = createdMerchants[0];
  const stationeryMerchant = createdMerchants[1];

  // 2. Seed Products (High Volume)
  const productBlueprints = [
    // Daily Essentials (Main Merchant)
    { m: mainMerchant, name: "Aashirvaad Atta 5kg", category: "Daily Essentials", sp: 240, cp: 215, stock: 50, buffer: 5 },
    { m: mainMerchant, name: "Amul Taaza Milk 1L", category: "Daily Essentials", sp: 68, cp: 65, stock: 120, buffer: 20 },
    { m: mainMerchant, name: "Tata Salt 1kg", category: "Daily Essentials", sp: 25, cp: 22, stock: 200, buffer: 20 },
    { m: mainMerchant, name: "Maggi 2-Minute Noodles", category: "Daily Essentials", sp: 14, cp: 11, stock: 8, buffer: 10 }, // Low stock edge case
    { m: mainMerchant, name: "Fortune Sunflower Oil 1L", category: "Daily Essentials", sp: 180, cp: 160, stock: 35, buffer: 10 },
    { m: mainMerchant, name: "Surf Excel Matic 1kg", category: "Daily Essentials", sp: 220, cp: 195, stock: 40, buffer: 8 },

    // Marts / Snacks (Main Merchant)
    { m: mainMerchant, name: "Lays India's Magic Masala", category: "Marts", sp: 20, cp: 16, stock: 150, buffer: 30 },
    { m: mainMerchant, name: "Coca Cola 1.25L", category: "Marts", sp: 65, cp: 52, stock: 80, buffer: 15 },
    { m: mainMerchant, name: "Oreo Original 120g", category: "Marts", sp: 30, cp: 24, stock: 0, buffer: 5 }, // Out of stock edge case (Will trigger DMart logic)
    { m: mainMerchant, name: "Haldiram's Bhujia Sev", category: "Marts", sp: 45, cp: 36, stock: 65, buffer: 15 },

    // Perishables (Main Merchant)
    { m: mainMerchant, name: "Farm Fresh Eggs (6 Pack)", category: "Perishable", sp: 45, cp: 38, stock: 30, buffer: 5 },
    { m: mainMerchant, name: "Brown Bread 400g", category: "Perishable", sp: 40, cp: 32, stock: 25, buffer: 5 },

    // Stationery (Stationery Merchant - to show node diversity)
    { m: stationeryMerchant, name: "Reynolds 045 Fine Carb", category: "Stationery", sp: 5, cp: 3, stock: 300, buffer: 50 },
    { m: stationeryMerchant, name: "Classmate Notebook 172pg", category: "Stationery", sp: 45, cp: 35, stock: 120, buffer: 20 },
    { m: stationeryMerchant, name: "A4 Copy Paper Bundle", category: "Stationery", sp: 180, cp: 140, stock: 15, buffer: 5 },
    { m: stationeryMerchant, name: "Cello Gripper Blue", category: "Stationery", sp: 10, cp: 7, stock: 42, buffer: 50 }, // Prediction trigger (stock < buffer)
    { m: stationeryMerchant, name: "Fevicol MR 100g", category: "Stationery", sp: 45, cp: 35, stock: 65, buffer: 10 },
  ];

  for (const b of productBlueprints) {
    await prisma.product.create({
      data: {
        merchant_id: b.m.id,
        name: b.name,
        category: b.category,
        selling_price: b.sp,
        cost_price: b.cp,
        total_stock: b.stock,
        app_reserved_stock: b.stock,
        safety_buffer: b.buffer,
        is_live: true
      }
    });
  }

  // 3. Create a Demo Customer
  const testCustomer = await prisma.customer.create({
    data: {
      name: "Sumit T.",
      phone: "+919999999999",
      trust_score: 100,
      cod_blocked: false
    }
  });

  // 4. Prime the Analytics engine with historical SalesLogs (Last 7 days)
  console.log('Priming Analytics Matrix...');
  const allProducts = await prisma.product.findMany();
  const today = new Date();

  for (const prod of allProducts) {
    // Generate between 5 to 20 sales logs per product
    const iterations = Math.floor(Math.random() * 15) + 5;

    for (let i = 0; i < iterations; i++) {
      const daysAgo = Math.floor(Math.random() * 7);
      const date = new Date(today);
      date.setDate(date.getDate() - daysAgo);

      await prisma.salesLog.create({
        data: {
          merchant_id: prod.merchant_id,
          product_id: prod.id,
          quantity: Math.floor(Math.random() * 3) + 1,
          sale_type: Math.random() > 0.6 ? 'Walk-in' : 'App',
          created_at: date
        }
      });
    }
  }

  console.log('🚀 Ultimate PWA Investor Demo Dataset Seeded Successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
