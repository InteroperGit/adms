import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { CaseHero } from '@/components/portfolio/CaseHero';
import { CaseOverview } from '@/components/portfolio/CaseOverview';
import { CaseCTA } from '@/components/portfolio/CaseCTA';
import { BlockRenderer } from '@/components/portfolio/blocks/BlockRenderer';
import { portfolioCaseContent } from '@/types/portfolio/portfolioCaseContent';
import { portfolioCaseMap } from '@/types/portfolio/portfolioCases';

export function PortfolioCasePage() {
  const { slug } = useParams<{ slug: string }>();
  const data = slug ? portfolioCaseMap[slug] : undefined;

  useEffect(() => {
    if (data) {
      document.title = data.meta.title;
      const descEl = document.querySelector('meta[name="description"]');
      if (descEl) descEl.setAttribute('content', data.meta.description);
    }
  }, [data]);

  const pc = portfolioCaseContent;

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">{pc.notFound.title}</h1>
          <a href="/#portfolio" className="text-primary hover:underline">
            {pc.notFound.back}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-foreground">
      <div className="border-b border-border bg-muted/40">
        <Container>
          <a
            href="/#portfolio"
            className="inline-flex items-center gap-2 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft size={16} />
            {pc.backLabel}
          </a>
        </Container>
      </div>

      <CaseHero
        hero={data.hero}
        category={data.category}
        title={data.title}
        description={data.description}
      />

      <CaseOverview
        client={data.overview.client}
        category={data.category}
        year={data.overview.year}
        services={data.overview.services}
      />

      <Container>
        {data.content.map((block, i) => (
          <BlockRenderer
            key={i}
            block={block}
            caseGradient={data.hero.gradient}
            caseTitle={data.title}
          />
        ))}
      </Container>

      <CaseCTA />
    </div>
  );
}
