function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function isShopOpen(openTime, closeTime) {
    if (!openTime || !closeTime) return true; // Assume open if no hours set
    const now = new Date();
    const cur = now.getHours() * 60 + now.getMinutes();
    const [oh, om] = openTime.split(':').map(Number);
    const [ch, cm] = closeTime.split(':').map(Number);
    return cur >= oh * 60 + om && cur <= ch * 60 + cm;
}

function calculateShopScore(shop, user, productInfo) {
    const dist = shop.dist_km || haversineDistance(user.lat, user.lng, shop.lat, shop.lng);

    const distanceScore = Math.max(0, 10 - dist * 2);
    const priceScore = Math.max(0, 10 - (productInfo.price / 20));
    const stockScore = productInfo.quantity > 10 ? 10 : productInfo.quantity > 0 ? 5 : 0;
    const ratingScore = shop.rating * 2;
    const extraStockBonus = productInfo.has_extra_stock ? 3 : 0;
    const openBonus = isShopOpen(shop.hours_open, shop.hours_close) ? 5 : -99; // Heavily penalize closed shops

    const score =
        distanceScore * 0.35 +
        priceScore * 0.20 +
        stockScore * 0.20 +
        ratingScore * 0.15 +
        extraStockBonus * 0.05 +
        openBonus * 0.05;

    return { ...shop, dist_km: dist, score };
}

function getTopShops(shops, user, topN = 5) {
    return shops
        .map(s => calculateShopScore(s, user, { price: s.price, quantity: s.quantity, has_extra_stock: s.has_extra_stock }))
        .filter(s => s.dist_km <= (user.maxRadius || 5))
        .sort((a, b) => b.score - a.score)
        .slice(0, topN);
}

function calculateDelivery(distanceKm, orderValue, timestamp = new Date()) {
    const BASE_FEE = 15;
    const PER_KM = 8;
    const PLATFORM_PCT = 0.05;
    const hour = timestamp.getHours();
    const isPeak = (hour >= 8 && hour <= 10) || (hour >= 18 && hour <= 21);
    const peakMult = isPeak ? 1.3 : 1.0;

    const delivery = Math.round((BASE_FEE + distanceKm * PER_KM) * peakMult);
    const platform = Math.round(orderValue * PLATFORM_PCT);
    const isFar = distanceKm > 3;

    return {
        delivery_charge: delivery,
        platform_fee: platform,
        grand_total: orderValue + delivery + platform,
        is_far_warning: isFar,
        warning_message: isFar
            ? `⚠️ Shop is ${distanceKm}km away. Delivery = ₹${delivery}. A closer shop could save you ₹${Math.round((distanceKm - 1) * PER_KM)}!`
            : null,
        is_peak_hour: isPeak,
    };
}

module.exports = { haversineDistance, isShopOpen, calculateShopScore, getTopShops, calculateDelivery };
