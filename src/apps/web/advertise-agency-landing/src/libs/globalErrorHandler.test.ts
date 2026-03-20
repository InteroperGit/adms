import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { initGlobalErrorHandlers } from './globalErrorHandler';

describe('initGlobalErrorHandlers()', () => {
  let addEventListenerSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should register two event listeners (error and unhandledrejection)', () => {
    initGlobalErrorHandlers();

    expect(addEventListenerSpy).toHaveBeenCalledWith('error', expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledWith('unhandledrejection', expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledTimes(2);
  });

  it('should call onError callback when a synchronous error occurs', () => {
    const onError = vi.fn();
    initGlobalErrorHandlers({ onError });

    const errorHandler = addEventListenerSpy.mock.calls[0][1] as EventListener;
    const testError = new Error('Test sync error');
    const errorEvent = new ErrorEvent('error', {
      error: testError,
      message: 'Test error message',
      filename: 'test.js',
      lineno: 42,
      colno: 10,
    });

    errorHandler(errorEvent);

    expect(onError).toHaveBeenCalledOnce();
    const [error, context] = onError.mock.calls[0];
    expect(error).toBe(testError);
    expect(context.source).toBe('error');
    expect(context.timestamp).toBeDefined();
  });

  it('should convert non-Error objects in error events to Error instances', () => {
    const onError = vi.fn();
    initGlobalErrorHandlers({ onError });

    const errorHandler = addEventListenerSpy.mock.calls[0][1] as EventListener;
    const errorEvent = new ErrorEvent('error', {
      message: 'String error message',
      filename: 'test.js',
    });

    errorHandler(errorEvent);

    expect(onError).toHaveBeenCalledOnce();
    const [error] = onError.mock.calls[0];
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('String error message');
  });

  it('should log synchronous errors to console with [GlobalError] prefix', () => {
    initGlobalErrorHandlers();

    const errorHandler = addEventListenerSpy.mock.calls[0][1] as EventListener;
    const testError = new Error('Test error');
    const errorEvent = new ErrorEvent('error', {
      error: testError,
      message: 'Test message',
    });

    errorHandler(errorEvent);

    expect(consoleErrorSpy).toHaveBeenCalledOnce();
    const logCall = consoleErrorSpy.mock.calls[0][0];
    expect(logCall).toMatch(/\[GlobalError\] Synchronous error at/);
  });

  it('should call onError callback for unhandled promise rejections', () => {
    const onError = vi.fn();
    initGlobalErrorHandlers({ onError });

    const rejectionHandler = addEventListenerSpy.mock.calls[1][1] as EventListener;
    const testError = new Error('Promise rejection');
    const fakePromise = Promise.reject(testError).catch(() => {}); // Silence unhandled rejection
    const rejectionEvent = new PromiseRejectionEvent('unhandledrejection', {
      promise: fakePromise,
      reason: testError,
    });

    rejectionHandler(rejectionEvent);

    expect(onError).toHaveBeenCalledOnce();
    const [error, context] = onError.mock.calls[0];
    expect(error).toBe(testError);
    expect(context.source).toBe('unhandledrejection');
  });

  it('should convert string rejection reasons to Error instances', () => {
    const onError = vi.fn();
    initGlobalErrorHandlers({ onError });

    const rejectionHandler = addEventListenerSpy.mock.calls[1][1] as EventListener;
    const fakePromise = Promise.reject('String rejection').catch(() => {}); // Silence unhandled rejection
    const rejectionEvent = new PromiseRejectionEvent('unhandledrejection', {
      promise: fakePromise,
      reason: 'String rejection',
    });

    rejectionHandler(rejectionEvent);

    expect(onError).toHaveBeenCalledOnce();
    const [error] = onError.mock.calls[0];
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('String rejection');
  });

  it('should handle non-Error, non-string rejection reasons', () => {
    const onError = vi.fn();
    initGlobalErrorHandlers({ onError });

    const rejectionHandler = addEventListenerSpy.mock.calls[1][1] as EventListener;
    const rejectionReason = { code: 'ERR_NETWORK', status: 500 };
    const fakePromise = Promise.reject(rejectionReason).catch(() => {}); // Silence unhandled rejection
    const rejectionEvent = new PromiseRejectionEvent('unhandledrejection', {
      promise: fakePromise,
      reason: rejectionReason,
    });

    rejectionHandler(rejectionEvent);

    expect(onError).toHaveBeenCalledOnce();
    const [error] = onError.mock.calls[0];
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toContain('ERR_NETWORK');
  });

  it('should log unhandled promise rejections to console with [GlobalError] prefix', () => {
    initGlobalErrorHandlers();

    const rejectionHandler = addEventListenerSpy.mock.calls[1][1] as EventListener;
    const testError = new Error('Rejection');
    const fakePromise = Promise.reject(testError).catch(() => {}); // Silence unhandled rejection
    const rejectionEvent = new PromiseRejectionEvent('unhandledrejection', {
      promise: fakePromise,
      reason: testError,
    });

    rejectionHandler(rejectionEvent);

    expect(consoleErrorSpy).toHaveBeenCalledOnce();
    const logCall = consoleErrorSpy.mock.calls[0][0];
    expect(logCall).toMatch(/\[GlobalError\] Unhandled promise rejection at/);
  });

  it('should work without an onError callback', () => {
    expect(() => initGlobalErrorHandlers()).not.toThrow();
    expect(() => initGlobalErrorHandlers({})).not.toThrow();
  });
});
