/**
 * SilentErrorFallback component - Renders nothing when an error occurs.
 *
 * Used for components where graceful degradation means silently skipping that section
 * entirely without displaying any error UI (e.g., carousel, hero background effects, etc.).
 *
 * The component simply doesn't render, allowing the page to flow naturally to the next section.
 *
 * @component
 * @returns {null} Nothing is rendered
 *
 * @example
 * // Carousel fails silently, page continues below
 * <ErrorBoundary fallback={<SilentErrorFallback />}>
 *   <Carousel />
 * </ErrorBoundary>
 */
export function SilentErrorFallback() {
  return null;
}
