/**
 * Global error handler initialization - Catches unhandled errors and promise rejections.
 *
 * This module provides utilities for setting up global error listeners that catch:
 * - Synchronous errors outside the React tree (script errors, image load failures, etc.)
 * - Unhandled promise rejections
 *
 * Only runs client-side; guards against SSG/SSR execution.
 */

/**
 * Callback type for error reporting integration.
 *
 * Called when a global error is caught, allowing integration with error reporting services
 * like Sentry, Rollbar, etc.
 */
type OnErrorCallback = (error: Error, context: { timestamp: string; source: 'error' | 'unhandledrejection' }) => void;

/**
 * Configuration for global error handlers.
 */
interface GlobalErrorHandlerConfig {
  /**
   * Optional callback invoked when an error is caught.
   * Useful for integrating with error reporting services.
   */
  onError?: OnErrorCallback;
}

/**
 * Initialize global error handlers for the application.
 *
 * Sets up two event listeners:
 * 1. `window.error` — catches synchronous errors outside React (script errors, image load failures, etc.)
 * 2. `window.unhandledrejection` — catches unhandled promise rejections
 *
 * All errors are logged to console with a `[GlobalError]` prefix and timestamp.
 *
 * Only runs on the client-side; exits silently during SSG/SSR.
 *
 * @param {GlobalErrorHandlerConfig} [config] - Optional configuration
 * @param {OnErrorCallback} [config.onError] - Callback for error reporting integration (Sentry, etc.)
 *
 * @example
 * // Basic usage
 * initGlobalErrorHandlers();
 *
 * @example
 * // With Sentry integration
 * initGlobalErrorHandlers({
 *   onError: (error, context) => {
 *     Sentry.captureException(error, { contexts: { global: context } });
 *   }
 * });
 */
export function initGlobalErrorHandlers(config?: GlobalErrorHandlerConfig): void {
  // Guard against SSG/SSR execution
  if (typeof window === 'undefined') {
    return;
  }

  /**
   * Handle synchronous errors outside React tree.
   *
   * Catches:
   * - Script loading errors
   * - Image load failures
   * - Errors in event handlers not caught by React
   * - Third-party library errors
   */
  window.addEventListener('error', (event: ErrorEvent) => {
    const error = event.error instanceof Error ? event.error : new Error(event.message);
    const timestamp = new Date().toISOString();

    // Log structured error information
    console.error(
      `[GlobalError] Synchronous error at ${timestamp}`,
      error,
      {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      }
    );

    // Invoke error reporting callback if provided
    if (config?.onError) {
      config.onError(error, { timestamp, source: 'error' });
    }
  });

  /**
   * Handle unhandled promise rejections.
   *
   * Catches:
   * - Promises rejected without .catch() handler
   * - Async errors not caught by try/catch
   * - Fetch/async API errors
   */
  window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
    // Convert rejection reason to Error if necessary
    let error: Error;
    if (event.reason instanceof Error) {
      error = event.reason;
    } else if (typeof event.reason === 'string') {
      error = new Error(event.reason);
    } else {
      error = new Error(`Promise rejected with: ${JSON.stringify(event.reason)}`);
    }

    const timestamp = new Date().toISOString();

    // Log structured error information
    console.error(
      `[GlobalError] Unhandled promise rejection at ${timestamp}`,
      error,
      {
        reason: event.reason,
        promise: event.promise,
      }
    );

    // Invoke error reporting callback if provided
    if (config?.onError) {
      config.onError(error, { timestamp, source: 'unhandledrejection' });
    }
  });
}
