import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: merchantId } = await params;

        // Fetch all products for this merchant
        const products = await prisma.product.findMany({
            where: { merchant_id: merchantId }
        });

        // Mock an AI prediction model analyzing the last 7 days of sales velocity
        // In reality, we'd query the SalesLog for date > now - 7 days and sum quantities.
        // For this investor demo, we will use a pseudo-randomized (but deterministic based on id length) 
        // velocity to guarantee we show some items as High Demand.

        const predictions: any[] = [];
        let totalProfitLoss = 0;

        for (const product of products) {
            // Deterministic pseudo-random velocity (1 to 15 per day) based on product name length
            const baseVelocity = (product.name.length % 15) + 1;

            // If it's Stationery, give it a higher velocity to trigger the use-case
            const velocityPerDay = product.category === 'Stationery' ? baseVelocity + 5 : baseVelocity;

            const currentStock = product.app_reserved_stock;
            const daysOfSupply = currentStock / velocityPerDay;

            let status = 'Healthy';
            let recommendedReorder = 0;
            let potentialProfitLoss = 0;

            // Flag if less than 3 days of supply
            if (daysOfSupply < 3) {
                status = 'High Demand';
                // Suggest buying enough for 7 days
                recommendedReorder = Math.ceil(velocityPerDay * 7) - currentStock;

                // Calculate missed profit if they run out in the next 3 days
                const margin = product.selling_price - product.cost_price;
                potentialProfitLoss = (velocityPerDay * 3) * margin;

                // Only count it if stock is truly critically low (< velocity)
                if (currentStock < velocityPerDay) {
                    totalProfitLoss += potentialProfitLoss;
                }
            }

            predictions.push({
                id: product.id,
                name: product.name,
                category: product.category,
                currentAppStock: currentStock,
                runwayDays: daysOfSupply.toFixed(1),
                velocityPerDay,
                status,
                recommendedReorder,
                potentialProfitLoss
            });
        }

        // Sort to put High Demand at the top
        predictions.sort((a, b) => a.daysOfSupply - b.daysOfSupply);

        return NextResponse.json({
            totalPotentialProfitLoss: totalProfitLoss,
            predictions
        });

    } catch (error) {
        console.error('Predictions API Error:', error);
        return NextResponse.json({ error: 'Failed to generate predictions' }, { status: 500 });
    }
}
