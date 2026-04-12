import { randomUUID } from 'crypto';

export type OrderMessageType = 'ORDER_SUBMITTED';

export const MESSAGE_VERSION = '1.0';

export const MESSAGE_SOURCE = 'orders-intake';

export interface OrderMessage {
    type: OrderMessageType;
    messageId: string;
    timestamp: string;
    source: typeof MESSAGE_SOURCE;
    correlationId: string;
    version: typeof MESSAGE_VERSION;
    payload: Record<string, unknown>;
}

export function buildOrderMessage(
    order: Record<string, unknown>,
    correlationId: string,
): OrderMessage {
    return {
        type: 'ORDER_SUBMITTED',
        messageId: randomUUID(),
        timestamp: new Date().toISOString(),
        source: MESSAGE_SOURCE,
        correlationId,
        version: MESSAGE_VERSION,
        payload: order,
    };
}
