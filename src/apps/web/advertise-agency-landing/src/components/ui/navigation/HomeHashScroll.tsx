import { useEffect } from 'react';
import { useLocation } from 'react-router';

/**
 * @component
 * @description Effect hook that smoothly scrolls to elements by hash anchor on home page load
 * @returns {null} Invisible effect component
 * @example
 * <HomeHashScroll />
 */
export function HomeHashScroll() {
  const location = useLocation();

  useEffect(() => {
    const { hash, pathname } = location;
    if (pathname !== '/' || !hash) {
      return;
    }
    const id = hash.slice(1);
    const timer = setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [location]);

  return null;
}
