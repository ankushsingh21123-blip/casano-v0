import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { order_id, reason, photo_url, product_category } = body;

        const order = await prisma.order.findUnique({
            where: { id: order_id }
        });

        if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

        // Retrieve customer for trust score processing
        const customer = await prisma.customer.findUnique({
            where: { id: order.customer_id }
        });

        if (!customer) return NextResponse.json({ error: 'Customer not found' }, { status: 404 });

        if (customer.cod_blocked) {
            return NextResponse.json({ error: 'Your account is currently blocked from initiating returns due to past suspicious activity.' }, { status: 403 });
        }

        // --- NEW: Scam Detection via Metadata Cross-reference ---
        const { metadata_lat, metadata_lng } = body;
        // Assume Rider Delivery photo was taken at the merchant's coordinates originally (simulated as 12.9716, 77.5946)
        // If the unboxing photo metadata is > 5km away, auto-reject fraudulent claim!
        if (metadata_lat && metadata_lng) {
            const expectedLat = 12.9716;
            const expectedLng = 77.5946;

            const latDiff = Math.abs(expectedLat - parseFloat(metadata_lat));
            const lngDiff = Math.abs(expectedLng - parseFloat(metadata_lng));

            // 0.05 degrees is approx 5km
            if (latDiff > 0.05 || lngDiff > 0.05) {
                // Fraud detected! Deduct trust score.
                const newScore = customer.trust_score - 20;
                await prisma.customer.update({
                    where: { id: customer.id },
                    data: {
                        trust_score: newScore,
                        cod_blocked: newScore < 50 // Block if drops below 50
                    }
                });

                return NextResponse.json({
                    error: `Fraud Detected: Location mismatch. Trust Score reduced by 20 pts. Current Score: ${newScore}`
                }, { status: 403 });
            }
        }

        // Strict Return Logic
        const timeDiffMs = new Date().getTime() - new Date(order.created_at).getTime();
        const hoursSinceOrder = timeDiffMs / (1000 * 60 * 60);

        if (product_category === 'Stationery') {
            if (hoursSinceOrder > 2) {
                return NextResponse.json({ error: 'Return Window Closed: Stationery must be returned within 2 hours.' }, { status: 400 });
            }
        } else if (product_category === 'Daily Essentials' || product_category === 'Perishable') {
            if (reason !== 'Damaged') {
                return NextResponse.json({ error: 'Non-Returnable: Perishable items can only be returned if damaged.' }, { status: 400 });
            }
        }

        const returnReq = await prisma.returnRequest.create({
            data: {
                order_id,
                reason,
                photo_url,
                status: 'Pending Verification',
            }
        });

        return NextResponse.json({ success: true, returnRequest: returnReq });
    } catch (error) {
        console.error('Return error:', error);
        return NextResponse.json({ error: 'Return processing failed' }, { status: 500 });
    }
}
