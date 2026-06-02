import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const { merchant_id } = await req.json();

        if (!merchant_id || typeof merchant_id !== 'string') {
            return NextResponse.json({ error: 'merchant_id is required' }, { status: 400 });
        }

        // This is a prime candidate for "Ghost Inventory" (sold physically, forgot to update app)
        const suspiciousProducts = await prisma.product.findMany({
            where: {
                merchant_id: merchant_id.toString(),
                is_live: true,
                OR: [
                    { app_reserved_stock: { lte: 2 } },
                    {
                        // Note: In an actual raw query, we'd check if app_reserved_stock <= safety_buffer
                        // Prisma makes comparing two columns slightly trickier in standard findMany, 
                        // so we pull items with generally low absolute stock to trigger the demo UI.
                        app_reserved_stock: { lte: 5 }
                    }
                ]
            },
            take: 1, // Just grab one to trigger the "Quick Check" modal
            orderBy: {
                app_reserved_stock: 'asc'
            }
        });

        if (suspiciousProducts.length > 0) {
            return NextResponse.json({
                needs_reconciliation: true,
                product: suspiciousProducts[0]
            });
        }

        return NextResponse.json({
            needs_reconciliation: false
        });

    } catch (error) {
        console.error("Reconciliation Error:", error);
        return NextResponse.json({ error: 'Failed to run reconciliation' }, { status: 500 });
    }
}
