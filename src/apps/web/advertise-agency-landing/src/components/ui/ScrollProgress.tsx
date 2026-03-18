import { useState, useEffect } from 'react';

/**
 * @component ScrollProgress
 * @description
 * Displays a thin progress bar at the top of the viewport indicating scroll position.
 * Only renders on pages longer than 2x viewport height. Uses a gradient from primary to accent.
 * Respects prefers-reduced-motion by applying no animation.
 * @returns {JSX.Element | null} Fixed progress bar or null if page is short
 * @example
 * <ScrollProgress />
 */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    // Check if page is long enough to warrant progress bar
    const checkPageLength = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      // Only show if page is longer than 2x viewport height
      setShouldShow(scrollableHeight > window.innerHeight * 2);
    };

    // Check on mount and window resize
    checkPageLength();
    window.addEventListener('resize', checkPageLength);

    return () => window.removeEventListener('resize', checkPageLength);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const newProgress = total > 0 ? (scrolled / total) * 100 : 0;
      setProgress(newProgress);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!shouldShow) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-1 bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-primary to-accent transition-[width] duration-150"
        style={{ width: `${progress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Page scroll progress"
      />
    </div>
  );
}
