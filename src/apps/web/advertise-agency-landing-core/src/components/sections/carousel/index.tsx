import { useState, useEffect, useCallback } from 'react';
import { carouselSlides } from '@/types/sections/carousel';
import { carouselContent } from '@/types/sections/carouselContent';
import { useSwipe } from '@/hooks/useSwipe';
import { CarouselSlide } from './CarouselSlide';
import { CarouselControls } from './CarouselControls';

const INTERVAL_MS = 5000;

export function Carousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
    <div
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
    </div>
  );
}
