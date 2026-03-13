import { TestimonialCard } from '@/components/ui/testimonial/TestimonialCard';
import { testimonials } from '@/types/sections/testimonials';
import type { BlockquoteBlock as BlockquoteBlockData } from '@/types/portfolio/blocks';

interface BlockquoteBlockProps {
  block: BlockquoteBlockData;
}

export function BlockquoteBlock({ block }: BlockquoteBlockProps) {
  // Variant A — reference existing testimonial by ID
  if ('testimonialId' in block) {
    const testimonial = testimonials.find((t) => t.id === block.testimonialId);
    if (!testimonial) {
      return null;
    }
    return (
      <div className="mx-auto max-w-2xl">
        <TestimonialCard
          testimonial={testimonial}
          showQuoteIcon
          className="p-8 dark:bg-neutral-900"
        />
      </div>
    );
  }

  // Variant B — inline quote with attribution
  return (
    <blockquote className="mx-auto max-w-3xl rounded-r-lg border-l-4 border-primary bg-muted/30 py-4 pl-6 pr-4 dark:bg-neutral-900">
      <p className="text-lg italic leading-relaxed text-foreground dark:text-white">
        «{block.text}»
      </p>
      <footer className="mt-4 text-sm text-muted-foreground dark:text-neutral-300">
        <cite className="not-italic">
          <span className="font-semibold text-foreground dark:text-white">— {block.author}</span>
          {block.role && <span>, {block.role}</span>}
          {block.company && <span> · {block.company}</span>}
        </cite>
      </footer>
    </blockquote>
  );
}
