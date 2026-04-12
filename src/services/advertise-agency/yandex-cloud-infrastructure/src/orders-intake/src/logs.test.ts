import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { logWarn, logError } from './logs';

describe('logWarn', () => {
    beforeEach(() => vi.spyOn(console, 'warn').mockImplementation(() => {}));
    afterEach(() => vi.restoreAllMocks());

    it('logs a structured JSON warn message', () => {
        logWarn('test warning');
        expect(console.warn).toHaveBeenCalledWith(
            JSON.stringify({ level: 'warn', message: 'test warning' })
        );
    });

    it('includes extra fields in the log', () => {
        logWarn('test', { requestId: 'abc', userId: 1 });
        expect(console.warn).toHaveBeenCalledWith(
            JSON.stringify({ level: 'warn', message: 'test', requestId: 'abc', userId: 1 })
        );
    });
});

describe('logError', () => {
    beforeEach(() => vi.spyOn(console, 'error').mockImplementation(() => {}));
    afterEach(() => vi.restoreAllMocks());

    it('logs a structured JSON error message', () => {
        logError('something broke');
        expect(console.error).toHaveBeenCalledWith(
            JSON.stringify({ level: 'error', message: 'something broke' })
        );
    });

    it('extracts message from Error object', () => {
        logError(new Error('crash'));
        expect(console.error).toHaveBeenCalledWith(
            JSON.stringify({ level: 'error', message: 'crash' })
        );
    });

    it('includes extra fields in the log', () => {
        logError('fail', { requestId: 'xyz' });
        expect(console.error).toHaveBeenCalledWith(
            JSON.stringify({ level: 'error', message: 'fail', requestId: 'xyz' })
        );
    });
});
