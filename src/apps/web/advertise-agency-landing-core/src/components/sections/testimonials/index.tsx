import { useState } from 'react';
import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { TestimonialCard } from '@/components/ui/TestimonialCard';
import { TestimonialStrip } from '@/components/ui/TestimonialStrip';
import { content } from '@/lib/content';
import { testimonials } from '@/lib/testimonials';
import { TestimonialNav } from './TestimonialNav';

export function Testimonials() {
  const [active, setActive] = useState(0);

  const prev = () => setActive((i) => (i === 0 ? testimonials.length - 1 : i - 1));
  const next = () => setActive((i) => (i === testimonials.length - 1 ? 0 : i + 1));

  return (
    <section id="testimonials" className="bg-muted py-24 md:py-32">
      <Container>
        <SectionHeader
          label={content.testimonials.label}
          title={content.testimonials.title}
          description={content.testimonials.description}
          className="mb-16"
        />
        <div className="mx-auto max-w-3xl">
          <TestimonialCard
            testimonial={testimonials[active]}
            showQuoteIcon
            starSize={18}
            className="p-8 md:p-12"
          />
          <TestimonialNav active={active} onPrev={prev} onNext={next} onDot={setActive} />
        </div>
        <TestimonialStrip active={active} onSelect={setActive} />
      </Container>
    </section>
  );
}
