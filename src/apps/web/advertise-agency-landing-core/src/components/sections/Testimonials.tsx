import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { TestimonialCard } from '@/components/ui/TestimonialCard';
import { TestimonialStrip } from '@/components/ui/TestimonialStrip';
import { content } from '@/lib/content';
import { testimonials } from '@/lib/testimonials';
import { cn } from '@/lib/utils';

export function Testimonials() {
  const [active, setActive] = useState(0);

  const prev = () => setActive((i) => (i === 0 ? testimonials.length - 1 : i - 1));
  const next = () => setActive((i) => (i === testimonials.length - 1 ? 0 : i + 1));

  const item = testimonials[active];

  return (
    <section id="testimonials" className="bg-muted py-24 md:py-32">
      <Container>
        <SectionHeader
          label={content.testimonials.label}
          title={content.testimonials.title}
          description={content.testimonials.description}
          className="mb-16"
        />

        {/* Carousel */}
        <div className="mx-auto max-w-3xl">
          <TestimonialCard testimonial={item} showQuoteIcon starSize={18} className="p-8 md:p-12" />

          {/* Controls */}
          <div className="mt-8 flex items-center justify-between">
            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Отзыв ${i + 1}`}
                  className={cn(
                    'h-2 rounded-full transition-all duration-300',
                    i === active ? 'w-6 bg-primary' : 'w-2 bg-border hover:bg-muted-foreground'
                  )}
                />
              ))}
            </div>

            {/* Arrows */}
            <div className="flex gap-2">
              <button
                onClick={prev}
                aria-label="Предыдущий отзыв"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={next}
                aria-label="Следующий отзыв"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        <TestimonialStrip active={active} onSelect={setActive} />
      </Container>
    </section>
  );
}
