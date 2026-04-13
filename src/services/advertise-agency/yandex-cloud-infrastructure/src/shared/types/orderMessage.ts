import type { Message } from './message';

export type OrderMessageType = 'ORDER_SUBMITTED';

export const MESSAGE_VERSION = '1.0';

export const MESSAGE_SOURCE = 'orders-intake';

export interface OrderMessage extends Message {
    type: OrderMessageType;
    source: typeof MESSAGE_SOURCE;
    version: typeof MESSAGE_VERSION;
}

export function buildOrderMessage(
    order: Record<string, unknown>,
    correlationId: string,
): OrderMessage {
    return {
        type: 'ORDER_SUBMITTED',
        messageId: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        source: MESSAGE_SOURCE,
        correlationId,
        version: MESSAGE_VERSION,
        payload: order,
    };
}
