// components/ScrollToTop.tsx
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScrollToTopProps {
  threshold?: number; // px от верха, после которых кнопка появляется
  navSelector?: string; // CSS-селектор навигации для скролла
}

/**
 * @component
 * @description Fixed floating button that appears when scrolled below threshold and returns to top/nav with smooth scroll
 * @param {ScrollToTopProps} props
 * @param {number} [props.threshold=300] - Scroll distance in pixels before button appears
 * @param {string} [props.navSelector='nav'] - CSS selector for nav element to scroll to
 * @returns {JSX.Element|null} Button when visible, null when hidden
 * @example
 * <ScrollToTop threshold={300} navSelector="nav" />
 */
export function ScrollToTop({ threshold = 300, navSelector = 'nav' }: ScrollToTopProps) {
  const [visible, setVisible] = useState(
    () => typeof window !== 'undefined' && window.scrollY > threshold
  );

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > threshold);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  const handleClick = () => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const behavior: ScrollBehavior = reducedMotion ? 'instant' : 'smooth';
    const nav = navSelector ? document.querySelector(navSelector) : null;

    if (nav) {
      nav.scrollIntoView({ behavior, block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior });
    }
  };

  if (!visible) {
    return null;
  }

  return (
    <Button
      size="icon"
      onClick={handleClick}
      aria-label="Прокрутить к навигации"
      className={cn(
        'fixed bottom-6 right-6 z-50',
        'cursor-pointer rounded-full shadow-lg',
        'animate-fade-in'
      )}
    >
      <ChevronUp className="h-5 w-5" />
    </Button>
  );
}
