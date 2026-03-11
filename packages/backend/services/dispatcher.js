const { db, rc } = require('../server');
const { haversineDistance } = require('../utils/algorithms');

/**
 * Hyperlocal Delivery Dispatch Engine
 * Uses a Weighted Cost Function to find the absolute best driver for an order,
 * rather than justpinging the "closest" driver who might be driving the wrong way.
 */

// ── The Cost Function Weights ──
// Tweak these to prioritize speed, fairness, or cost
const WEIGHT_DISTANCE = 1.5;   // Distance to shop
const WEIGHT_ETA = 2.0;        // Traffic/Direction ETA (Heavier weight)
const WEIGHT_IDLE_TIME = 0.5;  // Subtract this so idle drivers get orders (Fairness)

/**
 * Finds the best active rider for a newly accepted order.
 * Called automatically when the Merchant hits "ACCEPT ORDER".
 */
async function dispatchOrder(orderId, shopLat, shopLng) {

    console.log(`[DISPATCH] Finding best rider for Order: ${orderId}`);

    // 1. Find all ACTIVE riders within a 3km radius of the shop
    // In reality, this would query PostGIS or a Redis GeoSpatial index
    const { rows: nearbyRiders } = await db.query(`
        SELECT r.id as driver_id, r.live_location, r.status, r.last_order_completed_at
        FROM delivery_partner r
        WHERE r.status = 'IDLE' 
        -- Assume PostGIS ST_DWithin query here for a 3km radius
    `);

    if (nearbyRiders.length === 0) {
        console.log(`[DISPATCH] 🚨 NO RIDERS AVAILABLE for Order: ${orderId}. Entering Retry Queue.`);
        // TODO: Push to a Kafka/Redis Delayed Queue to retry in 30 seconds
        return null;
    }

    let bestRider = null;
    let lowestCostScore = Infinity;

    for (const rider of nearbyRiders) {

        // 1. Raw Data Extraction
        // Parse the PostGIS point: POINT(lng lat)
        // const riderLng = ...; const riderLat = ...;
        const riderLat = 0; // Mock
        const riderLng = 0; // Mock

        // Distance to Shop
        const distanceToShopKm = haversineDistance(riderLat, riderLng, shopLat, shopLng);

        // ETA Calculation (In reality: call Google Maps Distance Matrix API)
        // We mock 3 mins per KM here.
        const etaMinutes = distanceToShopKm * 3;

        // Idle Time Calculation (Minutes since they last completed an order)
        let idleTimeMinutes = 0;
        if (rider.last_order_completed_at) {
            const diffMs = new Date() - new Date(rider.last_order_completed_at);
            idleTimeMinutes = Math.floor(diffMs / 60000);
        } else {
            // New rider on shift, give them slight priority
            idleTimeMinutes = 15;
        }

        // 2. The Magic Match Formula
        // We SUBTRACT idle time so drivers waiting longer get a lower (better) score
        const matchScore = (distanceToShopKm * WEIGHT_DISTANCE)
            + (etaMinutes * WEIGHT_ETA)
            - (idleTimeMinutes * WEIGHT_IDLE_TIME);

        console.log(`[DISPATCH] Evaluated Rider ${rider.driver_id} | Score: ${matchScore}`);

        // 3. Keep the lowest score
        if (matchScore < lowestCostScore) {
            lowestCostScore = matchScore;
            bestRider = rider;
        }
    }

    console.log(`[DISPATCH] ✅ Best Match: Rider ${bestRider.driver_id} (Score: ${lowestCostScore})`);

    // 4. State Transition: Assign the driver in the DB
    await db.query(`
        UPDATE orders 
        SET delivery_id = $1, status = 'driver_assigned' 
        WHERE order_id = $2
    `, [bestRider.driver_id, orderId]);

    await db.query(`
        UPDATE delivery_partner 
        SET status = 'EN_ROUTE_SHOP' 
        WHERE id = $1
    `, [bestRider.driver_id]);

    // 5. Trigger the WebSocket Alert to the Rider's App
    // io.to(`driver_${bestRider.driver_id}`).emit('new_assignment', { orderId, shopLat, shopLng });

    return bestRider.driver_id;
}

module.exports = {
    dispatchOrder
};
