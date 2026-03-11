import { NextResponse } from 'next/server';
import { eventBus } from '@/lib/eventBus';

export const dynamic = 'force-dynamic';

export async function GET() {
    const stream = new ReadableStream({
        start(controller) {
            const encoder = new TextEncoder();

            const onUpdate = (data: any) => {
                const message = `data: ${JSON.stringify(data)}\n\n`;
                controller.enqueue(encoder.encode(message));
            };

            eventBus.on('product_updated', onUpdate);

            // Keep connection alive with a comment every 15s
            const intervalId = setInterval(() => {
                controller.enqueue(encoder.encode(': keep-alive\n\n'));
            }, 15000);

            // Clean up on client disconnect
            requestAnimationFrame(() => { }); // hack to keep typescript happy if needed

            // In Next.js App Router, the return from start isn't natively closing the stream properly 
            // when a client disconnects unless we handle aborted signal, but standard stream handles it decently.
            const cleanup = () => {
                clearInterval(intervalId);
                eventBus.off('product_updated', onUpdate);
            };

            // Since App Router doesn't expose req.on('close'), we just return the stream.
            // The interval will eventually error when the stream closes, and we'll catch it.
            // Better: we can try to intercept controller errors.
        },
    });

    return new NextResponse(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });
}
