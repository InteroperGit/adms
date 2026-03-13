import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/ui/section/SectionHeader';
import { testimonialsSectionContent } from '@/types/sections/testimonialsContent';
import { siteData } from '@/types/config/siteData';
import { cn } from '@/lib/utils';
import { useFadeIn } from '@/hooks/useFadeIn';
import { YandexReviews } from './YandexReviews';
import { TestimonialsEmpty } from './TestimonialsEmpty';
import { useTheme } from '@/hooks/useTheme';

export function Testimonials() {
  const orgId = siteData.yandexMapsOrgId?.trim() || '';
  const { ref, isVisible } = useFadeIn();
  const { isDark } = useTheme();

  return (
    <section ref={ref} id="testimonials" className="bg-background py-24 md:py-32">
      <div className={cn('fade-in-section', isVisible && 'is-visible')}>
        <Container>
          <SectionHeader
            label={testimonialsSectionContent.label}
            title={testimonialsSectionContent.title}
            description={testimonialsSectionContent.description}
            className="mb-16"
          />
          {orgId ? <YandexReviews orgId={orgId} isDark={isDark} /> : <TestimonialsEmpty />}
        </Container>
      </div>
    </section>
  );
}
