import { useEffect, useRef, useState } from 'react';

/**
 * @hook useViewportAnimation
 * @description Triggers animation state when element comes into viewport.
 * Respects `prefers-reduced-motion` media query. Useful for scroll-triggered animations
 * and count-up effects.
 *
 * @param {Object} [options] - Configuration options
 * @param {number} [options.threshold=0.3] - Intersection threshold (0-1)
 * @returns {[React.RefObject<HTMLDivElement | null>, boolean]} - Tuple of [ref to attach to element, hasAnimated state]
 *
 * @example
 * export function StatsSection() {
 *   const [ref, hasAnimated] = useViewportAnimation();
 *
 *   return (
 *     <div ref={ref}>
 *       {hasAnimated && <CountUpAnimation />}
 *     </div>
 *   );
 * }
 */
export function useViewportAnimation(
  { threshold = 0.3 } = {}
): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const raf = requestAnimationFrame(() => setHasAnimated(true));
      return () => cancelAnimationFrame(raf);
    }
    const el = ref.current;
    if (!el) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, hasAnimated];
}
