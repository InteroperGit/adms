import React from 'react';
import { AlertCircle } from 'lucide-react';
import { errorFallbackContent } from '@/types/config/errorFallback';
import { cn } from '@/libs/utils';

/**
 * Props for the ErrorFallback component.
 */
interface ErrorFallbackProps {
  /**
   * Optional callback invoked when the user clicks the reset button.
   * If not provided, defaults to navigation to homepage ("/").
   */
  onReset?: () => void;
}

/**
 * ErrorFallback component - A centered error UI fallback displayed when errors occur.
 *
 * Renders a user-friendly error message with an icon and action button.
 * All text is sourced from `errorFallbackContent` config to support white-label customization.
 * This component has no data or context dependencies, ensuring it can render even when
 * providers or data parsing fails.
 *
 * @component
 * @example
 * // Basic usage with default behavior (navigate to homepage on reset)
 * <ErrorFallback />
 *
 * @example
 * // With custom reset callback
 * <ErrorFallback onReset={() => window.location.reload()} />
 *
 * @param {ErrorFallbackProps} props - Component props
 * @param {() => void} [props.onReset] - Optional reset callback
 * @returns {React.ReactElement} The error fallback UI
 */
export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ onReset }) => {
  const { title, description, resetLabel } = errorFallbackContent;

  const handleClick = () => {
    if (onReset) {
      onReset();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className={cn('flex min-h-screen items-center justify-center bg-background px-4')}>
      <div className={cn('w-full max-w-md text-center')}>
        {/* Error Icon */}
        <div className={cn('mb-6 flex justify-center')}>
          <div className={cn('rounded-full bg-destructive/10 p-4')}>
            <AlertCircle className={cn('h-12 w-12 text-destructive')} />
          </div>
        </div>

        {/* Title */}
        <h1 className={cn('mb-3 text-2xl font-bold text-foreground')}>{title}</h1>

        {/* Description */}
        <p className={cn('mb-8 text-base text-muted-foreground')}>{description}</p>

        {/* Action Button */}
        <button
          onClick={handleClick}
          className={cn(
            'inline-block rounded-lg px-6 py-2.5 font-medium',
            'bg-primary text-primary-foreground',
            'transition-colors hover:bg-primary/90 active:bg-primary/80'
          )}
        >
          {resetLabel}
        </button>
      </div>
    </div>
  );
};
