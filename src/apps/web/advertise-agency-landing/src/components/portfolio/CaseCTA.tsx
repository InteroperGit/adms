// src/components/portfolio/CaseCTA.tsx
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout/Container';
import { portfolioCaseContent } from '@/types/portfolio/portfolioCaseContent';

/**
 * Call-to-action section rendered at the bottom of every portfolio case detail page.
 *
 * All copy and the button link target are data-driven via `portfolioCaseContent.cta`
 * (`data/sections/portfolio/portfolioCase.json`), so white-label clients configure
 * them without touching component code.
 *
 * @returns Centred section with a heading, subtitle, and a primary pill button.
 *
 * @example
 * // Placed at the end of PortfolioCasePage after the content blocks:
 * <CaseCTA />
 */
export function CaseCTA() {
  const { cta } = portfolioCaseContent;

  return (
    <section className="py-20">
      <Container>
        <div className="mx-auto max-w-xl text-center">
          <h2 className="mb-4 text-2xl font-bold md:text-3xl">{cta.title}</h2>
          <p className="mb-8 text-muted-foreground">{cta.subtitle}</p>
          <Button asChild size="lg" className="rounded-full px-8">
            <a href={cta.href}>{cta.label}</a>
          </Button>
        </div>
      </Container>
    </section>
  );
}
