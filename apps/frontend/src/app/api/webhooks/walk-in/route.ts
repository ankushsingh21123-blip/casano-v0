export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { eventBus } from '@/lib/eventBus';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { productId, quantity } = body;

        // Ghost Inventory Preventer Logic
        const product = await prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        const newTotalStock = product.total_stock - quantity;
        let newAppReservedStock = product.app_reserved_stock;
        let ghostInventoryTriggered = false;

        // If total physical stock drops below app reserved stock, reduce app stock!
        if (newTotalStock < product.app_reserved_stock) {
            newAppReservedStock = Math.max(0, newTotalStock); // ensure never negative
            ghostInventoryTriggered = true;
        }

        const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: {
                total_stock: newTotalStock,
                app_reserved_stock: newAppReservedStock,
            },
            include: {
                merchant: true, // For real-time payloads if needed
            }
        });

        // Record the walk-in sale
        await prisma.salesLog.create({
            data: {
                product_id: productId,
                merchant_id: updatedProduct.merchant_id,
                sale_type: 'Walk-in',
                quantity: quantity,
            }
        });

        // Broadcast the update to any connected Customer Storefronts
        eventBus.emit('product_updated', {
            type: 'product_updated',
            product: updatedProduct,
            ghostInventoryTriggered
        });

        return NextResponse.json({
            success: true,
            product: updatedProduct,
            ghostInventoryTriggered
        });

    } catch (error) {
        console.error('Walk-in webhook error:', error);
        return NextResponse.json({ error: 'Failed to process walk-in sale' }, { status: 500 });
    }
}

