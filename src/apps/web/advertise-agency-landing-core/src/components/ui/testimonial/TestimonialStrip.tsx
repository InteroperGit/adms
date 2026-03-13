// src/components/ui/TestimonialStrip.tsx
import { StarRating } from '@/components/ui/testimonial/StarRating';
import { testimonials } from '@/types/sections/testimonials';
import { cn } from '@/lib/utils';

interface TestimonialStripProps {
  active: number;
  onSelect: (index: number) => void;
}

export function TestimonialStrip({ active, onSelect }: TestimonialStripProps) {
  return (
    <div className="mt-12 hidden gap-4 lg:grid lg:grid-cols-5">
      {testimonials.map((t, i) => (
        <button
          key={t.id}
          onClick={() => onSelect(i)}
          className={cn(
            'rounded-xl border p-4 text-left transition-all duration-200',
            i === active
              ? 'border-primary/30 bg-card shadow-sm'
              : 'border-border bg-card/50 hover:border-primary/20 hover:bg-card'
          )}
        >
          <StarRating rating={t.rating} size={10} className="mb-2 gap-0.5" />
          <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">«{t.text}»</p>
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[10px] font-bold text-white',
                t.avatarColor
              )}
            >
              {t.avatar}
            </div>
            <span className="truncate text-xs font-medium text-foreground">{t.name}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
