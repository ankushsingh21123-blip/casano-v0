import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { eventBus } from '@/lib/eventBus';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string, productId: string }> }
) {
    try {
        const { productId } = await params;
        const body = await request.json();

        // We only allow updating app_reserved_stock and is_live for the demo
        const updateData: any = {};
        if (typeof body.app_reserved_stock === 'number') {
            updateData.app_reserved_stock = body.app_reserved_stock;
        }
        if (typeof body.is_live === 'boolean') {
            updateData.is_live = body.is_live;
        }

        const updatedProduct = await prisma.product.update({
            where: {
                id: productId,
            },
            data: updateData,
        });

        eventBus.emit('product_updated', {
            type: 'product_updated',
            product: updatedProduct,
            ghostInventoryTriggered: false
        });

        return NextResponse.json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}
