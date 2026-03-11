import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  total: number;
  current: number;
  onPrev: () => void;
  onNext: () => void;
  onDot: (index: number) => void;
}

const arrowClass = cn(
  'absolute top-1/2 z-10 -translate-y-1/2',
  'flex h-11 w-11 items-center justify-center',
  'rounded-full border border-border',
  'bg-white/70 text-foreground backdrop-blur-sm',
  'transition-colors hover:bg-white'
);

export function CarouselControls({ total, current, onPrev, onNext, onDot }: Props) {
  return (
    <>
      <button
        onClick={onPrev}
        aria-label="Предыдущий слайд"
        className={cn(arrowClass, 'left-4 md:left-6', 'hidden sm:flex')}
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={onNext}
        aria-label="Следующий слайд"
        className={cn(arrowClass, 'right-4 md:right-6', 'hidden sm:flex')}
      >
        <ChevronRight size={20} />
      </button>

      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {Array.from({ length: total }, (_, i) => (
          <button
            key={i}
            onClick={() => onDot(i)}
            aria-label={`Слайд ${i + 1}`}
            className={cn(
              'h-2 rounded-full transition-all duration-300',
              i === current ? 'w-6 bg-foreground' : 'w-2 bg-foreground/25 hover:bg-foreground/50'
            )}
          />
        ))}
      </div>

      <div className="absolute bottom-6 right-6 z-10 text-sm font-medium text-muted-foreground">
        {current + 1} / {total}
      </div>
    </>
  );
}
