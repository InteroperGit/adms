import { useEffect, useRef, useState } from 'react';

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
