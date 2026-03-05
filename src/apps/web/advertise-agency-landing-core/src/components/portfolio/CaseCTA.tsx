// src/components/portfolio/CaseCTA.tsx
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout/Container';
import { content } from '@/lib/content';

export function CaseCTA() {
  const { cta } = content.portfolioCase;

  return (
    <section className="py-20">
      <Container>
        <div className="mx-auto max-w-xl text-center">
          <h2 className="mb-4 text-2xl font-bold md:text-3xl">{cta.title}</h2>
          <p className="mb-8 text-muted-foreground">{cta.subtitle}</p>
          <Button asChild size="lg" className="rounded-full px-8">
            <a href="/#contact">{cta.label}</a>
          </Button>
        </div>
      </Container>
    </section>
  );
}
