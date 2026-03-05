import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { content } from '@/lib/content';
import { ICON_MAP } from '@/lib/iconMap';
import { services } from '@/lib/services';

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

        {/* Cards grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = ICON_MAP[service.icon];
            return (
              <Card
                key={service.title}
                className="group border-border bg-white transition-shadow duration-300 hover:shadow-md"
              >
                <CardHeader className="pb-3">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                    <Icon size={22} />
                  </div>
                  <CardTitle className="text-lg font-semibold text-foreground">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
