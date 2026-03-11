import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { servicesSectionContent } from '@/types/sections/servicesContent';
import { services } from '@/types/sections/services';
import { cn } from '@/lib/utils';
import { useFadeIn } from '@/hooks/useFadeIn';
import { ServiceCard } from './ServiceCard';

export function Services() {
  const s = servicesSectionContent;
  const { ref, isVisible } = useFadeIn();

  return (
    <section ref={ref} id="services" className="bg-muted py-24 md:py-32">
      <div className={cn('fade-in-section', isVisible && 'is-visible')}>
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
      </div>
    </section>
  );
}
