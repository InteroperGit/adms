import { useParams } from 'react-router';
import { Container } from '@/components/layout/Container';
import { CaseHero } from '@/components/portfolio/CaseHero';
import { CaseOverview } from '@/components/portfolio/CaseOverview';
import { CaseCTA } from '@/components/portfolio/CaseCTA';
import { BreadCrumbs } from '@/components/ui/navigation/BreadCrumbs';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { NotFound } from '@/pages/NotFound';
import { portfolioCaseContent } from '@/types/portfolio/portfolioCaseContent';
import { portfolioCaseMap } from '@/types/portfolio/portfolioCases';
import { portfolioPageContent } from '@/types/sections/portfolio/portfolioPage';
import { categories } from '@/types/config/categories';
import { portfolioConfig } from '@/types/config/portfolioConfig';
import { siteData } from '@/types/config/siteData';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

/**
 * Portfolio case detail page.
 *
 * Reads `categorySlug` and `caseSlug` from the URL params, looks up the case
 * in `portfolioCaseMap`, and renders a full case view: breadcrumbs, hero,
 * overview metadata, content blocks, and a contact CTA.
 *
 * Renders `<NotFound>` (with a back link to the category listing) when the slug
 * is absent from the case map — e.g. an unpublished case or a mistyped URL.
 *
 * @component
 * @returns {JSX.Element} Full case detail layout, or a 404 page.
 * @example
 * <PortfolioCasePage />
 */
export function PortfolioCasePage() {
  const { categorySlug, caseSlug } = useParams<{
    categorySlug: string;
    year: string;
    month: string;
    caseSlug: string;
  }>();
  const data = caseSlug ? portfolioCaseMap[caseSlug] : undefined;

  const isAll = categorySlug === 'all';
  const category = isAll ? null : categories.find((c) => c.slug === categorySlug);
  const categoryLabel = isAll ? portfolioConfig.allLabel : (category?.name ?? categorySlug ?? '');

  useDocumentTitle(data ? `${data.title} — ${siteData.name}` : siteData.name);

  if (!data) {
    return (
      <NotFound
        backLabel={portfolioCaseContent.notFound.back}
        backHref={`/portfolio/${categorySlug}`}
      />
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
          { label: portfolioPageContent.title, href: '/portfolio' },
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
            key={`${block.__component}-${i}`}
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

export default PortfolioCasePage;
