import { cn } from '@/libs/utils';
import { carouselContent } from '@/types/sections/carousel/carouselContent';
import type { CarouselSlide as CarouselSlideType } from '@/types/sections/carousel/carousel';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

interface CarouselSlideProps {
  slide: CarouselSlideType;
  isActive: boolean;
  index: number;
}

/**
 * @component
 * @description Individual carousel slide with image or gradient background and centered text content
 * @param {CarouselSlideProps} props
 * @param {CarouselSlideType} props.slide - Slide data with title, subtitle, optional image and gradient
 * @param {boolean} props.isActive - Whether this slide is currently visible
 * @param {number} props.index - Zero-based slide index; used for prioritizing first image load
 * @returns {JSX.Element} Absolutely positioned slide with crossfade transition and dark overlay
 * @example <caption>Single carousel slide</caption>
 * <CarouselSlide slide={slides[0]} isActive={currentIndex === 0} index={0} />
 */
export function CarouselSlide({ slide, isActive, index }: CarouselSlideProps) {
  return (
    <div
      aria-hidden={!isActive}
      className={cn(
        'absolute inset-0 transition-opacity duration-700',
        isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
    >
      {slide.image ? (
        <>
          <OptimizedImage
            src={slide.image}
            alt={slide.alt}
            sizes="100vw"
            priority={index === 0}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 dark:bg-black/45" />
        </>
      ) : (
        <>
          <div className={cn('h-full w-full bg-linear-to-br', slide.gradient)} />
          <div className="absolute inset-0 dark:bg-black/35" />
        </>
      )}

      <div className="absolute inset-0 flex items-center justify-center px-6">
        <div className="max-w-3xl text-center text-foreground dark:text-white">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground dark:text-white/65">
            {carouselContent.label}
          </p>
          <h2
            style={{ fontFamily: 'var(--font-heading)' }}
            className="mb-4 text-3xl font-bold leading-tight md:text-5xl lg:text-6xl"
          >
            {slide.title}
          </h2>
          <p className="text-base text-muted-foreground dark:text-white/80 md:text-lg">
            {slide.subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}
