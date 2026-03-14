// src/components/ui/StarRating.tsx
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  size?: number;
  className?: string;
  starClassName?: string;
}

/**
 * @component
 * @description Displays filled star rating visualization (typically 1-5 stars)
 * @param {StarRatingProps} props
 * @param {number} props.rating - Number of stars to display (typically 1-5)
 * @param {number} [props.size=16] - Star size in pixels
 * @param {string} [props.className] - Container flex classes
 * @param {string} [props.starClassName] - Additional star icon classes
 * @returns {JSX.Element} Flex row of filled Star icons
 * @example
 * <StarRating rating={5} size={20} />
 */
export function StarRating({ rating, size = 16, className, starClassName }: StarRatingProps) {
  return (
    <div className={cn('flex gap-1', className)}>
      {Array.from({ length: rating }).map((_, i) => (
        <Star key={i} size={size} className={cn('fill-primary text-primary', starClassName)} />
      ))}
    </div>
  );
}
