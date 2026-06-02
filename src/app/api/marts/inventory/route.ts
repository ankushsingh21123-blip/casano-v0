import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        // In reality, this would fetch from DMart's external API.
        // For demo, we just fetch our own products and apply a discount.
        const products = await prisma.product.findMany({
            take: 10
        });

        const dmartInventory = products.map((p: any) => ({
            id: `dmart_${p.id}`,
            original_id: p.id,
            name: p.name,
            category: p.category,
            dmart_price: p.selling_price * 0.85, // 15% cheaper
            delivery_time_mins: 15,
            in_stock: true
        }));

        return NextResponse.json(dmartInventory);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch DMart inventory' }, { status: 500 });
    }
}
