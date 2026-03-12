import { ChevronLeft, ChevronRight } from 'lucide-react';
import { testimonials } from '@/types/sections/testimonials';
import { cn } from '@/lib/utils';

interface TestimonialNavProps {
  active: number;
  onPrev: () => void;
  onNext: () => void;
  onDot: (i: number) => void;
}

export function TestimonialNav({ active, onPrev, onNext, onDot }: TestimonialNavProps) {
  return (
    <div className="mt-8 flex items-center justify-between">
      <div className="flex gap-2">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => onDot(i)}
            aria-label={`Отзыв ${i + 1}`}
            className={cn(
              'h-2 rounded-full transition-all duration-300',
              i === active ? 'w-6 bg-primary' : 'w-2 bg-border hover:bg-muted-foreground'
            )}
          />
        ))}
      </div>
      <div className="flex gap-2">
        <button
          onClick={onPrev}
          aria-label="Предыдущий отзыв"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={onNext}
          aria-label="Следующий отзыв"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
