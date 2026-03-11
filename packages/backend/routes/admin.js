const express = require('express');
const router = express.Router();
const { db, auth } = require('../server');

router.get('/stats', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });

    const stats = await db.query(`
    SELECT 
      (SELECT COUNT(*) FROM orders WHERE created_at > NOW() - INTERVAL '24 hours') as today_orders, 
      (SELECT SUM(grand_total) FROM orders WHERE status='delivered') as total_revenue, 
      (SELECT COUNT(*) FROM shops WHERE is_active=true) as active_shops
  `);

    res.json(stats.rows[0]);
});

module.exports = router;
