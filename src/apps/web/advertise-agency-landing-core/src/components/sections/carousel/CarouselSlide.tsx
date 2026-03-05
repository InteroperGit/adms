import { cn } from '@/lib/utils';
import { content } from '@/types/content';
import type { CarouselSlide as CarouselSlideType } from '@/types/carousel';

interface Props {
  slide: CarouselSlideType;
  isActive: boolean;
}

export function CarouselSlide({ slide, isActive }: Props) {
  return (
    <div
      aria-hidden={!isActive}
      className={cn(
        'absolute inset-0 transition-opacity duration-700',
        isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
    >
      {slide.image ? (
        <img src={slide.image} alt={slide.alt} className="h-full w-full object-cover" />
      ) : (
        <div className={cn('h-full w-full bg-gradient-to-br', slide.gradient)} />
      )}

      <div className="absolute inset-0 flex items-center justify-center px-6">
        <div className="max-w-3xl text-center text-foreground">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {content.carousel.label}
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
  );
}
