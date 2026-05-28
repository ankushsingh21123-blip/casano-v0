import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { eventBus } from '@/lib/eventBus';

// Verify webhook API key
function verifyWebhookAuth(request: Request): boolean {
    const apiKey = request.headers.get('x-api-key');
    const expectedKey = process.env.WEBHOOK_API_KEY;
    if (!expectedKey) return false; // Reject if not configured
    return apiKey === expectedKey;
}

// Triggered by external platforms (e.g., Magicpin, Paytm via ONDC Protocol)
export async function POST(request: Request) {
    // Authenticate the webhook caller
    if (!verifyWebhookAuth(request)) {
        return NextResponse.json({ error: 'Unauthorized: Invalid or missing API key' }, { status: 401 });
    }

    try {
        const payload = await request.json();
        // ONDC Mock Payload: { network_id: "ondc_magicpin", merchant_id: "...", items: [{ productId, quantity }] }

        const { merchant_id, items } = payload;

        if (!merchant_id || !items || !items.length) {
            return NextResponse.json({ error: 'Invalid ONDC payload' }, { status: 400 });
        }

        // Validate each item
        for (const item of items) {
            if (!item.productId || typeof item.quantity !== 'number' || item.quantity <= 0) {
                return NextResponse.json({ error: 'Invalid item in payload: productId and positive quantity required' }, { status: 400 });
            }
        }

        // 1. Verify merchant exists
        const merchant = await prisma.merchant.findUnique({ where: { id: merchant_id } });
        if (!merchant) return NextResponse.json({ error: 'Merchant not found on network' }, { status: 404 });

        // 2. Process items atomically using Prisma decrement (prevents race conditions)
        for (const item of items) {
            const product = await prisma.product.findUnique({ where: { id: item.productId } });

            if (product && product.app_reserved_stock >= item.quantity) {
                // Use atomic decrement instead of read-then-write to prevent race conditions
                const updated = await prisma.product.update({
                    where: { id: item.productId },
                    data: {
                        app_reserved_stock: {
                            decrement: item.quantity,
                        },
                        total_stock: {
                            decrement: item.quantity,
                        },
                    }
                });

                // 3. Log as an 'ONDC' sale for the Analytics chart
                await prisma.salesLog.create({
                    data: {
                        product_id: product.id,
                        merchant_id: merchant_id,
                        quantity: item.quantity,
                        sale_type: 'ONDC' // Specific tracker for ONDC vs Native App
                    }
                });

                // 4. Trigger Real-Time Sync so Native Customer Storefront updates instantly
                eventBus.emit('product_updated', {
                    productId: product.id,
                    merchantId: merchant_id,
                    newStock: updated.app_reserved_stock
                });
            }
        }

        return NextResponse.json({ success: true, message: 'ONDC Network Order Acknowledged & Stock Synced' });

    } catch (error) {
        console.error("ONDC Webhook Error:", error);
        return NextResponse.json({ error: 'Internal Server Error processing network request' }, { status: 500 });
    }
}
