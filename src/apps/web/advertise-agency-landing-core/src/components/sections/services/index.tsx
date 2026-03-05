import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { content } from '@/lib/content';
import { services } from '@/lib/services';
import { ServiceCard } from './ServiceCard';

export function Services() {
  const { services: s } = content;

  return (
    <section id="services" className="bg-muted py-24 md:py-32">
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
    </section>
  );
}
