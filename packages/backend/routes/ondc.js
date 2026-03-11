const express = require('express');
const router = express.Router();
const { db } = require('../server'); // Assuming db is exported from server.js
const { haversineDistance, calculateDelivery } = require('../utils/algorithms');

/**
 * Acts as the standard ONDC Protocol Translator
 * Buyer Apps (Paytm, etc.) call these standard BAP (Buyer App Protocol) endpoints.
 * Node.js Equivalent of the Spring Boot Adapter
 */

// Basic Mock Translation function 
const toBecknCatalog = (internalResults, context) => {
    return {
        context: context,
        message: {
            catalog: {
                "bpp/providers": internalResults.map(shop => ({
                    id: shop.shop_id,
                    descriptor: { name: shop.shop_name },
                    locations: [{ id: shop.shop_id, gps: `${shop.lat},${shop.lng}` }],
                    items: [
                        {
                            id: shop.product_id,
                            descriptor: { name: shop.product_name },
                            price: { currency: "INR", value: shop.price.toString() },
                            location_id: shop.shop_id,
                            tags: { "recommended_delivery": shop.delivery_charge }
                        }
                    ]
                }))
            }
        }
    }
}

/**
 * ONDC /search endpoint.
 * Another app (the Buyer) asks: "Who sells 'Amul Butter' near Lat: X, Lng: Y?"
 */
router.post('/search', async (req, res) => {
    try {
        const { context, message } = req.body;

        // Deep nested extraction per ONDC spec
        const intentSkuName = message?.intent?.item?.descriptor?.name || '';
        const lat = message?.intent?.fulfillment?.end?.location?.gps?.split(',')[0] || 0;
        const lng = message?.intent?.fulfillment?.end?.location?.gps?.split(',')[1] || 0;
        const radius = 5; // Default 5km

        // 1. Call your internal Magic Algorithm PostGIS query
        const { rows } = await db.query(`
            SELECT s.*, i.price, i.quantity, i.has_extra_stock, p.name AS product_name, p.product_id,
              ROUND(ST_Distance(s.location::geography, ST_MakePoint($1,$2)::geography)/1000,2) AS dist_km
            FROM shops s
            JOIN inventory i ON s.shop_id = i.shop_id
            JOIN products p  ON i.product_id = p.product_id
            WHERE p.name ILIKE $3 AND i.quantity > 0 AND s.is_active = true
            AND ST_DWithin(s.location::geography, ST_MakePoint($1,$2)::geography, $4*1000)
            ORDER BY dist_km ASC
        `, [lng, lat, `%${intentSkuName}%`, radius]);

        const augmentedRows = rows.map(r => {
            const delivery = calculateDelivery(r.dist_km, r.price);
            return { ...r, delivery_charge: delivery.delivery_charge };
        });

        // 2. Translate your internal format into the strict ONDC Beckn Protocol JSON
        const response = toBecknCatalog(augmentedRows, context);

        // Return the catalog. The Buyer App displays it to the user.
        return res.json(response);
    } catch (err) {
        console.error("ONDC Search Error:", err);
        return res.status(500).json({ error: { type: "CORE-ERROR", code: "500" } });
    }
});

/**
 * ONDC /select endpoint.
 * The unified cart system asks: "The user wants 2x Butter from Shop A. Outline the taxes and delivery fees."
 */
router.post('/select', async (req, res) => {
    try {
        const { context, message } = req.body;
        const providerId = message?.order?.provider?.id;
        const requestedItems = message?.order?.items || [];

        const lat = req.body?.lat || 0; // In reality, get from context/db
        const lng = req.body?.lng || 0;

        // Get Shop loc to calc distance
        const shopRes = await db.query('SELECT ST_X(location::geometry) as lng, ST_Y(location::geometry) as lat FROM shops WHERE shop_id = $1', [providerId]);
        if (shopRes.rows.length === 0) return res.status(404).json({ error: "Provider not found" });

        const shopLat = shopRes.rows[0].lat;
        const shopLng = shopRes.rows[0].lng;

        // Calculate dynamic delivery *specifically* for this ONDC order
        const distanceKm = haversineDistance(lat, lng, shopLat, shopLng);

        // Mock Item Total Calculation
        let itemTotal = 0;
        for (const item of requestedItems) {
            // Need to fetch current DB price in reality to prevent price manipulation
            // itemTotal += db_price * item.quantity.count; 
            itemTotal += 50; // Mock 50 rupees per item for now
        }

        const pricing = calculateDelivery(distanceKm, itemTotal);

        // Build the formal ONDC Quote
        const quote = {
            context,
            message: {
                order: {
                    provider: { id: providerId },
                    items: requestedItems,
                    quote: {
                        price: { currency: "INR", value: pricing.grand_total.toString() },
                        breakup: [
                            { title: "item", price: { currency: "INR", value: itemTotal.toString() } },
                            { title: "delivery", price: { currency: "INR", value: pricing.delivery_charge.toString() } },
                            { title: "convenience_fee", price: { currency: "INR", value: pricing.platform_fee.toString() } }
                        ]
                    }
                }
            }
        };

        return res.json(quote);

    } catch (err) {
        console.error("ONDC Select Error:", err);
        return res.status(500).json({ error: { type: "CORE-ERROR", code: "500" } });
    }
});

module.exports = router;
