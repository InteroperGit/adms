// src/components/ui/StarRating.tsx
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  size?: number;
  className?: string;
  starClassName?: string;
}

export function StarRating({ rating, size = 16, className, starClassName }: StarRatingProps) {
  return (
    <div className={cn('flex gap-1', className)}>
      {Array.from({ length: rating }).map((_, i) => (
        <Star key={i} size={size} className={cn('fill-primary text-primary', starClassName)} />
      ))}
    </div>
  );
}
