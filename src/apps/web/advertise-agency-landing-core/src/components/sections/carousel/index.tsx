import { useState, useEffect, useCallback } from 'react';
import { carouselSlides } from '@/lib/carousel';
import { CarouselSlide } from './CarouselSlide';
import { CarouselControls } from './CarouselControls';

const INTERVAL_MS = 5000;

export function Carousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setActive((i) => (i + 1) % carouselSlides.length), []);
  const prev = () => setActive((i) => (i - 1 + carouselSlides.length) % carouselSlides.length);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, INTERVAL_MS);
    return () => clearInterval(id);
  }, [paused, next]);

  return (
    <div
      className="relative overflow-hidden"
      style={{ height: '70vh', minHeight: '480px' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {carouselSlides.map((slide, i) => (
        <CarouselSlide key={slide.id} slide={slide} isActive={i === active} />
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
