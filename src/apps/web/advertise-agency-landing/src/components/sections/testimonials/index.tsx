import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/ui/section/SectionHeader';
import { FadeInSection } from '@/components/ui/section/FadeInSection';
import { testimonialsSectionContent } from '@/types/sections/testimonials/testimonialsContent';
import { siteData } from '@/types/config/siteData';
import { YandexReviews } from './YandexReviews';
import { TestimonialsEmpty } from './TestimonialsEmpty';
import { useTheme } from '@/hooks/useTheme';

const orgId = siteData.yandexMapsOrgId?.trim() || '';

/**
 * @component
 * @description Testimonials section displaying Yandex Maps reviews iframe if organization ID is configured, otherwise shows empty state. Theme-aware for dark mode.
 * @returns {JSX.Element} Full-width section with header and reviews iframe or empty state
 * @example <caption>Testimonials section on home page</caption>
 * <Testimonials />
 */
export function Testimonials() {
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
        {orgId ? (
          <YandexReviews
            orgId={orgId}
            title={testimonialsSectionContent.reviewsTitle}
            isDark={isDark}
          />
        ) : (
          <TestimonialsEmpty />
        )}
      </Container>
    </FadeInSection>
  );
}
