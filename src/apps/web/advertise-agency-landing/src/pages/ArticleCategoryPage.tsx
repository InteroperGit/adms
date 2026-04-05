import { useParams, useLocation } from 'react-router';
import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/ui/section/SectionHeader';
import { ArticleGrid } from '@/components/articles/ArticleGrid';
import { BreadCrumbs } from '@/components/ui/navigation/BreadCrumbs';
import { NotFound } from '@/pages/NotFound';
import { allPortfolioCases } from '@/types/portfolio/portfolioCases';
import { allNewsArticles, allBlogArticles } from '@/types/articles/allArticles';
import { portfolioConfig } from '@/types/config/portfolioConfig';
import { newsConfig } from '@/types/config/newsConfig';
import { blogConfig } from '@/types/config/blogConfig';
import { portfolioSectionContent } from '@/types/portfolio';
import { categories } from '@/types/config/categories';
import { siteData } from '@/types/config/siteData';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { extractYearMonth } from '@/libs/dateUtils';
import type { BaseArticle } from '@/types/articles/article';

type ArticleType = 'portfolio' | 'news' | 'blog';

function getArticleHref(type: ArticleType, article: BaseArticle, categorySegment: string): string {
  const { year, month } = extractYearMonth(article.publishedAt);
  switch (type) {
    case 'portfolio':
      return `/portfolio/${categorySegment}/${year}/${month}/${article.slug}`;
    case 'news':
      return `/news/${year}/${month}/${article.slug}`;
    case 'blog':
      return `/blog/${year}/${month}/${article.slug}`;
  }
}

interface ArticleTypeConfig {
  label: string;
  basePath: string;
  items: BaseArticle[];
  hasCategories: boolean;
  perPage: number;
  emptyLabel: string;
  detailsLabel?: string;
  cta?: { label: string; href: string };
  /** Description shown above the article grid */
  gridDescription: string;
}

const TYPE_REGISTRY: Record<ArticleType, ArticleTypeConfig> = {
  portfolio: {
    label: 'Портфолио',
    basePath: '/portfolio',
    items: allPortfolioCases,
    hasCategories: true,
    perPage: portfolioConfig.perPage,
    emptyLabel: portfolioConfig.emptyLabel,
    detailsLabel: portfolioSectionContent.detailsLabel,
    cta: portfolioConfig.cta,
    gridDescription: portfolioConfig.gridDescription,
  },
  news: {
    label: 'Новости',
    basePath: '/news',
    items: allNewsArticles,
    hasCategories: false,
    perPage: 12,
    emptyLabel: newsConfig.emptyLabel,
    gridDescription: newsConfig.gridDescription,
  },
  blog: {
    label: 'Блог',
    basePath: '/blog',
    items: allBlogArticles,
    hasCategories: false,
    perPage: 12,
    emptyLabel: blogConfig.emptyLabel,
    gridDescription: blogConfig.gridDescription,
  },
};

function detectType(pathname: string): ArticleType | null {
  const segment = pathname.replace(/^\/|\/$/g, '').split('/')[0];
  if (segment === 'portfolio' || segment === 'news' || segment === 'blog') {
    return segment as ArticleType;
  }
  return null;
}

/**
 * Generic article listing page — shows articles filtered by type and optional category.
 *
 * Route params:
 * - `categorySlug` — optional. Used for portfolio category filtering.
 *   Omitted on the root listing (`isRoot`).
 *
 * Supports 'portfolio', 'news', 'blog' types via TYPE_REGISTRY.
 * ArticleListPage remains as the handler for /news and /blog routes.
 *
 * @component
 * @returns {JSX.Element} Breadcrumbs + section with ArticleGrid and CTA, or a 404 page.
 */
export function ArticleCategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const location = useLocation();
  const pathname = location.pathname.replace(/^\/|\/$/g, '');

  const type = detectType(pathname);
  const detectedType: ArticleType = type ?? 'portfolio';
  const cfg = TYPE_REGISTRY[detectedType];

  const isAll = !categorySlug || categorySlug === 'all';
  const category =
    isAll || !cfg.hasCategories ? null : categories.find((c) => c.slug === categorySlug);

  const categoryLabel = isAll ? portfolioConfig.allLabel : (category?.name ?? cfg.label);
  const pageTitle =
    isAll || !cfg.hasCategories
      ? `${cfg.label} — ${siteData.name}`
      : `${category!.name} — ${cfg.label} — ${siteData.name}`;
  useDocumentTitle(pageTitle);

  if (!isAll && cfg.hasCategories && !category) {
    const allLabel = cfg.basePath === '/portfolio' ? portfolioConfig.allProjectsLink : 'На главную';
    return <NotFound backLabel={allLabel} backHref={cfg.basePath} />;
  }

  const filtered =
    isAll || !cfg.hasCategories
      ? cfg.items
      : cfg.items.filter((item) => item.category === category!.name);

  const breadcrumbItems =
    isAll || !cfg.hasCategories
      ? [{ label: siteData.homeLabel, href: '/' }, { label: cfg.label }]
      : [
          { label: siteData.homeLabel, href: '/' },
          { label: cfg.label, href: cfg.basePath },
          { label: categoryLabel },
        ];

  return (
    <>
      <BreadCrumbs items={breadcrumbItems} />
      <section className="bg-background py-24 md:py-32">
        <Container>
          <SectionHeader
            label={cfg.label}
            title={cfg.label}
            description={cfg.gridDescription}
            className="mb-12"
          />
          <ArticleGrid
            items={filtered}
            articleHref={(item) => getArticleHref(detectedType, item, categorySlug ?? 'all')}
            detailsLabel={cfg.detailsLabel ?? portfolioSectionContent.detailsLabel}
            basePath={cfg.basePath}
            cta={cfg.cta}
            emptyLabel={cfg.emptyLabel}
            perPage={cfg.perPage}
            categories={cfg.hasCategories ? categories : undefined}
            allLabel={portfolioConfig.allLabel}
            activeSlug={cfg.hasCategories ? categorySlug : undefined}
          />
        </Container>
      </section>
    </>
  );
}

export default ArticleCategoryPage;
