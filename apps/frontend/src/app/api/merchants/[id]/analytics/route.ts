import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: merchantId } = await params;

        const merchant = await prisma.merchant.findUnique({
            where: { id: merchantId }
        });

        if (!merchant) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        // In a real app we'd filter by today's date context. For demo, we use all DB records.
        const salesLogs = await prisma.salesLog.findMany({
            where: { merchant_id: merchantId },
            include: { product: true }
        });

        let totalRevenue = 0;
        let totalCOGS = 0;
        const topMoversMap = new Map(); // productId -> sum of quantity

        for (const log of salesLogs) {
            if (!log.product) continue;

            const revenue = log.quantity * log.product.selling_price;
            const cogs = log.quantity * log.product.cost_price;

            totalRevenue += revenue;
            totalCOGS += cogs;

            // Group sales by product for top movers chart
            const existing = topMoversMap.get(log.product.id) || { name: log.product.name, walkin: 0, app: 0, total: 0 };
            if (log.sale_type === 'Walk-in') {
                existing.walkin += log.quantity;
            } else {
                existing.app += log.quantity;
            }
            existing.total += log.quantity;
            topMoversMap.set(log.product.id, existing);
        }

        const platformCommission = (totalRevenue - totalCOGS) * (merchant.platform_fee_percent / 100);
        const finalProfit = totalRevenue - totalCOGS - platformCommission;

        const topMoversArray = Array.from(topMoversMap.values()).sort((a, b) => b.total - a.total).slice(0, 5);

        return NextResponse.json({
            summary: {
                totalRevenue,
                totalCOGS,
                platformCommission,
                finalProfit
            },
            topMovers: topMoversArray
        });

    } catch (error) {
        console.error('Analytics error:', error);
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}
