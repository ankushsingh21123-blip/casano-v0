const { rc } = require('../server');

// Update stock in Redis for fast search/locking
async function setStock(shopId, productId, qty) {
    const key = `inv:${shopId}:${productId}`;
    await rc.set(key, qty, { EX: 3600 }); // 1 hour cache
    if (qty > 0) {
        await rc.zAdd(`stock:${productId}`, [{ score: qty, value: shopId }]);
    } else {
        await rc.zRem(`stock:${productId}`, shopId);
    }
}

// The "Cart Lock" Logic: Uses DECRBY to safely reserve stock before payment
async function reserveStock(shopId, productId, qty) {
    const key = `inv:${shopId}:${productId}`;
    const current = parseInt(await rc.get(key)) || 0;

    if (current < qty) throw new Error('Insufficient stock');

    // Atomic decrement
    const newQty = await rc.decrBy(key, qty);
    await rc.zAdd(`stock:${productId}`, [{ score: newQty, value: shopId }]);

    // Set a 3-minute "Payment Pending" lock in Redis
    const lockKey = `lock:pending:${shopId}:${productId}`;
    await rc.set(lockKey, qty, { EX: 180 });

    return newQty;
}

module.exports = { setStock, reserveStock };
