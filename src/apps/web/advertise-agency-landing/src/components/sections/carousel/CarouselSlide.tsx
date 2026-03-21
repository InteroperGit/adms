import { cn } from '@/libs/utils';
import { carouselContent } from '@/types/sections/carousel/carouselContent';
import type { CarouselSlide as CarouselSlideType } from '@/types/sections/carousel/carousel';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

interface CarouselSlideProps {
  slide: CarouselSlideType;
  isActive: boolean;
  index: number;
}

type TransitionEffect = 'zoom-fade' | 'slide-right' | 'rotate-fade' | 'blur-fade';

const TRANSITION_EFFECTS: TransitionEffect[] = [
  'zoom-fade',
  'slide-right',
  'rotate-fade',
  'blur-fade',
];

/**
 * Get deterministic transition effect based on slide index
 * Ensures same slide always has same effect across renders
 */
function getTransitionEffect(index: number): TransitionEffect {
  return TRANSITION_EFFECTS[index % TRANSITION_EFFECTS.length];
}

/**
 * Get transition classes based on effect type
 */
function getTransitionClasses(effect: TransitionEffect, isActive: boolean): string {
  const baseClasses =
    'absolute inset-0 transition-[opacity,transform,filter] duration-700 ease-out';

  if (!isActive) {
    switch (effect) {
      case 'zoom-fade':
        return cn(baseClasses, 'opacity-0 scale-105 pointer-events-none');
      case 'slide-right':
        return cn(baseClasses, 'opacity-0 -translate-x-12 pointer-events-none');
      case 'rotate-fade':
        return cn(baseClasses, 'opacity-0 rotate-3 scale-95 pointer-events-none');
      case 'blur-fade':
        return cn(baseClasses, 'opacity-0 pointer-events-none');
    }
  }

  return cn(baseClasses, 'opacity-100 scale-100 translate-x-0 rotate-0');
}

/**
 * @component
 * @description Individual carousel slide with image or gradient background and centered text content
 * @param {CarouselSlideProps} props
 * @param {CarouselSlideType} props.slide - Slide data with title, subtitle, optional image and gradient
 * @param {boolean} props.isActive - Whether this slide is currently visible
 * @param {number} props.index - Zero-based slide index; used for prioritizing first image load and transition effect
 * @returns {JSX.Element} Absolutely positioned slide with random transition effect and dark overlay
 * @example <caption>Single carousel slide</caption>
 * <CarouselSlide slide={slides[0]} isActive={currentIndex === 0} index={0} />
 */
export function CarouselSlide({ slide, isActive, index }: CarouselSlideProps) {
  const effect = getTransitionEffect(index);

  return (
    <div aria-hidden={!isActive} className={getTransitionClasses(effect, isActive)}>
      {slide.image ? (
        <>
          <div className={cn('h-full w-full overflow-hidden', isActive && 'animate-ken-burns')}>
            <OptimizedImage
              src={slide.image}
              alt={slide.alt}
              sizes="100vw"
              priority={index === 0}
              className="h-full w-full"
              imgClassName="object-cover"
            />
          </div>
          <div className="absolute inset-0 dark:bg-black/45" />
        </>
      ) : (
        <>
          <div className={cn('h-full w-full bg-linear-to-br', slide.gradient)} />
          <div className="absolute inset-0 dark:bg-black/35" />
        </>
      )}

      <div className="absolute inset-0 flex items-center justify-center px-6">
        <div
          className="max-w-3xl text-center text-foreground dark:text-white"
          aria-live={isActive ? 'polite' : 'off'}
          aria-atomic="true"
        >
          <p
            className={cn(
              'mb-3 text-sm font-semibold uppercase tracking-[0.2em]',
              'text-muted-foreground dark:text-white/65'
            )}
          >
            {carouselContent.label}
          </p>
          <h2
            className={cn(
              'font-heading mb-4 text-3xl font-bold leading-tight',
              'md:text-5xl lg:text-6xl'
            )}
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
