import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { items, merchant_id, customer_id } = body;

        // In a real app we'd validate the stock in a transaction.
        // Locking: Decrement app_reserved_stock

        for (const item of items) {
            await prisma.product.update({
                where: { id: item.productId },
                data: {
                    app_reserved_stock: {
                        decrement: item.quantity,
                    }
                }
            });

            // Record App Sale
            await prisma.salesLog.create({
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
        const order = await prisma.order.create({
            data: {
                merchant_id,
                customer_id: customer_id || 'dummy_customer',
                status: 'Pending',
                pickup_otp: otp,
            }
        });

        return NextResponse.json({ success: true, orderId: order.id, otp });
    } catch (error) {
        console.error('Checkout error:', error);
        return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
    }
}
