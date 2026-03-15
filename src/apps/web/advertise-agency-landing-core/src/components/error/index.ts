/**
 * Error handling components and utilities.
 *
 * This module provides a layered error handling solution:
 * - `ErrorBoundary` — React class component that catches rendering errors
 *   - In DEV: shows detailed `DevErrorFallback` with stack trace
 *   - In PROD: shows user-friendly `ErrorFallback`
 * - `ErrorFallback` — User-friendly error UI fallback with icon and message
 * - `SilentErrorFallback` — Silent fallback that renders nothing (for optional components)
 * - `DevErrorFallback` — Dev-mode detailed error display with full stack trace and component stack
 *
 * @module components/error
 */

export { ErrorBoundary } from './ErrorBoundary';
export { ErrorFallback } from './ErrorFallback';
export { SilentErrorFallback } from './SilentErrorFallback';
export { DevErrorFallback } from './DevErrorFallback';

