import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        // Mocking a Cloud Vision / OCR extraction delay
        await new Promise(resolve => setTimeout(resolve, 2500));

        // The mock extracted data from a photo of a Kirana Invoice
        const extractedItems = [
            {
                name: "Tata Premium Tea 500g",
                category: "Daily Essentials",
                qty: 12,
                mrp: 270,
                cost_price: 235,
                confidence: 0.98
            },
            {
                name: "Parle-G Gold 1kg",
                category: "Marts",
                qty: 24,
                mrp: 90,
                cost_price: 72,
                confidence: 0.95
            },
            {
                name: "Dettol Liquid Soap Refill",
                category: "Daily Essentials",
                qty: 8,
                mrp: 185,
                cost_price: 155,
                confidence: 0.91
            },
            {
                name: "Classmate Notebook Spiral",
                category: "Stationery",
                qty: 40,
                mrp: 80,
                cost_price: 60,
                confidence: 0.99
            }
        ];

        return NextResponse.json({
            success: true,
            message: "Invoice Parsed Successfully",
            document_type: "Wholesale Invoice",
            items: extractedItems
        });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to process image' }, { status: 500 });
    }
}
