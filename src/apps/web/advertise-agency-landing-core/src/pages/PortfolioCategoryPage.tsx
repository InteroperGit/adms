// src/pages/PortfolioCategoryPage.tsx
import { useParams, Link } from 'react-router-dom';
import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/ui/section/SectionHeader';
import { PortfolioGrid } from '@/components/portfolio/PortfolioGrid';
import { BreadCrumbs } from '@/components/ui/navigation/BreadCrumbs';
import { portfolioPageContent } from '@/types/sections/portfolio/portfolioPage';
import { portfolioConfig } from '@/types/config/portfolioConfig';
import { categories } from '@/types/config/categories';
import { allPortfolioCases } from '@/types/portfolio/portfolioCases';
import { siteData } from '@/types/config/siteData';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

/**
 * @component
 * @description Portfolio listing page with category filtering (all, by category), breadcrumbs and pagination
 * @returns {JSX.Element} Page with category nav, grid, and CTA or 404 message
 * @example
 * <PortfolioCategoryPage />
 */
export function PortfolioCategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const p = portfolioPageContent;

  const isRoot = !categorySlug;
  const isAll = isRoot || categorySlug === 'all';
  const category = isAll ? null : categories.find((c) => c.slug === categorySlug);
  const categoryLabel = categorySlug === 'all' ? portfolioConfig.allLabel : (category?.name ?? '');

  const pageTitle = isAll
    ? `${p.title} — ${siteData.name}`
    : category
      ? `${category.name} — ${p.title} — ${siteData.name}`
      : document.title;
  useDocumentTitle(pageTitle);

  if (!isAll && !category) {
    return (
      <section className="bg-background py-24 md:py-32">
        <Container>
          <p className="mb-4 text-center text-muted-foreground">
            {portfolioConfig.notFoundCategory}
          </p>
          <div className="text-center">
            <Link to="/portfolio" className="text-primary underline underline-offset-4">
              {portfolioConfig.allProjectsLink}
            </Link>
          </div>
        </Container>
      </section>
    );
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
