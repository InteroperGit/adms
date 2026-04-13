import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { checkCaptchaAsync } from './smartCaptcha';
import https from 'https';
import { EventEmitter } from 'events';

vi.mock('https', () => ({
    default: {
        request: vi.fn(),
    },
}));

class FakeReq extends EventEmitter {
    write = vi.fn();
    end = vi.fn();
    destroy = vi.fn();
}

describe('checkCaptchaAsync', () => {
    let fakeReq: FakeReq;

    beforeEach(() => {
        fakeReq = new FakeReq();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vi.mocked(https.request).mockReturnValue(fakeReq as any);
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => vi.restoreAllMocks());

    function triggerRes(statusCode: number, body: string) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const resCb = vi.mocked(https.request).mock.calls[0][1] as ((res: any) => void) | undefined;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mockRes = new EventEmitter() as any;
        mockRes.statusCode = statusCode;
        resCb?.(mockRes);
        mockRes.emit('data', body);
        mockRes.emit('end');
    }

    it('resolves true when captcha status is ok', async () => {
        const promise = checkCaptchaAsync('token', '1.2.3.4');
        triggerRes(200, JSON.stringify({ status: 'ok' }));
        await expect(promise).resolves.toBe(true);
    });

    it('resolves false when captcha status is not ok', async () => {
        const promise = checkCaptchaAsync('token', '1.2.3.4');
        triggerRes(200, JSON.stringify({ status: 'fail' }));
        await expect(promise).resolves.toBe(false);
    });

    it('resolves false on non-200 HTTP response', async () => {
        const promise = checkCaptchaAsync('token', '1.2.3.4');
        triggerRes(500, 'Server Error');
        await expect(promise).resolves.toBe(false);
    });

    it('resolves false on invalid JSON response', async () => {
        const promise = checkCaptchaAsync('token', '1.2.3.4');
        triggerRes(200, 'not-json');
        await expect(promise).resolves.toBe(false);
    });

    it('resolves false on request error', async () => {
        const promise = checkCaptchaAsync('token', '1.2.3.4');
        fakeReq.emit('error', new Error('network error'));
        await expect(promise).resolves.toBe(false);
    });

    it('resolves false on timeout and destroys request', async () => {
        const promise = checkCaptchaAsync('token', '1.2.3.4');
        fakeReq.emit('timeout');
        await expect(promise).resolves.toBe(false);
        expect(fakeReq.destroy).toHaveBeenCalled();
    });
});
