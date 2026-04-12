import { randomUUID } from 'crypto';

export function parseBody(event: Record<string, unknown>): Record<string, unknown> {
    const rawBody = event.body ?? '{}';
    return typeof rawBody === 'string' ? JSON.parse(rawBody) : rawBody as Record<string, unknown>;
}

export function getCaptchaToken(body: Record<string, unknown>): string | undefined {
    return body.captchaToken as string | undefined;
}

export function getClientIp(event: Record<string, unknown>): string | undefined {
    const rc = event.requestContext as Record<string, unknown> | undefined;
    return (rc?.identity as Record<string, unknown>)?.sourceIp as string | undefined
        || (rc?.http as Record<string, unknown>)?.sourceIp as string | undefined;
}

export function getOrder(body: Record<string, unknown>): unknown {
    return body.order;
}

export function getRequestId(event: Record<string, unknown>): string {
    const rc = event.requestContext as Record<string, unknown> | undefined;
    return (
        rc?.requestId as string | undefined ||
        event.requestId as string | undefined ||
        randomUUID()
    );
}
