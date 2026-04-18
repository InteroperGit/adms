import type { Message } from './message';

export type OrderMessageType = 'ORDER_SUBMITTED';

export interface OrderConsentLink {
    label: string;
    href: string;
    version?: string;
    effectiveDate?: string;
}

export interface OrderConsentRecord {
    acceptedAt: string;
    text: string;
    links: OrderConsentLink[];
    userAgent: string;
    language: string;
    timezone: string;
    screenResolution: string;
    referrer: string | null;
}

export interface OrderSubmissionPayload {
    order: Record<string, string | boolean> & { productType: string };
    consent: OrderConsentRecord;
    captchaToken: string;
}

export const MESSAGE_VERSION = '2.0';

export const MESSAGE_SOURCE = 'orders-intake';

export interface OrderMessage extends Message {
    type: OrderMessageType;
    source: typeof MESSAGE_SOURCE;
    version: typeof MESSAGE_VERSION;
    consent: OrderConsentRecord;
}

export function buildOrderMessage(
    order: Record<string, unknown>,
    consent: OrderConsentRecord,
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
        consent,
    };
}
