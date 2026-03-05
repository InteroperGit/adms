import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { content } from '@/types/content';
import { siteData } from '@/types/siteData';
import { YandexReviews } from './YandexReviews';
import { TestimonialsEmpty } from './TestimonialsEmpty';

export function Testimonials() {
  const orgId = siteData.yandexMapsOrgId?.trim() || '';

  return (
    <section id="testimonials" className="bg-muted py-24 md:py-32">
      <Container>
        <SectionHeader
          label={content.testimonials.label}
          title={content.testimonials.title}
          description={content.testimonials.description}
          className="mb-16"
        />
        {orgId ? <YandexReviews orgId={orgId} /> : <TestimonialsEmpty />}
      </Container>
    </section>
  );
}
