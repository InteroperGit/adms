import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { testimonialsSectionContent } from '@/types/testimonialsContent';
import { siteData } from '@/types/siteData';
import { YandexReviews } from './YandexReviews';
import { TestimonialsEmpty } from './TestimonialsEmpty';

export function Testimonials() {
  const orgId = siteData.yandexMapsOrgId?.trim() || '';

  return (
    <section id="testimonials" className="bg-muted py-24 md:py-32">
      <Container>
        <SectionHeader
          label={testimonialsSectionContent.label}
          title={testimonialsSectionContent.title}
          description={testimonialsSectionContent.description}
          className="mb-16"
        />
        {orgId ? <YandexReviews orgId={orgId} /> : <TestimonialsEmpty />}
      </Container>
    </section>
  );
}
