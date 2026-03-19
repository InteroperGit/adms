import { TestimonialCard } from '@/components/ui/testimonial/TestimonialCard';
import { testimonials } from '@/types/sections/testimonials/testimonials';
import type { BlockquoteBlock as BlockquoteBlockData } from '@/types/blocks';

interface BlockquoteBlockProps {
  block: BlockquoteBlockData;
}

/**
 * @component
 * @description Renders testimonial via ID reference or inline quote with attribution and role info
 * @param {BlockquoteBlockProps} props
 * @param {BlockquoteBlockData} props.block - Blockquote data with either testimonialId or inline quote fields
 * @returns {JSX.Element|null} TestimonialCard or blockquote element
 * @example
 * <BlockquoteBlock block={{ testimonialId: "testimonial-1" }} />
 */
export function BlockquoteBlock({ block }: BlockquoteBlockProps) {
  // Variant A — reference existing testimonial by ID
  if ('testimonialId' in block) {
    const testimonial = testimonials.find((t) => t.id === block.testimonialId);
    if (!testimonial) {
      if (import.meta.env.DEV) {
        console.warn(`[BlockquoteBlock] Testimonial not found: ${block.testimonialId}`);
      }
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
    <blockquote className="relative mx-auto max-w-3xl overflow-hidden rounded-2xl border border-border/50 bg-card px-8 py-8 shadow-sm">
      <div
        className="pointer-events-none absolute -left-2 -top-4 select-none font-heading text-8xl font-bold leading-none text-primary/10"
        aria-hidden="true"
      >
        &ldquo;
      </div>
      <p className="relative text-xl font-heading italic leading-relaxed text-foreground">
        «{block.text}»
      </p>
      <footer className="mt-6 flex items-center gap-3 border-t border-border/50 pt-4 text-sm text-muted-foreground">
        {block.author && (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
            {block.author[0]}
          </div>
        )}
        <cite className="not-italic">
          <span className="font-semibold text-foreground">— {block.author}</span>
          {block.role && <span>, {block.role}</span>}
          {block.company && <span> · {block.company}</span>}
        </cite>
      </footer>
    </blockquote>
  );
}
