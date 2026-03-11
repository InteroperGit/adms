import { cn } from '@/lib/utils';
import { carouselContent } from '@/types/sections/carouselContent';
import type { CarouselSlide as CarouselSlideType } from '@/types/sections/carousel';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

interface Props {
  slide: CarouselSlideType;
  isActive: boolean;
  index: number;
}

export function CarouselSlide({ slide, isActive, index }: Props) {
  return (
    <div
      aria-hidden={!isActive}
      className={cn(
        'absolute inset-0 transition-opacity duration-700',
        isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
    >
      {slide.image ? (
        <OptimizedImage
          src={slide.image}
          alt={slide.alt}
          sizes="100vw"
          priority={index === 0}
          className="h-full w-full object-cover"
          dev={import.meta.env.DEV}
        />
      ) : (
        <div className={cn('h-full w-full bg-gradient-to-br', slide.gradient)} />
      )}

      <div className="absolute inset-0 flex items-center justify-center px-6">
        <div className="max-w-3xl text-center text-foreground">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {carouselContent.label}
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
