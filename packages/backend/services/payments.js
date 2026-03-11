const Razorpay = require('razorpay');
const crypto = require('crypto');

const rzp = new Razorpay({
    key_id: process.env.RAZORPAY_KEY || 'rzp_test_mock',
    key_secret: process.env.RAZORPAY_SECRET || 'secret_mock',
});

async function createPaymentOrder(orderId, amountRupees) {
    const rzpOrder = await rzp.orders.create({
        amount: Math.round(amountRupees * 100), // convert to paise
        currency: 'INR',
        receipt: `rcpt_${orderId}`
    });
    return rzpOrder;
}

function verifySignature(orderId, paymentId, signature) {
    const body = orderId + '|' + paymentId;
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_SECRET || 'secret_mock')
        .update(body.toString())
        .digest('hex');
    return expectedSignature === signature;
}

module.exports = { createPaymentOrder, verifySignature };
