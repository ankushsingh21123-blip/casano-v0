import { EventEmitter } from 'events';

const globalForEventBus = globalThis as unknown as {
    eventBus: EventEmitter;
};

// Store globally in ALL environments (including production)
// so that SSE stream and webhook routes share the same instance
export const eventBus = globalForEventBus.eventBus || new EventEmitter();
globalForEventBus.eventBus = eventBus;

// Increase max listeners to avoid warnings with many SSE clients
eventBus.setMaxListeners(50);
