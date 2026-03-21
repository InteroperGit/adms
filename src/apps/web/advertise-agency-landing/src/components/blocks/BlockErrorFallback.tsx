import { cn } from '@/libs/utils';

/**
 * BlockErrorFallback component - Minimal placeholder displayed when a block fails to render.
 *
 * Shows a subtle, non-intrusive placeholder that indicates content could not be displayed
 * without breaking the page layout or attracting excessive user attention.
 *
 * Used as the fallback UI in the granular ErrorBoundary around portfolio case blocks.
 * A broken block should not crash the entire portfolio case page — just that one block
 * shows this minimal error placeholder.
 *
 * @component
 * @returns {React.ReactElement} A minimal inline error placeholder
 *
 * @example
 * <ErrorBoundary fallback={<BlockErrorFallback />}>
 *   <SomeComplexBlock {...props} />
 * </ErrorBoundary>
 */
export function BlockErrorFallback() {
  return (
    <div
      className={cn(
        'flex min-h-20 items-center justify-center',
        'rounded-lg border border-dashed border-muted-foreground/20',
        'bg-muted/50 px-4 py-8 text-center'
      )}
      role="status"
      aria-label="Content unavailable"
    >
      <p className="text-sm text-muted-foreground">Content could not be displayed</p>
    </div>
  );
}
