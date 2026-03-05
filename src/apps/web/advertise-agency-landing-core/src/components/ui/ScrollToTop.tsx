// components/ScrollToTop.tsx
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronUp } from 'lucide-react';

interface ScrollToTopProps {
  threshold?: number; // px от верха, после которых кнопка появляется
  navSelector?: string; // CSS-селектор навигации для скролла
  className?: string;
}

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
    const nav = navSelector ? document.querySelector(navSelector) : null;

    if (nav) {
      nav.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
      className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg animate-fade-in"
    >
      <ChevronUp className="h-5 w-5" />
    </Button>
  );
}
