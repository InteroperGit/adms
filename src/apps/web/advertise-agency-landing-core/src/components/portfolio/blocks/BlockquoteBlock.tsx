import { TestimonialCard } from '@/components/ui/TestimonialCard';
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
        <TestimonialCard testimonial={testimonial} showQuoteIcon className="p-8" />
      </div>
    );
  }

  // Variant B — inline quote with attribution
  return (
    <blockquote className="mx-auto max-w-3xl border-l-4 border-primary py-2 pl-6">
      <p className="text-lg italic leading-relaxed text-foreground">«{block.text}»</p>
      <footer className="mt-4 text-sm text-muted-foreground">
        <cite className="not-italic">
          <span className="font-semibold text-foreground">— {block.author}</span>
          {block.role && <span>, {block.role}</span>}
          {block.company && <span> · {block.company}</span>}
        </cite>
      </footer>
    </blockquote>
  );
}
