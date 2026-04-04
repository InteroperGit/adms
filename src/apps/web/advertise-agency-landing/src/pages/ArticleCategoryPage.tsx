import { useParams } from 'react-router';
import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/ui/section/SectionHeader';
import { PortfolioGrid } from '@/components/articles/PortfolioGrid';
import { BreadCrumbs } from '@/components/ui/navigation/BreadCrumbs';
import { NotFound } from '@/pages/NotFound';
import { allPortfolioCases } from '@/types/portfolio/portfolioCases';
import { portfolioPageContent } from '@/types/sections/portfolio/portfolioPage';
import { portfolioConfig } from '@/types/config/portfolioConfig';
import { categories } from '@/types/config/categories';
import { siteData } from '@/types/config/siteData';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

/**
 * Portfolio listing page — shows all cases or cases filtered to a single category.
 *
 * Route params:
 * - `categorySlug` — optional. Omitted on the root `/portfolio` listing (`isRoot`).
 *   `"all"` and omitted are treated identically: show every case.
 *
 * Renders `<NotFound>` for unrecognised category slugs.
 *
 * @component
 * @returns {JSX.Element} Breadcrumbs + section with `<SectionHeader>` and `<PortfolioGrid>`, or a 404 page.
 */
export function ArticleCategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const p = portfolioPageContent;

  const isRoot = !categorySlug;
  const isAll = isRoot || categorySlug === 'all';
  const category = isAll ? null : categories.find((c) => c.slug === categorySlug);
  const categoryLabel = isAll ? portfolioConfig.allLabel : (category?.name ?? '');

  const pageTitle = isAll
    ? `${p.title} — ${siteData.name}`
    : category
      ? `${category.name} — ${p.title} — ${siteData.name}`
      : `${p.title} — ${siteData.name}`;
  useDocumentTitle(pageTitle);

  if (!isAll && !category) {
    return <NotFound backLabel={portfolioConfig.allProjectsLink} backHref="/portfolio" />;
  }

  const filtered = isAll
    ? allPortfolioCases
    : allPortfolioCases.filter((item) => item.category === category!.name);

  const breadcrumbItems = isRoot
    ? [{ label: siteData.homeLabel, href: '/' }, { label: p.title }]
    : [
        { label: siteData.homeLabel, href: '/' },
        { label: p.title, href: '/portfolio' },
        { label: categoryLabel },
      ];

  return (
    <>
      <BreadCrumbs items={breadcrumbItems} />
      <section className="bg-background py-24 md:py-32">
        <Container>
          <SectionHeader
            label={p.label}
            title={p.title}
            description={p.description}
            className="mb-12"
          />
          <PortfolioGrid items={filtered} activeSlug={categorySlug ?? null} />
        </Container>
      </section>
    </>
  );
}

export default ArticleCategoryPage;
