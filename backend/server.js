import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import crypto from 'crypto';
import admin from 'firebase-admin';

dotenv.config();

/* ─── Firebase Admin init ─── */
let firebaseAdmin = null;
try {
  if (process.env.FIREBASE_ADMIN_SDK_JSON) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK_JSON);
    if (!admin.apps.length) {
      admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    }
    firebaseAdmin = admin;
    console.log('[Firebase Admin] Initialized');
  } else {
    console.warn('[Firebase Admin] FIREBASE_ADMIN_SDK_JSON not set — auth exchange disabled');
  }
} catch (e) {
  console.error('[Firebase Admin] Init failed:', e.message);
}

/* ─── Express + Socket.io ─── */
const app = express();
const httpServer = createServer(app);

const ALLOWED_ORIGINS = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  process.env.MERCHANT_URL || 'http://localhost:3001',
  'https://casano.in',
  'https://www.casano.in',
].filter(Boolean);

const io = new Server(httpServer, {
  cors: { origin: ALLOWED_ORIGINS, methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'], credentials: true },
});

io.on('connection', (socket) => {
  socket.on('join', (roomId) => { socket.join(roomId); });
  socket.on('leave', (roomId) => { socket.leave(roomId); });
  socket.on('disconnect', () => {});
});

app.set('io', io);

/* ─── Middleware ─── */
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: ALLOWED_ORIGINS, credentials: true, methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'] }));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

/* ─── Supabase Admin Client ─── */
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);
app.use((req, _res, next) => { req.supabase = supabase; next(); });

/* ─── Simple rate limiter (in-memory) ─── */
const rateLimitMap = new Map();
function rateLimit(key, maxReq, windowMs) {
  const now = Date.now();
  const entry = rateLimitMap.get(key) || { count: 0, start: now };
  if (now - entry.start > windowMs) { entry.count = 0; entry.start = now; }
  entry.count++;
  rateLimitMap.set(key, entry);
  return entry.count > maxReq;
}

/* ─── Auth Middleware ─── */
const authenticateUser = async (req, res, next) => {
  try {
    // Check httpOnly cookie first
    const sessionToken = req.cookies?.casano_session;
    if (sessionToken) {
      const decoded = jwt.verify(sessionToken, process.env.JWT_SECRET || 'casano-secret');
      req.user = decoded;
      return next();
    }
    // Fallback: Bearer token
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (error || !user) return res.status(401).json({ error: 'Unauthorized' });
      req.user = user;
      return next();
    }
    return res.status(401).json({ error: 'No auth token provided' });
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

/* ═══════════════════════════════════════════
   AUTH ROUTES
═══════════════════════════════════════════ */

// POST /api/auth/firebase-exchange
app.post('/api/auth/firebase-exchange', async (req, res) => {
  const ip = req.ip || req.connection.remoteAddress;
  if (rateLimit(`auth:${ip}`, 10, 15 * 60 * 1000)) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  const schema = z.object({ idToken: z.string().min(10) });
  const parse = schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: 'Missing idToken' });

  if (!firebaseAdmin) {
    return res.status(503).json({ error: 'Firebase Admin not configured' });
  }

  try {
    const decoded = await firebaseAdmin.auth().verifyIdToken(parse.data.idToken);
    const { uid, phone_number, email, name, picture } = decoded;

    // Upsert into profiles table
    const profileData = {
      id: uid,
      uid,
      phone: phone_number || null,
      email: email || null,
      full_name: name || null,
      photo_url: picture || null,
      role: 'customer',
      updated_at: new Date().toISOString(),
    };

    const { data: profile, error: upsertError } = await supabase
      .from('profiles')
      .upsert(profileData, { onConflict: 'uid' })
      .select()
      .single();

    if (upsertError) {
      console.error('[auth/exchange] upsert error:', upsertError);
      // Try to read existing profile if upsert failed
      const { data: existing } = await supabase.from('profiles').select('*').eq('uid', uid).single();
      if (!existing) return res.status(500).json({ error: 'Profile creation failed' });
    }

    // Mint session JWT
    const sessionPayload = { uid, role: 'customer', sub: uid };
    const sessionToken = jwt.sign(sessionPayload, process.env.JWT_SECRET || 'casano-secret', { expiresIn: '7d' });

    res.cookie('casano_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    return res.json({ user: profile || profileData });
  } catch (err) {
    console.error('[auth/exchange]', err.message);
    return res.status(401).json({ error: 'Invalid Firebase token', details: err.message });
  }
});

