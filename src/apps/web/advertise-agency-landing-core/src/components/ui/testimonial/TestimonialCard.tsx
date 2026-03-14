// src/components/ui/TestimonialCard.tsx
import { Quote } from 'lucide-react';
import { StarRating } from '@/components/ui/testimonial/StarRating';
import { cn } from '@/libs/utils';
import type { Testimonial } from '@/types/sections/testimonials/testimonials';

interface TestimonialCardProps {
  testimonial: Testimonial;
  showQuoteIcon?: boolean;
  starSize?: number;
  starClassName?: string;
  className?: string;
}

/**
 * @component
 * @description Card displaying testimonial with rating stars, quote text, author avatar and attribution
 * @param {TestimonialCardProps} props
 * @param {Testimonial} props.testimonial - Testimonial data with text, rating, author info and avatar
 * @param {boolean} [props.showQuoteIcon=false] - Display large quote icon in corner
 * @param {number} [props.starSize=16] - Size of rating stars
 * @param {string} [props.starClassName] - Additional star styling classes
 * @param {string} [props.className] - Card container classes
 * @returns {JSX.Element} Blockquote card with stars, text, and author details
 * @example
 * <TestimonialCard testimonial={testimonialData} showQuoteIcon starSize={18} />
 */
export function TestimonialCard({
  testimonial,
  showQuoteIcon = false,
  starSize = 16,
  starClassName,
  className,
}: TestimonialCardProps) {
  return (
    <blockquote
      className={cn('relative rounded-2xl border border-border bg-card shadow-sm', className)}
    >
      {showQuoteIcon && (
        <div className="absolute right-6 top-6 text-primary/10 md:right-12 md:top-10">
          <Quote size={40} className="md:hidden" strokeWidth={1} />
          <Quote size={64} className="hidden md:block" strokeWidth={1} />
        </div>
      )}

      <StarRating
        rating={testimonial.rating}
        size={starSize}
        className="mb-6"
        starClassName={starClassName}
      />

      <p className="mb-6 text-lg leading-relaxed text-foreground">«{testimonial.text}»</p>

      <div className="flex items-center gap-4">
        <div
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white',
            testimonial.avatarColor
          )}
        >
          {testimonial.avatar}
        </div>
        <div>
          <p className="font-semibold text-foreground">{testimonial.name}</p>
          <p className="text-sm text-muted-foreground">
            {testimonial.role} · {testimonial.company}
          </p>
        </div>
      </div>
    </blockquote>
  );
}
