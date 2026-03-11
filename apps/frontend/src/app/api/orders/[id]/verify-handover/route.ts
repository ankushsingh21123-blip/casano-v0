import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { qr_data, face_match_success } = await request.json();

        if (qr_data !== id) {
            return NextResponse.json({ error: 'Invalid QR Code for this order.' }, { status: 400 });
        }

        if (!face_match_success) {
            return NextResponse.json({ error: 'Aadhar Face Match Failed. Handover aborted.' }, { status: 403 });
        }

        const order = await prisma.order.findUnique({ where: { id } });
        if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

        // In a real flow, OTP is shown to merchant now or Rider gets picking status.
        // We will just return the OTP so the rider app can display it, or the merchant sees it.
        // For demo, rider app simulates success, prints OTP to show to merchant.
        await prisma.order.update({
            where: { id },
            data: { status: 'Picked Up' }
        });

        return NextResponse.json({ success: true, otp: order.pickup_otp });
    } catch (error) {
        return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
    }
}
