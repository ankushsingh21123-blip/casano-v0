export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // In a real application, these would be complex aggregations across multiple tables.
        // For the investor demo, we will serve hardcoded/mocked highly impressive metrics.

        // RTO (Return to Origin) - typically 15-20% in e-commerce, showing <2% for this Hyperlocal model
        // CAC (Customer Acquisition Cost) - typically ₹200-500, showing near-zero due to merchant walk-in conversions
        // AOV (Average Order Value)

        const kpis = {
            aov: 450, // ₹450
            cac: 12.5, // ₹12.50
            rto_rate: 1.2, // 1.2%
            total_partners: 12,
            active_customers: 4520,
            monthly_gmv: 2450000 // ₹2.45M
        };

        return NextResponse.json(kpis);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch KPIs' }, { status: 500 });
    }
}