// GET /api/auth/me
app.get('/api/auth/me', authenticateUser, async (req, res) => {
  try {
    const uid = req.user.uid || req.user.sub;
    const { data, error } = await supabase.from('profiles').select('*').eq('uid', uid).single();
    if (error || !data) return res.status(404).json({ error: 'Profile not found' });
    return res.json({ user: data });
  } catch {
    return res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/logout
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('casano_session', { path: '/' });
  return res.json({ success: true });
});

// PATCH /api/auth/profile/:id
app.patch('/api/auth/profile/:id', authenticateUser, async (req, res) => {
  try {
    const { data, error } = await supabase.from('profiles').update(req.body).eq('uid', req.params.id).select().single();
    if (error) throw error;
    res.json({ data });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ═══════════════════════════════════════════
   CATALOG
═══════════════════════════════════════════ */

// GET /api/catalog
app.get('/api/catalog', async (req, res) => {
  try {
    const { lat, lng, radius = 5, q, category } = req.query;

    let productQuery = supabase
      .from('products')
      .select('*, vendors(id, shop_name, area, city, is_open, avg_delivery_minutes, delivery_radius_km)')
      .eq('is_available', true)
      .order('name');

    if (q) productQuery = productQuery.ilike('name', `%${q}%`);
    if (category) productQuery = productQuery.eq('category', category);

    const { data: products, error } = await productQuery.limit(100);
    if (error) throw error;

    let vendorQuery = supabase.from('vendors').select('*').eq('is_open', true);
    const { data: vendors } = await vendorQuery;

    return res.json({ products: products || [], vendors: vendors || [], meta: { lat, lng, radius } });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/* ═══════════════════════════════════════════
   ORDERS
═══════════════════════════════════════════ */

const orderSchema = z.object({
  cart: z.array(z.object({
    id: z.string(),
    quantity: z.number().int().positive(),
    price: z.number().positive(),
    name: z.string(),
  })).min(1),
  vendor_id: z.string().optional(),
  addressId: z.string().optional(),
  delivery_address: z.string().optional(),
  paymentType: z.enum(['ONLINE', 'COD']).default('COD'),
  selected_upi_app: z.enum(['GPAY','PHONEPE','PAYTM','SUPERMONEY']).optional(),
  meta: z.record(z.any()).optional(),
});

// POST /api/orders/create
app.post('/api/orders/create', authenticateUser, async (req, res) => {
  const ip = req.ip;
  if (rateLimit(`orders:${req.user.uid || ip}`, 10, 60 * 1000)) {
    return res.status(429).json({ error: 'Too many orders. Please slow down.' });
  }

  const parse = orderSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: 'Invalid order data', details: parse.error.flatten() });

  const { cart, vendor_id, addressId, delivery_address, paymentType, selected_upi_app, meta } = parse.data;
  const uid = req.user.uid || req.user.sub;

  try {
    // Server-side price recomputation
    const productIds = cart.map(i => i.id);
    const { data: dbProducts, error: prodErr } = await supabase
      .from('products')
      .select('id, price, name, is_available')
      .in('id', productIds);

    if (prodErr) throw prodErr;

    const priceMap = {};
    for (const p of dbProducts) priceMap[p.id] = p;

    // Validate items & compute total
    let serverTotal = 0;
    const validatedItems = [];
    for (const item of cart) {
      const dbProd = priceMap[item.id];
      if (!dbProd || !dbProd.is_available) {
        return res.status(400).json({ error: `Product "${item.name}" is no longer available` });
      }
      serverTotal += dbProd.price * item.quantity;
      validatedItems.push({ product_id: item.id, quantity: item.quantity, unit_price: dbProd.price, name: dbProd.name });
    }

    const handlingFee = 5;
    const deliveryFee = 0;
    const totalAmount = serverTotal + handlingFee + deliveryFee;

    // Generate COD OTP if needed
    const codOtp = paymentType === 'COD' ? Math.floor(1000 + Math.random() * 9000).toString() : null;

    // Insert order
    const { data: order, error: orderErr } = await supabase.from('orders').insert({
      user_id: uid,
      vendor_id: vendor_id || null,
      status: 'PLACED',
      payment_type: paymentType,
      payment_status: 'PENDING',
      selected_upi_app: selected_upi_app || null,
      subtotal: serverTotal,
      handling_fee: handlingFee,
      delivery_fee: deliveryFee,
      total_amount: totalAmount,
      delivery_address: delivery_address || null,
      cod_otp_hash: codOtp ? crypto.createHash('sha256').update(codOtp).digest('hex') : null,
      meta: meta || {},
    }).select().single();

    if (orderErr) throw orderErr;

    // Insert order items
    const itemRows = validatedItems.map(i => ({ ...i, order_id: order.id }));
    await supabase.from('order_items').insert(itemRows);

    // Emit to vendor and admin
    io.to(`vendor_${vendor_id}`).emit('orderCreated', { ...order, items: validatedItems });
    io.to('admin_ops').emit('orderCreated', order);

    // Handle Razorpay for ONLINE
    if (paymentType === 'ONLINE') {
      try {
        if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
          const { default: Razorpay } = await import('razorpay');
          const rzp = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
          const rzpOrder = await rzp.orders.create({
            amount: Math.round(totalAmount * 100), // paise
            currency: 'INR',
            receipt: order.id,
            notes: { order_id: order.id, selected_upi_app: selected_upi_app || '' },
          });

          await supabase.from('orders').update({ razorpay_order_id: rzpOrder.id }).eq('id', order.id);

          return res.status(201).json({
            orderId: order.id,
            razorpayOrderId: rzpOrder.id,
            razorpayKey: process.env.RAZORPAY_KEY_ID,
            amount: totalAmount,
          });
        }
      } catch (rzpErr) {
        console.error('[Razorpay]', rzpErr.message);
      }
    }

    return res.status(201).json({
      orderId: order.id,
      totalAmount,
      paymentType,
      ...(codOtp ? { codOtp } : {}),
    });
  } catch (err) {
    console.error('[orders/create]', err);
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/orders/:orderId
app.get('/api/orders/:orderId', authenticateUser, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, products(name, image_url))')
      .eq('id', req.params.orderId)
      .single();
    if (error) throw error;
    res.json({ data });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ═══════════════════════════════════════════
   PAYMENTS WEBHOOK
═══════════════════════════════════════════ */

// POST /api/payments/webhook (Razorpay)
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['x-razorpay-signature'];
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (secret) {
    const expected = crypto.createHmac('sha256', secret).update(req.body).digest('hex');
    if (sig !== expected) {
      console.warn('[webhook] Signature mismatch');
      return res.status(400).json({ error: 'Invalid signature' });
    }
  }

  let event;
  try { event = JSON.parse(req.body); } catch { return res.status(400).json({ error: 'Invalid JSON' }); }

  if (event.event === 'payment.captured') {
    const payment = event.payload.payment.entity;
    const rzpOrderId = payment.order_id;

    try {
      const { data: order } = await supabase.from('orders').select('*').eq('razorpay_order_id', rzpOrderId).single();
      if (order) {
        await supabase.from('orders').update({
          status: 'PAID',
          payment_status: 'PAID',
          razorpay_payment_id: payment.id,
          payment_vpa: payment.vpa || null,
          paid_at: new Date().toISOString(),
        }).eq('id', order.id);

        // Emit to vendor and user
        io.to(`vendor_${order.vendor_id}`).emit('orderPaid', { orderId: order.id, status: 'PAID' });
        io.to(`order_${order.id}`).emit('order_status', { status: 'PAID' });
        io.to('admin_ops').emit('orderPaid', { orderId: order.id });
      }
    } catch (err) { console.error('[webhook] update failed:', err.message); }
  }

  return res.json({ received: true });
});

/* ═══════════════════════════════════════════
   RIDER / DRIVER LOCATION
═══════════════════════════════════════════ */

// POST /api/rider/location
app.post('/api/rider/location', async (req, res) => {
  const schema = z.object({
    orderId: z.string(),
    lat: z.number(),
    lng: z.number(),
    heading: z.number().optional(),
    eta: z.number().optional(),
  });
  const parse = schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: 'Invalid location data' });

  const { orderId, lat, lng, heading, eta } = parse.data;
  io.to(`order_${orderId}`).emit('driver_location', { lat, lng, heading, eta, timestamp: Date.now() });
  return res.json({ ok: true });
});

/* ═══════════════════════════════════════════
   ORDER STATUS UPDATE (Merchant)
═══════════════════════════════════════════ */

app.patch('/api/orders/:orderId/status', authenticateUser, async (req, res) => {
  try {
    const { status } = req.body;
    const { data, error } = await supabase.from('orders').update({ status }).eq('id', req.params.orderId).select().single();
    if (error) throw error;
    io.to(`order_${data.id}`).emit('order_status', { status, orderId: data.id });
    io.to(`vendor_${data.vendor_id}`).emit('orderUpdated', data);
    io.to(`user_${data.user_id}`).emit('orderUpdated', data);
    res.json({ data });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ═══════════════════════════════════════════
   EXISTING ROUTES (vendors, products, etc.)
═══════════════════════════════════════════ */

app.get('/api/vendors', async (req, res) => {
  try {
    const { data, error } = await req.supabase.from('vendors').select('*').eq('is_open', true).order('created_at', { ascending: false });
    if (error) throw error;
    res.json({ data });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/products', async (req, res) => {
  try {
    const { data, error } = await req.supabase.from('products').select('*, vendors(shop_name, area)').eq('is_available', true).order('name');
    if (error) throw error;
    res.json({ data });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/products/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json({ data: [] });
    const { data, error } = await req.supabase.from('products').select('*, vendors(shop_name, area)').eq('is_available', true).ilike('name', `%${q}%`).order('name').limit(30);
    if (error) throw error;
    res.json({ data });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/products/:productId', async (req, res) => {
  try {
    const { data, error } = await req.supabase.from('products').select('*').eq('id', req.params.productId).single();
    if (error) throw error;
    res.json({ data });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/products', async (req, res) => {
  try {
    const { data, error } = await req.supabase.from('products').insert(req.body).select().single();
    if (error) throw error;
    res.status(201).json({ data });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.patch('/api/products/:productId', async (req, res) => {
  try {
    const { data, error } = await req.supabase.from('products').update(req.body).eq('id', req.params.productId).select().single();
    if (error) throw error;
    io.emit('product_updated', data);
    res.json({ data });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.patch('/api/products/:productId/availability', async (req, res) => {
  try {
    const { is_available } = req.body;
    const { data, error } = await req.supabase.from('products').update({ is_available }).eq('id', req.params.productId).select().single();
    if (error) throw error;
    io.emit('product_updated', data);
    res.json({ data });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/vendors/profile/:profileId', authenticateUser, async (req, res) => {
  try {
    const { data, error } = await req.supabase.from('vendors').select('*').eq('profile_id', req.params.profileId).single();
    if (error) throw error;
    res.json({ data });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/vendors/:vendorId', async (req, res) => {
  try {
    const { data, error } = await req.supabase.from('vendors').select('*').eq('id', req.params.vendorId).single();
    if (error) throw error;
    res.json({ data });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.patch('/api/vendors/:vendorId', async (req, res) => {
  try {
    const { data, error } = await req.supabase.from('vendors').update(req.body).eq('id', req.params.vendorId).select().single();
    if (error) throw error;
    res.json({ data });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/vendors', async (req, res) => {
  try {
    const { profile_id, area, city, ...vendorData } = req.body;
    const { data: vendor, error } = await req.supabase.from('vendors').insert({ ...vendorData, profile_id, area, city, is_open: true, delivery_radius_km: 2, avg_delivery_minutes: 30 }).select().single();
    if (error) throw error;
    await req.supabase.from('profiles').update({ role: 'vendor', area, city }).eq('id', profile_id);
    res.status(201).json({ data: vendor });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/vendors/:vendorId/orders', authenticateUser, async (req, res) => {
  try {
    const { data, error } = await req.supabase.from('orders').select('*, profiles(full_name), order_items(*, products(name))').eq('vendor_id', req.params.vendorId).order('created_at', { ascending: false });
    if (error) throw error;
    res.json({ data });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/vendors/:vendorId/products', async (req, res) => {
  try {
    let query = req.supabase.from('products').select('*').eq('vendor_id', req.params.vendorId);
    if (req.query.available_only === 'true') query = query.eq('is_available', true).order('category').order('name');
    else query = query.order('created_at', { ascending: false });
    const { data, error } = await query;
    if (error) throw error;
    res.json({ data });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.patch('/api/vendors/:vendorId/status', async (req, res) => {
  try {
    const { is_open } = req.body;
    const { data, error } = await req.supabase.from('vendors').update({ is_open }).eq('id', req.params.vendorId);
    if (error) throw error;
    res.json({ data });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/users/:userId/orders', authenticateUser, async (req, res) => {
  try {
    const { data, error } = await req.supabase.from('orders').select('*, vendors(shop_name), order_items(*, products(name))').eq('user_id', req.params.userId).order('created_at', { ascending: false });
    if (error) throw error;
    res.json({ data });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Legacy order endpoint
app.post('/api/orders', authenticateUser, async (req, res) => {
  try {
    const { items, ...orderData } = req.body;
    const { data: order, error: orderError } = await req.supabase.from('orders').insert({ ...orderData, status: 'pending' }).select().single();
    if (orderError) throw orderError;
    const orderItems = items.map(item => ({ ...item, order_id: order.id }));
    await req.supabase.from('order_items').insert(orderItems);
    io.to(`vendor_${order.vendor_id}`).emit('orderCreated', order);
    io.to(`user_${order.user_id}`).emit('orderCreated', order);
    res.status(201).json({ data: order });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ─── Wholesale (unchanged) ─── */
app.get('/api/wholesale/profile/:profileId', async (req, res) => {
  try {
    const { data, error } = await req.supabase.from('wholesalers').select('*').eq('profile_id', req.params.profileId).single();
    if (error) throw error;
    res.json({ data });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/wholesale/profile', async (req, res) => {
  try {
    const { data, error } = await req.supabase.from('wholesalers').insert(req.body).select().single();
    if (error) throw error;
    res.status(201).json({ data });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ─── Health ─── */
app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'casano-backend', ts: Date.now() }));

/* ─── Start ─── */
const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => console.log(`Casano Backend on :${PORT}`));
