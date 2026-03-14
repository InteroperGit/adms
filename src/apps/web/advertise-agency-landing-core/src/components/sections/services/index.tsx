import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/ui/section/SectionHeader';
import { FadeInSection } from '@/components/ui/section/FadeInSection';
import { servicesSectionContent } from '@/types/sections/services/servicesContent';
import { services } from '@/types/sections/services/services';
import { ServiceCard } from './ServiceCard';

/**
 * @component
 * @description Services section displaying all agency services in a responsive grid of cards with icons, titles, and descriptions. Full-width section with fade-in animation.
 * @returns {JSX.Element} Full-width section with header and service cards grid
 * @example <caption>Services section on home page</caption>
 * <Services />
 */
export function Services() {
  const s = servicesSectionContent;

  return (
    <FadeInSection id="services" className="bg-muted py-24 md:py-32">
      <Container>
        <SectionHeader
          label={s.label}
          title={s.title}
          description={s.description}
          className="mb-16"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.title} service={service} />
          ))}
        </div>
      </Container>
    </FadeInSection>
  );
}
