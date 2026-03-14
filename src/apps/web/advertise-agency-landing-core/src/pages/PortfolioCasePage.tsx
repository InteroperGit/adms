import { useParams } from 'react-router-dom';
import { Container } from '@/components/layout/Container';
import { CaseHero } from '@/components/portfolio/CaseHero';
import { CaseOverview } from '@/components/portfolio/CaseOverview';
import { CaseCTA } from '@/components/portfolio/CaseCTA';
import { BreadCrumbs } from '@/components/ui/navigation/BreadCrumbs';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { portfolioCaseContent } from '@/types/portfolio/portfolioCaseContent';
import { portfolioCaseMap } from '@/types/portfolio/portfolioCases';
import { portfolioPageContent } from '@/types/sections/portfolio/portfolioPage';
import { categories } from '@/types/config/categories';
import { portfolioConfig } from '@/types/config/portfolioConfig';
import { siteData } from '@/types/config/siteData';

export function PortfolioCasePage() {
  const { categorySlug, caseSlug } = useParams<{ categorySlug: string; caseSlug: string }>();
  const data = caseSlug ? portfolioCaseMap[caseSlug] : undefined;

  const pc = portfolioCaseContent;
  const portfolioTitle = portfolioPageContent.title;
  const isAll = categorySlug === 'all';
  const category = isAll ? null : categories.find((c) => c.slug === categorySlug);
  const categoryLabel = isAll ? portfolioConfig.allLabel : (category?.name ?? categorySlug ?? '');

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">{pc.notFound.title}</h1>
          <a href={`/portfolio/${categorySlug ?? ''}`} className="text-primary hover:underline">
            {pc.notFound.back}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      id="main-content"
      tabIndex={-1}
      className="min-h-screen bg-background font-sans text-foreground"
    >
      <BreadCrumbs
        items={[
          { label: siteData.homeLabel, href: '/' },
          { label: portfolioTitle, href: '/portfolio' },
          { label: categoryLabel, href: `/portfolio/${categorySlug}` },
          { label: data.title },
        ]}
      />

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
