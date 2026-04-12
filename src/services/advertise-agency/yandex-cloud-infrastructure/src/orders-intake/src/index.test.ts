import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const mockCheckCaptchaAsync = vi.fn();
const mockSendMessageToQueueAsync = vi.fn();
const mockLogWarn = vi.fn();
const mockLogError = vi.fn();

vi.doMock('./smartCaptcha', () => ({
    checkCaptchaAsync: mockCheckCaptchaAsync,
}));

vi.doMock('./messageQueue', () => ({
    sendMessageToQueueAsync: mockSendMessageToQueueAsync,
}));

vi.doMock('./logs', () => ({
    logWarn: mockLogWarn,
    logError: mockLogError,
}));

describe('handler', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.resetModules();
    });

    async function importHandler() {
        const mod = await import('./index');
        return mod.handler;
    }

    it('returns 400 when body is not valid JSON', async () => {
        const handler = await importHandler();
        const res = await handler({ body: 'not-json' });

        expect(res.statusCode).toBe(400);
        expect(mockLogWarn).toHaveBeenCalledWith('Invalid JSON body', expect.any(Object));
    });

    it('returns 400 when captchaToken is missing', async () => {
        const handler = await importHandler();
        const res = await handler({ body: JSON.stringify({ order: { name: 'test' } }) });

        expect(res.statusCode).toBe(400);
        expect(mockLogWarn).toHaveBeenCalledWith('Captcha token is required', expect.any(Object));
    });

    it('returns 400 when order is missing', async () => {
        const handler = await importHandler();
        const res = await handler({ body: JSON.stringify({ captchaToken: 'abc' }) });

        expect(res.statusCode).toBe(400);
        expect(mockLogWarn).toHaveBeenCalledWith('Order is required', expect.any(Object));
    });

    it('returns 400 when order is not an object', async () => {
        const handler = await importHandler();
        const res = await handler({ body: JSON.stringify({ captchaToken: 'abc', order: 'string' }) });

        expect(res.statusCode).toBe(400);
    });

    it('returns 400 when captcha validation fails', async () => {
        mockCheckCaptchaAsync.mockResolvedValue(false);

        const handler = await importHandler();
        const res = await handler({
            body: JSON.stringify({ captchaToken: 'abc', order: { name: 'test' } }),
            requestContext: { identity: { sourceIp: '1.2.3.4' }, requestId: 'req-1' },
        });

        expect(res.statusCode).toBe(400);
        expect(mockLogWarn).toHaveBeenCalledWith('Captcha validation failed', { requestId: 'req-1' });
    });

    it('sends order to queue and returns 200 on success', async () => {
        mockCheckCaptchaAsync.mockResolvedValue(true);
        mockSendMessageToQueueAsync.mockResolvedValue('msg-123');

        const handler = await importHandler();
        const order = { name: 'John', phone: '+79991234567' };
        const res = await handler({
            body: JSON.stringify({ captchaToken: 'valid-token', order }),
            requestContext: { identity: { sourceIp: '1.2.3.4' }, requestId: 'req-2' },
        });

        expect(res.statusCode).toBe(200);
        expect(JSON.parse(res.body)).toEqual({ messageId: 'msg-123' });
        expect(mockSendMessageToQueueAsync).toHaveBeenCalledWith(JSON.stringify(order));
    });

    it('returns 500 when sendMessageToQueueAsync throws', async () => {
        mockCheckCaptchaAsync.mockResolvedValue(true);
        mockSendMessageToQueueAsync.mockRejectedValue(new Error('SQS error'));

        const handler = await importHandler();
        const res = await handler({
            body: JSON.stringify({ captchaToken: 'abc', order: { name: 'test' } }),
            requestContext: { identity: { sourceIp: '1.2.3.4' }, requestId: 'req-3' },
        });

        expect(res.statusCode).toBe(500);
        expect(JSON.parse(res.body)).toEqual({ ok: false, error: 'SQS error' });
        expect(mockLogError).toHaveBeenCalledWith(expect.any(Error), { requestId: 'req-3' });
    });
});
