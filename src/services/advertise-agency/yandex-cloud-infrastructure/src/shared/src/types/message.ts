export interface Message {
    type: string;
    messageId: string;
    timestamp: string;
    source: string;
    correlationId: string;
    version: string;
    payload: Record<string, unknown>;
}
