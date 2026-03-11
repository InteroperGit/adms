import { useState, useEffect, useCallback, useRef } from 'react';
import { carouselSlides } from '@/types/sections/carousel';
import { CarouselSlide } from './CarouselSlide';
import { CarouselControls } from './CarouselControls';

const INTERVAL_MS = 5000;
const SWIPE_THRESHOLD = 50;

export function Carousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const reducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const next = useCallback(() => setActive((i) => (i + 1) % carouselSlides.length), []);
  const prev = useCallback(
    () => setActive((i) => (i - 1 + carouselSlides.length) % carouselSlides.length),
    []
  );

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
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) {
          return;
        }
        const delta = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(delta) >= SWIPE_THRESHOLD) {
          if (delta > 0) {
            next();
          } else {
            prev();
          }
        }
        touchStartX.current = null;
      }}
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
      />
    </div>
  );
}
