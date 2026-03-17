import { useEffect, useState } from 'react';

/**
 * @hook useInViewport
 * @description Hook that detects whether an element is currently visible in the viewport using the Intersection Observer API.
 * Updates state reactively as the element enters/exits the viewport. Useful for triggering animations, lazy loading, or
 * conditional rendering based on element visibility.
 *
 * @param {React.RefObject<HTMLElement | null>} ref - Ref object pointing to the DOM element to observe
 * @param {Object} options - Configuration options
 * @param {number} [options.threshold=0.1] - Intersection threshold; percentage of element that must be visible to trigger
 *                                             state change (0-1). Default 0.1 means 10% must be visible.
 *
 * @returns {boolean} `true` if the element is currently visible in the viewport, `false` otherwise
 *
 * @example
 * // Show animations only when header is visible
 * import { useRef } from 'react';
 * import { useInViewport } from '@/hooks/useInViewport';
 *
 * export function Header() {
 *   const headerRef = useRef(null);
 *   const isVisible = useInViewport(headerRef);
 *
 *   return (
 *     <header ref={headerRef}>
 *       {isVisible && <AnimatedButtons />}
 *     </header>
 *   );
 * }
 *
 * @example
 * // Lazy load content when section becomes visible
 * function LargeSection() {
 *   const ref = useRef(null);
 *   const isVisible = useInViewport(ref, { threshold: 0.5 });
 *
 *   return (
 *     <section ref={ref}>
 *       {isVisible && <ExpensiveComponent />}
 *     </section>
 *   );
 * }
 *
 * @note Uses IntersectionObserver which automatically cleans up on unmount
 * @note Browser support: All modern browsers (IE 11 requires polyfill)
 */
export function useInViewport(
  ref: React.RefObject<HTMLElement | null>,
  { threshold = 0.1 } = {}
): boolean {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold }
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref, threshold]);

  return isVisible;
}
