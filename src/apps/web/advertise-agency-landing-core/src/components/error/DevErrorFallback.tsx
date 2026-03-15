import { cn } from '@/libs/utils';

/**
 * Props for DevErrorFallback component.
 */
interface DevErrorFallbackProps {
  /**
   * The error object that was caught.
   */
  error: Error | null;
  /**
   * Component stack trace from React ErrorBoundary.
   */
  componentStack?: string | null;
}

/**
 * DevErrorFallback component - Detailed error display for development mode only.
 *
 * Shows the error message and component stack trace to help developers debug rendering errors.
 * Only rendered in development mode (`import.meta.env.DEV`).
 *
 * In production, the standard `ErrorFallback` is used instead.
 *
 * **Important:** This component is ONLY for development. Do NOT use it in production.
 *
 * @component
 * @param {DevErrorFallbackProps} props - Component props
 * @param {Error | null} props.error - The caught error object
 * @param {string} [props.componentStack] - React component stack from ErrorInfo
 * @returns {React.ReactElement} Detailed error display with stack trace
 *
 * @example
 * // Only shown in development
 * {import.meta.env.DEV && (
 *   <DevErrorFallback error={error} componentStack={errorInfo.componentStack} />
 * )}
 */
export function DevErrorFallback({ error, componentStack }: DevErrorFallbackProps) {
  return (
    <div className={cn('min-h-screen bg-red-50 p-8')}>
      <div className={cn('mx-auto max-w-2xl')}>
        {/* Header */}
        <div className={cn('mb-6')}>
          <h1 className={cn('mb-2 text-3xl font-bold text-red-900')}>⚠️ Development Error</h1>
          <p className={cn('text-sm text-red-700')}>
            This error details are only visible in development mode. Users will see a friendly error message.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className={cn('mb-6 rounded-lg bg-red-100 p-4')}>
            <h2 className={cn('mb-2 font-mono text-sm font-bold text-red-900')}>Error Message:</h2>
            <p className={cn('whitespace-pre-wrap font-mono text-sm text-red-800')}>{error.message}</p>
            {error.stack && (
              <>
                <h3 className={cn('mb-2 mt-4 font-mono text-sm font-bold text-red-900')}>Stack Trace:</h3>
                <pre className={cn('overflow-x-auto rounded bg-red-900/5 p-3 font-mono text-xs text-red-800')}>
                  {error.stack}
                </pre>
              </>
            )}
          </div>
        )}

        {/* Component Stack */}
        {componentStack && (
          <div className={cn('rounded-lg bg-orange-100 p-4')}>
            <h2 className={cn('mb-2 font-mono text-sm font-bold text-orange-900')}>React Component Stack:</h2>
            <pre className={cn('overflow-x-auto rounded bg-orange-900/5 p-3 font-mono text-xs text-orange-800')}>
              {componentStack}
            </pre>
          </div>
        )}

        {/* Info */}
        <div className={cn('mt-6 rounded-lg bg-blue-50 p-4')}>
          <p className={cn('text-sm text-blue-900')}>
            💡 <strong>Tip:</strong> Check the browser console for more details. The error is also logged with{' '}
            <code className={cn('font-mono font-bold')}>[ErrorBoundary]</code> prefix.
          </p>
        </div>
      </div>
    </div>
  );
}
