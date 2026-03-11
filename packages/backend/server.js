const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const redis = require('redis');
require('dotenv').config();
// Import Security Middleware
const security = require('./middleware/security');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Database Connections
const db = new Pool({ connectionString: process.env.DATABASE_URL });
db.on('error', (err) => console.error('Postgres error (ignored for dev):', err.message));

const rc = redis.createClient({ url: process.env.REDIS_URL });
rc.on('error', (err) => console.error('Redis error (ignored for dev):', err.message));

rc.connect().catch(e => console.error('Redis connect error (ignored for dev)'));
app.use(express.json());

// Apply Global Security Middleware
app.use(security.helmet);

// Suspicious IP blocker logic (using Redis)
async function blockSuspiciousIP(req, res, next) {
    const ip = req.ip;
    const blocked = await rc.get(`blocked_ip:${ip}`);
    if (blocked) return res.status(403).json({ error: 'Access denied' });

    const count = await rc.incr(`ip_req:${ip}`);
    await rc.expire(`ip_req:${ip}`, 60);

    if (count > 200) { // 200+ requests per minute = auto block 1 hour
        await rc.set(`blocked_ip:${ip}`, 1, { EX: 3600 });
        return res.status(429).json({ error: 'Rate limit exceeded' });
    }
    next();
}
app.use(blockSuspiciousIP);

// ── Auth Middleware ──
function auth(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch {
        res.status(401).json({ error: 'Invalid token' });
    }
}

// ── OTP Login Routes ──
app.post('/api/auth/send-otp', security.authLimiter, async (req, res) => {
    const { phone } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await rc.set(`otp:${phone}`, otp, { EX: 300 });
    // Mocking SMS send: await twilioClient.messages.create(...)
    console.log(`[MOCK SMS] Antigravity OTP for ${phone}: ${otp}`);
    res.json({ message: 'OTP sent successfully (check console)' });
});

app.post('/api/auth/verify-otp', security.authLimiter, async (req, res) => {
    const { phone, otp, role } = req.body;
    const stored = await rc.get(`otp:${phone}`);

    if (stored !== otp) return res.status(400).json({ error: 'Wrong OTP' });

    let user = (await db.query('SELECT * FROM users WHERE phone=$1', [phone])).rows[0];
    if (!user) {
        user = (await db.query(
            'INSERT INTO users(phone,role) VALUES($1,$2) RETURNING *',
            [phone, role]
        )).rows[0];
    }
    const token = jwt.sign({ id: user.user_id, role: user.role, shop_id: user.shop_id }, process.env.JWT_SECRET);

    // Clear OTP after successful login
    await rc.del(`otp:${phone}`);

    res.json({ token, user });
});

// Basic health check
app.get('/', (req, res) => res.send('🚀 Antigravity API is running'));

io.on('connection', (socket) => {
    console.log('⚡ Socket connected:', socket.id);

    socket.on('join_order', (id) => {
        socket.join(`order_${id}`);
        console.log(`User joined order room: order_${id}`);
    });

    socket.on('join_shop', (id) => {
        socket.join(`shop_${id}`);
        console.log(`Merchant joined shop room: shop_${id}`);
    });

    socket.on('location_update', ({ orderId, lat, lng }) => {
        // Broadcast rider location to the customer in real-time
        io.to(`order_${orderId}`).emit('driver_location', { lat, lng });
    });

    socket.on('disconnect', () => console.log('❌ Socket disconnected'));
});

// Export instances for other files to use later
module.exports = { app, db, rc, io, auth, security };

// Register the Routes
app.use('/api/search', require('./routes/search'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/ondc/v1', require('./routes/ondc'));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Antigravity running on port ${PORT}`));
