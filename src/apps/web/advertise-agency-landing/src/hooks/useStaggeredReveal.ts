import { useEffect, useRef, useState } from 'react';

/**
 * @description Triggers staggered fade-in animations on grid items when the container
 * enters the viewport. Each item animates in sequence with a 60ms delay between items.
 * Respects user's prefers-reduced-motion setting by immediately revealing all items.
 *
 * @param {IntersectionObserverInit} [options] - Optional IntersectionObserver configuration
 * @returns {object} Object with container ref, visibility state, and delay calculation function
 *   - ref: React ref to attach to the grid container
 *   - isVisible: Boolean flag, true when container enters viewport
 *   - getDelay: Function to get the animation-delay (in ms) for a given item index
 *
 * @example
 * function ServiceGrid() {
 *   const items = [...];
 *   const { ref, isVisible, getDelay } = useStaggeredReveal();
 *
 *   return (
 *     <div ref={ref} className={isVisible ? 'stagger-visible' : ''}>
 *       {items.map((item, idx) => (
 *         <div
 *           key={idx}
 *           className="stagger-item"
 *           style={{ animationDelay: `${getDelay(idx)}ms` }}
 *         >
 *           {item}
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 */
export function useStaggeredReveal(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setPrefersReducedMotion(prefersReduced);

    if (prefersReduced) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDelay = (index: number): number => {
    if (prefersReducedMotion) {
      return 0;
    }
    return index * 60;
  };

  return { ref, isVisible, getDelay };
}
