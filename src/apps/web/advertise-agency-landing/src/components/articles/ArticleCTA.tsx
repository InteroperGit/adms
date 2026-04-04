// src/components/articles/ArticleCTA.tsx
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout/Container';

interface ArticleCTAProps {
  title: string;
  subtitle: string;
  label: string;
  href: string;
}

/**
 * Article-level CTA — data is passed from parent (ArticlePage),
 * sourced from the article JSON or a site-wide fallback config.
 *
 * @remarks Previously imported `portfolioCaseContent` directly — no longer.
 */
export function ArticleCTA({ title, subtitle, label, href }: ArticleCTAProps) {
  return (
    <section className="py-20">
      <Container>
        <div className="mx-auto max-w-xl text-center">
          <h2 className="mb-4 text-2xl font-bold md:text-3xl">{title}</h2>
          <p className="mb-8 text-muted-foreground">{subtitle}</p>
          <Button asChild size="lg" className="rounded-full px-8">
            <a href={href}>{label}</a>
          </Button>
        </div>
      </Container>
    </section>
  );
}
