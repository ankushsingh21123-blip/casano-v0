const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 10, // 10 OTP requests per 15 min
    message: { error: 'Too many OTP requests. Wait 15 minutes.' }
});

const searchLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 min
    max: 60, // 60 searches per minute
    message: { error: 'Search rate limit hit' }
});

const orderLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 min
    max: 10, // 10 orders per minute max
    message: { error: 'Too many order requests' }
});

// Export middleware to be used in server.js
module.exports = {
    helmet: helmet(),
    authLimiter,
    searchLimiter,
    orderLimiter
};
