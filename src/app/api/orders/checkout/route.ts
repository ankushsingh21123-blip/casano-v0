import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { items, merchant_id, customer_id } = body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: 'Items array is required' }, { status: 400 });
        }
        if (!merchant_id || typeof merchant_id !== 'string') {
            return NextResponse.json({ error: 'merchant_id is required' }, { status: 400 });
        }

        // Use a transaction to ensure atomicity — prevents overselling
        const result = await prisma.$transaction(async (tx) => {
            for (const item of items) {
                if (!item.productId || typeof item.quantity !== 'number' || item.quantity <= 0) {
                    throw new Error(`Invalid item: productId and positive quantity required`);
                }

                // Check stock availability before decrementing
                const product = await tx.product.findUnique({
                    where: { id: item.productId },
                });

                if (!product) {
                    throw new Error(`Product ${item.productId} not found`);
                }

                if (product.app_reserved_stock < item.quantity) {
                    throw new Error(`Insufficient stock for "${product.name}". Available: ${product.app_reserved_stock}, Requested: ${item.quantity}`);
                }

                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        app_reserved_stock: {
                            decrement: item.quantity,
                        }
                    }
                });

                // Record App Sale
                await tx.salesLog.create({
                    data: {
                        product_id: item.productId,
                        merchant_id: merchant_id,
                        sale_type: 'App',
                        quantity: item.quantity,
                    }
                });
            }

            // Generate 4-digit OTP
            const otp = Math.floor(1000 + Math.random() * 9000).toString();

            // Create Order
            const order = await tx.order.create({
                data: {
                    merchant_id,
                    customer_id: customer_id || 'dummy_customer',
                    status: 'Pending',
                    pickup_otp: otp,
                }
            });

            return { order, otp };
        });

        return NextResponse.json({ success: true, orderId: result.order.id, otp: result.otp });
    } catch (error: any) {
        console.error('Checkout error:', error);
        const message = error.message || 'Checkout failed';
        const status = message.includes('Insufficient stock') || message.includes('Invalid item') ? 400 : 500;
        return NextResponse.json({ error: message }, { status });
    }
}
