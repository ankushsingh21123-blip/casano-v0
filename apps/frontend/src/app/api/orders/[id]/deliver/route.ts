export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { rider_lat, rider_lng, photo_url } = body;

        const order = await prisma.order.findUnique({
            where: { id },
            include: { merchant: true },
        });

        if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

        // Geofence Check: Calculate distance (mocking Haversine)
        // For demo, if coordinates are provided, check if within 50 meters
        // Dummy check: if we pass rider_lat, we ensure they match exactly or very close
        const mLat = order.merchant.latitude;
        const mLng = order.merchant.longitude;

        // Simplistic distance check (just an absolute diff for demo)
        const latDiff = Math.abs(mLat - rider_lat);
        const lngDiff = Math.abs(mLng - rider_lng);

        // 50 meters is roughly 0.00045 degrees
        if (latDiff > 0.00045 || lngDiff > 0.00045) {
            return NextResponse.json({ error: 'Geofence Failed: Rider must be within 50m of merchant to complete delivery.' }, { status: 400 });
        }

        if (!photo_url) {
            return NextResponse.json({ error: 'Proof of Delivery photo is mandatory' }, { status: 400 });
        }

        const updated = await prisma.order.update({
            where: { id },
            data: {
                status: 'Delivered',
                rider_photo_url: photo_url,
            }
        });

        return NextResponse.json({ success: true, order: updated });
    } catch (error) {
        console.error('Delivery error:', error);
        return NextResponse.json({ error: 'Delivery failed' }, { status: 500 });
    }
}
