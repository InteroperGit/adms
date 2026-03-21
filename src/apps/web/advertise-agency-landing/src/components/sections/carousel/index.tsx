import { useState, useEffect, useCallback, useMemo } from 'react';
import { carouselSlides } from '@/types/sections/carousel/carousel';
import { carouselContent } from '@/types/sections/carousel/carouselContent';
import { useSwipe } from '@/hooks/useSwipe';
import { CarouselSlide } from './CarouselSlide';
import { CarouselControls } from './CarouselControls';

const INTERVAL_MS = 5000;

/**
 * @component
 * @description Full-bleed image carousel with auto-advance, pause on hover, and gesture controls
 * @returns {JSX.Element} 70vh carousel container with slides, controls, and touch/swipe support
 * @example <caption>Full-page carousel above hero</caption>
 * <Carousel />
 */
export function Carousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  const next = useCallback(() => setActive((i) => (i + 1) % carouselSlides.length), []);
  const prev = useCallback(
    () => setActive((i) => (i - 1 + carouselSlides.length) % carouselSlides.length),
    []
  );
  const { onTouchStart, onTouchEnd } = useSwipe(next, prev);

  useEffect(() => {
    if (paused || reducedMotion) {
      return;
    }
    const id = setInterval(next, INTERVAL_MS);
    return () => clearInterval(id);
  }, [paused, reducedMotion, next]);

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label={carouselContent.ariaLabel ?? 'Featured projects'}
      className="relative overflow-hidden"
      style={{ height: '70vh', minHeight: '480px' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {carouselSlides.map((slide, i) => (
        <CarouselSlide key={slide.id} slide={slide} isActive={i === active} index={i} />
      ))}

      <CarouselControls
        total={carouselSlides.length}
        current={active}
        onPrev={prev}
        onNext={next}
        onDot={setActive}
        prevLabel={carouselContent.prevLabel}
        nextLabel={carouselContent.nextLabel}
        slideLabel={carouselContent.slideLabel}
      />
    </section>
  );
}
