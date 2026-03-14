import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CarouselControlsProps {
  total: number;
  current: number;
  onPrev: () => void;
  onNext: () => void;
  onDot: (index: number) => void;
  prevLabel: string;
  nextLabel: string;
  slideLabel: string; // template: "{index}" replaced at runtime
}

const arrowClass = cn(
  'absolute top-1/2 z-10 -translate-y-1/2',
  'flex h-11 w-11 items-center justify-center',
  'rounded-full border border-border dark:border-white/30',
  'bg-white/70 text-foreground backdrop-blur-sm dark:bg-white/20 dark:text-white',
  'cursor-pointer transition-colors hover:bg-primary hover:text-primary-foreground hover:border-primary dark:hover:bg-primary dark:hover:text-primary-foreground dark:hover:border-primary'
);

/**
 * @component
 * @description Navigation controls for carousel including prev/next arrows, dot indicators, and slide counter
 * @param {CarouselControlsProps} props
 * @param {number} props.total - Total number of slides
 * @param {number} props.current - Current active slide index
 * @param {() => void} props.onPrev - Callback when previous button clicked
 * @param {() => void} props.onNext - Callback when next button clicked
 * @param {(index: number) => void} props.onDot - Callback when dot indicator clicked with target index
 * @param {string} props.prevLabel - Accessibility label for previous button
 * @param {string} props.nextLabel - Accessibility label for next button
 * @param {string} props.slideLabel - Template string with {index} placeholder for dot aria-labels
 * @returns {JSX.Element} Positioned arrows, dot indicators, and slide counter overlays
 * @example <caption>Carousel controls</caption>
 * <CarouselControls total={5} current={0} onPrev={prev} onNext={next} onDot={setSlide} prevLabel="Back" nextLabel="Next" slideLabel="Go to slide {index}" />
 */
export function CarouselControls({
  total,
  current,
  onPrev,
  onNext,
  onDot,
  prevLabel,
  nextLabel,
  slideLabel,
}: CarouselControlsProps) {
  return (
    <>
      <button
        onClick={onPrev}
        aria-label={prevLabel}
        className={cn(arrowClass, 'left-4 md:left-6', 'hidden sm:flex')}
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={onNext}
        aria-label={nextLabel}
        className={cn(arrowClass, 'right-4 md:right-6', 'hidden sm:flex')}
      >
        <ChevronRight size={20} />
      </button>

      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {Array.from({ length: total }, (_, i) => (
          <button
            key={i}
            onClick={() => onDot(i)}
            aria-label={slideLabel.replace('{index}', String(i + 1))}
            className={cn(
              'h-2 cursor-pointer rounded-full transition-all duration-300',
              i === current
                ? 'w-6 bg-foreground dark:bg-white'
                : 'w-2 bg-foreground/25 hover:bg-foreground/50 dark:bg-white/40 dark:hover:bg-white/65'
            )}
          />
        ))}
      </div>

      <div className="absolute bottom-6 right-6 z-10 text-sm font-medium text-muted-foreground dark:text-white/65">
        {current + 1} / {total}
      </div>
    </>
  );
}
