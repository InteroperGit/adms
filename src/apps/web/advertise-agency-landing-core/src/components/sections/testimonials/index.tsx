import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/ui/section/SectionHeader';
import { FadeInSection } from '@/components/ui/section/FadeInSection';
import { testimonialsSectionContent } from '@/types/sections/testimonials/testimonialsContent';
import { siteData } from '@/types/config/siteData';
import { YandexReviews } from './YandexReviews';
import { TestimonialsEmpty } from './TestimonialsEmpty';
import { useTheme } from '@/hooks/useTheme';

export function Testimonials() {
  const orgId = siteData.yandexMapsOrgId?.trim() || '';
  const { isDark } = useTheme();

  return (
    <FadeInSection id="testimonials" className="bg-background py-24 md:py-32">
      <Container>
        <SectionHeader
          label={testimonialsSectionContent.label}
          title={testimonialsSectionContent.title}
          description={testimonialsSectionContent.description}
          className="mb-16"
        />
        {orgId ? <YandexReviews orgId={orgId} isDark={isDark} /> : <TestimonialsEmpty />}
      </Container>
    </FadeInSection>
  );
}
