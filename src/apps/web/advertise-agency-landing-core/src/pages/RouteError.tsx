import { useRouteError } from 'react-router';
import { ErrorFallback } from '@/components/error';

/**
 * RouteError component - Handles route-level errors from react-router.
 *
 * This component is used as the `errorElement` on the root route.
 * It catches errors thrown during route component rendering or data loading.
 *
 * React-router can throw different types of errors:
 * - `Error` objects — JavaScript errors (from component rendering, data loading, etc.)
 * - `Response` objects — HTTP-like status responses (404, 500, etc. thrown by loaders)
 *
 * This component extracts the error via `useRouteError()` and displays an error message.
 *
 * @component
 * @returns {React.ReactElement} ErrorFallback with error details
 */
export function RouteError() {
  const error = useRouteError();

  // Log the error for debugging (developer visibility)
  // Handles different error types: Error objects, Response objects, or strings
  if (error instanceof Error) {
    console.error('[RouteError] Error:', error.message, error.stack);
  } else if (error && typeof error === 'object' && 'statusText' in error) {
    // React-router Response object (from loaders)
    const responseError = error as { statusText?: string; status?: number };
    console.error(
      '[RouteError] Route response error:',
      responseError.statusText || responseError.status
    );
  } else if (typeof error === 'string') {
    console.error('[RouteError] String error:', error);
  } else {
    console.error('[RouteError] Unknown error:', error);
  }

  return <ErrorFallback />;
}
