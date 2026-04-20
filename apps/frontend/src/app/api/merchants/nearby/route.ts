export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    // Mock Geolocation logic: In a real app we'd receive lat/lng and use Haversine
    // For this demo, we seeded exactly 3 merchants so we just return them all.

    try {
        const merchants = await prisma.merchant.findMany({
            take: 3,
        });

        return NextResponse.json(merchants);
    } catch (error) {
        console.error('Error fetching nearby merchants:', error);
        return NextResponse.json({ error: 'Failed to fetch merchants' }, { status: 500 });
    }
}

