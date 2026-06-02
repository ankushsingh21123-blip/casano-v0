import { NextResponse } from 'next/server';
import { eventBus } from '@/lib/eventBus';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const stream = new ReadableStream({
        start(controller) {
            const encoder = new TextEncoder();

            const onUpdate = (data: any) => {
                try {
                    const message = `data: ${JSON.stringify(data)}\n\n`;
                    controller.enqueue(encoder.encode(message));
                } catch {
                    // Stream may have been closed — trigger cleanup
                    cleanup();
                }
            };

            eventBus.on('product_updated', onUpdate);

            // Keep connection alive with a comment every 15s
            const intervalId = setInterval(() => {
                try {
                    controller.enqueue(encoder.encode(': keep-alive\n\n'));
                } catch {
                    // Stream closed — trigger cleanup
                    cleanup();
                }
            }, 15000);

            // Proper cleanup function
            const cleanup = () => {
                clearInterval(intervalId);
                eventBus.off('product_updated', onUpdate);
                try { controller.close(); } catch {}
            };

            // Detect client disconnect via AbortSignal
            request.signal.addEventListener('abort', cleanup);
        },
    });

    return new NextResponse(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
            'X-Accel-Buffering': 'no', // Prevent nginx buffering
        },
    });
}
