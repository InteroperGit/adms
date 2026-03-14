import { useEffect, useRef, useState } from 'react';

/**
 * @description Triggers a fade-in animation when an element enters the viewport using
 * IntersectionObserver. Respects user's prefers-reduced-motion setting by immediately
 * revealing content if animations are disabled. Returns a ref to attach to the element
 * and an isVisible flag to drive CSS animations or conditional rendering.
 *
 * @param {IntersectionObserverInit} [options] - Optional IntersectionObserver configuration
 *   (threshold, rootMargin, root). Default threshold is 0.08 (8% visible).
 * @returns {object} Object with element ref and visibility state
 *   - ref: React ref to attach to the element that should fade in
 *   - isVisible: Boolean flag, true when element enters viewport or animations disabled
 *
 * @example
 * function CaseCard() {
 *   const { ref, isVisible } = useFadeIn({ threshold: 0.3 });
 *
 *   return (
 *     <div
 *       ref={ref}
 *       className={`transition-opacity duration-700 ${
 *         isVisible ? 'opacity-100' : 'opacity-0'
 *       }`}
 *     >
 *       Case content...
 *     </div>
 *   );
 * }
 */
export function useFadeIn(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const raf = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(raf);
    }

    const el = ref.current;
    if (!el) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, ...options }
    );

    observer.observe(el);
    return () => observer.disconnect();
    // options is typically a static object literal — omitting from deps is intentional
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, isVisible };
}
