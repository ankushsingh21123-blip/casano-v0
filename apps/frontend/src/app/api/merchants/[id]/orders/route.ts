export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const orders = await prisma.order.findMany({
            where: { merchant_id: id, status: 'Pending' },
            orderBy: { created_at: 'desc' }
        });

        return NextResponse.json(orders);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch pending orders' }, { status: 500 });
    }
}
