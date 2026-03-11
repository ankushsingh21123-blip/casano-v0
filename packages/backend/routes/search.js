const express = require('express');
const router = express.Router();
const { db, auth, security } = require('../server');
const { getTopShops } = require('../utils/algorithms');

// ── Product & Shop Search ──
router.post('/nearby', auth, security.searchLimiter, async (req, res) => {
    const { query, lat, lng, radius = 5 } = req.body;

    try {
        // Step 1: Query PostGIS for shops within radius that have the product in stock
        const { rows } = await db.query(
            `SELECT s.shop_id, s.shop_name, s.rating, s.hours_open, s.hours_close, 
              i.price, i.quantity, i.has_extra_stock, 
              p.name AS product_name, p.product_id, 
              ROUND(ST_Distance(s.location::geography, ST_MakePoint($1,$2)::geography)/1000, 2) AS dist_km 
       FROM shops s 
       JOIN inventory i ON s.shop_id = i.shop_id 
       JOIN products p  ON i.product_id = p.product_id 
       WHERE p.name ILIKE $3  
         AND i.quantity > 0  
         AND s.is_active = true 
         AND ST_DWithin(s.location::geography, ST_MakePoint($1,$2)::geography, $4*1000) 
       ORDER BY dist_km ASC`,
            [lng, lat, `%${query}%`, radius]
        );

        // Step 2: Pass results to the "Magic Engine" to rank them by cost, distance, and rating
        const userParams = { lat, lng, maxRadius: radius };
        const rankedShops = getTopShops(rows, userParams, 5); // Return top 5
        res.json({ success: true, results: rankedShops });
    } catch (error) {
        console.error('Search Error:', error);
        res.status(500).json({ error: 'Failed to search nearby shops' });
    }
});

module.exports = router;
