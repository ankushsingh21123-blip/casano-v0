import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { createServer } from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL || '*',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }
});

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    socket.on('join', (roomId) => {
        socket.join(roomId);
        console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    socket.on('leave', (roomId) => {
        socket.leave(roomId);
        console.log(`Socket ${socket.id} left room ${roomId}`);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

app.set('io', io);

app.use(cors({
    origin: process.env.FRONTEND_URL || '*', // Vercel URL
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Initialize Supabase Admin Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('SERVER INIT ERROR: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
}

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

// Middleware to attach supabase to req
app.use((req, res, next) => {
    req.supabase = supabase;
    next();
});

// Middleware to verify Supabase JWT
const authenticateUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Missing or invalid authorization header' });
        }
        
        const token = authHeader.split(' ')[1];
        const { data: { user }, error } = await supabase.auth.getUser(token);
        
        if (error || !user) {
            return res.status(401).json({ error: 'Unauthorized', details: error?.message });
        }
        
        req.user = user;
        next();
    } catch (err) {
        return res.status(500).json({ error: 'Authentication error' });
    }
};

// ------------- API ROUTES -------------

// VENDORS
app.get('/api/vendors', async (req, res) => {
    try {
        const { data, error } = await req.supabase
            .from('vendors')
            .select('*')
            .eq('is_open', true)
            .order('created_at', { ascending: false });
            
        if (error) throw error;
        res.json({ data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PRODUCTS
app.get('/api/products', async (req, res) => {
    try {
        const { data, error } = await req.supabase
            .from('products')
            .select('*, vendors(shop_name, area)')
            .eq('is_available', true)
            .order('name');
            
        if (error) throw error;
        res.json({ data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/vendors/profile/:profileId', authenticateUser, async (req, res) => {
    try {
        const { data, error } = await req.supabase.from('vendors').select('*').eq('profile_id', req.params.profileId).single()
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
        const updates = req.body;
        const { data, error } = await req.supabase.from('vendors').update(updates).eq('id', req.params.vendorId).select().single()
        if (error) throw error;
        res.json({ data });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/vendors', async (req, res) => {
    try {
        const { profile_id, area, city, ...vendorData } = req.body;
        
        // Insert vendor
        const { data: vendor, error: vendorError } = await req.supabase.from('vendors').insert({ 
            ...vendorData, 
            profile_id,
            area,
            city,
            is_open: true, 
            delivery_radius_km: 2, 
            avg_delivery_minutes: 30 
        }).select().single();
        
        if (vendorError) throw vendorError;
        
        // Update profile
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
        if (req.query.available_only === 'true') {
            query = query.eq('is_available', true).order('category').order('name');
        } else {
            query = query.order('created_at', { ascending: false });
        }
        const { data, error } = await query;
        if (error) throw error;
        res.json({ data });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/products/search', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.json({ data: [] });
        
        const { data, error } = await req.supabase
            .from('products')
            .select('*, vendors(shop_name, area)')
            .eq('is_available', true)
            .ilike('name', `%${q}%`)
            .order('name')
            .limit(30);
            
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
        const { data, error } = await req.supabase.from('products').insert(req.body).select().single()
        if (error) throw error;
        res.status(201).json({ data })
    } catch (err) { res.status(500).json({ error: err.message }) }
});

app.patch('/api/products/:productId', async (req, res) => {
    try {
        const { data, error } = await req.supabase.from('products').update(req.body).eq('id', req.params.productId).select().single()
        if (error) throw error;
        res.json({ data })
    } catch (err) { res.status(500).json({ error: err.message }) }
});

app.patch('/api/products/:productId/availability', async (req, res) => {
    try {
        const { is_available } = req.body;
        const { data, error } = await req.supabase.from('products').update({ is_available }).eq('id', req.params.productId).select().single();
        if (error) throw error;
        res.json({ data });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.patch('/api/orders/:orderId/status', authenticateUser, async (req, res) => {
    try {
        const { status } = req.body;
        const { data, error } = await req.supabase.from('orders').update({ status }).eq('id', req.params.orderId).select().single();
        if (error) throw error;
        
        req.app.get('io').to(`vendor_${data.vendor_id}`).emit('orderUpdated', data);
        req.app.get('io').to(`user_${data.user_id}`).emit('orderUpdated', data);

        res.json({ data });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/users/:userId/orders', authenticateUser, async (req, res) => {
    try {
        const { data, error } = await req.supabase
            .from('orders')
            .select('*, vendors(shop_name), order_items(*, products(name))')
            .eq('user_id', req.params.userId)
            .order('created_at', { ascending: false });
        if (error) throw error;
        res.json({ data });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/orders', authenticateUser, async (req, res) => {
    try {
        const { items, ...orderData } = req.body;
        
        // Insert order
        const { data: order, error: orderError } = await req.supabase.from('orders').insert({
            ...orderData,
            status: 'pending'
        }).select().single();
        
        if (orderError) throw orderError;
        
        // Insert items
        const orderItems = items.map(item => ({
            ...item,
            order_id: order.id
        }));
        
        const { error: itemsError } = await req.supabase.from('order_items').insert(orderItems);
        if (itemsError) throw itemsError;
        
        req.app.get('io').to(`vendor_${order.vendor_id}`).emit('orderCreated', order);
        req.app.get('io').to(`user_${order.user_id}`).emit('orderCreated', order);

        res.status(201).json({ data: order });
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


// AUTH PROFILE (Example of how you can verify users and get profiles)
app.get('/api/auth/profile/:id', authenticateUser, async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await req.supabase
            .from('profiles')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        res.json({ data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.patch('/api/auth/profile/:id', authenticateUser, async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const { data, error } = await req.supabase
            .from('profiles')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        res.json({ data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// WHOLESALE
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

app.patch('/api/wholesale/profile/:id', async (req, res) => {
    try {
        const { data, error } = await req.supabase.from('wholesalers').update(req.body).eq('id', req.params.id).select().single();
        if (error) throw error;
        res.json({ data });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/wholesale/:wholesalerId/dashboard', async (req, res) => {
    try {
        const { wholesalerId } = req.params;
        const [pRes, iRes] = await Promise.all([
            req.supabase.from('wholesale_products').select('id').eq('wholesaler_id', wholesalerId),
            req.supabase.from('wholesale_inquiries').select('*, vendors(shop_name), wholesale_products(name)').eq('wholesaler_id', wholesalerId).order('created_at', { ascending: false }).limit(5),
        ]);
        res.json({
            data: {
                productsCount: pRes.data?.length || 0,
                inquiries: iRes.data || []
            }
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/wholesale/:wholesalerId/products', async (req, res) => {
    try {
        const { data, error } = await req.supabase.from('wholesale_products').select('*').eq('wholesaler_id', req.params.wholesalerId).order('created_at', { ascending: false });
        if (error) throw error;
        res.json({ data });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/wholesale/products', async (req, res) => {
    try {
        const { data, error } = await req.supabase.from('wholesale_products').insert(req.body).select().single();
        if (error) throw error;
        res.status(201).json({ data });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.patch('/api/wholesale/products/:id', async (req, res) => {
    try {
        const { data, error } = await req.supabase.from('wholesale_products').update(req.body).eq('id', req.params.id).select().single();
        if (error) throw error;
        res.json({ data });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/wholesale/products/:id', async (req, res) => {
    try {
        const { error } = await req.supabase.from('wholesale_products').delete().eq('id', req.params.id);
        if (error) throw error;
        res.json({ data: { success: true } });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/wholesale/:wholesalerId/inquiries', authenticateUser, async (req, res) => {
    try {
        const { data, error } = await req.supabase.from('wholesale_inquiries').select('*, vendors(shop_name), wholesale_products(name)').eq('wholesaler_id', req.params.wholesalerId).order('created_at', { ascending: false });
        if (error) throw error;
        res.json({ data });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/wholesale/inquiries', authenticateUser, async (req, res) => {
    try {
        const { data, error } = await req.supabase.from('wholesale_inquiries').insert(req.body).select('*, vendors(shop_name), wholesale_products(name)').single();
        if (error) throw error;
        
        req.app.get('io').to(`wholesale_${data.wholesaler_id}`).emit('inquiryCreated', data);
        if (data.vendor_id) req.app.get('io').to(`vendor_${data.vendor_id}`).emit('inquiryCreated', data);
        
        res.status(201).json({ data });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.patch('/api/wholesale/inquiries/:id/status', authenticateUser, async (req, res) => {
    try {
        const { data, error } = await req.supabase.from('wholesale_inquiries').update({ status: req.body.status }).eq('id', req.params.id).select('*, vendors(shop_name), wholesale_products(name)').single();
        if (error) throw error;
        
        req.app.get('io').to(`wholesale_${data.wholesaler_id}`).emit('inquiryUpdated', data);
        if (data.vendor_id) req.app.get('io').to(`vendor_${data.vendor_id}`).emit('inquiryUpdated', data);
        
        res.json({ data });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'casano-backend' });
});

// ------------- SERVER START -------------
const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
    console.log(`Casano Backend listening on port ${PORT}`);
});
