
async function getSurgeMultiplier(areaId, timestamp = new Date()) {
    const { rc } = require('../server');
    const hour = timestamp.getHours();
    const day = timestamp.getDay();

    let surge = 1.0;
    // Peak Hours: 8-10 AM and 7-9 PM
    if ((hour >= 8 && hour <= 10) || (hour >= 19 && hour <= 21)) surge = 1.3;
    // Late Night: 11 PM - 6 AM
    if (hour >= 23 || hour <= 6) surge = 1.5;
    // Weekend Boost
    if (day === 0 || day === 6) surge *= 1.1;

    // Supply/Demand Ratio from Redis
    const activeOrders = parseInt(await rc.get(`area_orders:${areaId}`)) || 0;
    const activeDrivers = parseInt(await rc.get(`area_drivers:${areaId}`)) || 1;
    const ratio = activeOrders / activeDrivers;

    if (ratio > 3) surge *= 1.4; // High demand
    else if (ratio > 1.5) surge *= 1.1;

    return {
        multiplier: Math.min(surge, 2.5), // Cap at 2.5x
        label: surge > 1.5 ? '🔴 High Demand' : surge > 1.2 ? '🟡 Busy' : '🟢 Normal'
    };
}

module.exports = { getSurgeMultiplier };
