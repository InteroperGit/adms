import { useEffect } from 'react';
import { useLocation } from 'react-router';

/**
 * @hook
 * @description Resets page scroll to top on route navigation (unless hash navigation)
 * @returns {void}
 * @example
 * useScrollReset(); // Call once in root layout component
 */
export function useScrollReset(): void {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);
}
