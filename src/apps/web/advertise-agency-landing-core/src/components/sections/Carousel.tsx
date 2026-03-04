import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { carouselSlides } from '@/lib/carousel';
import { cn } from '@/lib/utils';

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
      {/* Slides */}
      {carouselSlides.map((slide, i) => (
        <div
          key={slide.id}
          aria-hidden={i !== active}
          className={cn(
            'absolute inset-0 transition-opacity duration-700',
            i === active ? 'opacity-100' : 'opacity-0 pointer-events-none'
          )}
        >
          {/* Background: image or gradient fallback */}
          {slide.image ? (
            <img src={slide.image} alt={slide.alt} className="h-full w-full object-cover" />
          ) : (
            <div className={cn('h-full w-full bg-gradient-to-br', slide.gradient)} />
          )}

          {/* Slide content */}
          <div className="absolute inset-0 flex items-center justify-center px-6">
            <div className="max-w-3xl text-center text-foreground">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                РА «Рекламастер»
              </p>
              <h2
                style={{ fontFamily: 'var(--font-heading)' }}
                className="mb-4 text-3xl font-bold leading-tight md:text-5xl lg:text-6xl"
              >
                {slide.title}
              </h2>
              <p className="text-base text-muted-foreground md:text-lg">{slide.subtitle}</p>
            </div>
          </div>
        </div>
      ))}

      {/* Prev / Next arrows */}
      <button
        onClick={prev}
        aria-label="Предыдущий слайд"
        className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white/70 text-foreground backdrop-blur-sm transition-colors hover:bg-white md:left-6"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        aria-label="Следующий слайд"
        className="absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white/70 text-foreground backdrop-blur-sm transition-colors hover:bg-white md:right-6"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {carouselSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Слайд ${i + 1}`}
            className={cn(
              'h-2 rounded-full transition-all duration-300',
              i === active ? 'w-6 bg-foreground' : 'w-2 bg-foreground/25 hover:bg-foreground/50'
            )}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-6 right-6 z-10 text-sm font-medium text-muted-foreground">
        {active + 1} / {carouselSlides.length}
      </div>
    </div>
  );
}
