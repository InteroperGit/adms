import { useParams, useLocation } from 'react-router';
import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/shared/section/SectionHeader';
import { ArticleGrid } from '@/components/articles/ArticleGrid';
import { BreadCrumbs } from '@/components/navigation/BreadCrumbs';
import { NotFound } from '@/pages/NotFound';
import {
  allNewsArticles,
  allBlogArticles,
  allPortfolioArticles,
} from '@/types/articles/allArticles';
import { portfolioConfig } from '@/types/config/portfolioConfig';
import { newsConfig } from '@/types/config/newsConfig';
import { blogConfig } from '@/types/config/blogConfig';
import { categories } from '@/types/config/categories';
import { siteData } from '@/types/config/siteData';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getArticleHref, type ArticleType } from '@/libs/articleUtils';
import type { BaseArticle } from '@/types/articles/article';

// --- Constants ---

const HOME_PATH = '/';
const DEFAULT_CATEGORY = 'all';
const FALLBACK_BACK_LABEL = 'На главную';

// Valid article type path segments, derived from the registry below
const ARTICLE_PATHS = ['portfolio', 'news', 'blog'] as const;

/** Base path per article type */
const TYPE_BASE_PATH: Record<ArticleType, string> = {
  portfolio: '/portfolio',
  news: '/news',
  blog: '/blog',
};

// --- Registry ---

interface ArticleTypeConfig {
  label: string;
  basePath: string;
  items: BaseArticle[];
  hasCategories: boolean;
  perPage: number;
  allLabel: string;
  emptyLabel: string;
  detailsLabel: string;
  cta?: { label: string; href: string };
  gridDescription: string;
}

const TYPE_REGISTRY: Record<ArticleType, ArticleTypeConfig> = {
  portfolio: {
    label: 'Портфолио',
    basePath: TYPE_BASE_PATH.portfolio,
    items: allPortfolioArticles,
    hasCategories: true,
    perPage: portfolioConfig.perPage,
    allLabel: portfolioConfig.allLabel,
    emptyLabel: portfolioConfig.emptyLabel,
    detailsLabel: portfolioConfig.detailsLabel,
    cta: portfolioConfig.cta,
    gridDescription: portfolioConfig.gridDescription,
  },
  news: {
    label: 'Новости',
    basePath: TYPE_BASE_PATH.news,
    items: allNewsArticles,
    hasCategories: false,
    perPage: 12,
    allLabel: newsConfig.allLabel,
    emptyLabel: newsConfig.emptyLabel,
    detailsLabel: newsConfig.detailsLabel,
    gridDescription: newsConfig.gridDescription,
  },
  blog: {
    label: 'Блог',
    basePath: TYPE_BASE_PATH.blog,
    items: allBlogArticles,
    hasCategories: false,
    perPage: 12,
    allLabel: blogConfig.allLabel,
    emptyLabel: blogConfig.emptyLabel,
    detailsLabel: blogConfig.detailsLabel,
    gridDescription: blogConfig.gridDescription,
  },
};

// --- Helpers ---

function detectType(pathname: string): ArticleType | null {
  const segment = pathname.replace(/^\/|\/$/g, '').split('/')[0];
  return ARTICLE_PATHS.includes(segment as ArticleType) ? (segment as ArticleType) : null;
}

function buildBreadcrumbs(
  homeLabel: string,
  typeLabel: string,
  categoryLabel: string | null,
  typeBasePath: string
): Array<{ label: string; href?: string }> {
  if (!categoryLabel) {
    return [{ label: homeLabel, href: HOME_PATH }, { label: typeLabel }];
  }
  return [
    { label: homeLabel, href: HOME_PATH },
    { label: typeLabel, href: typeBasePath },
    { label: categoryLabel },
  ];
}

// --- Component ---

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

  const isAll = !categorySlug || categorySlug === DEFAULT_CATEGORY;
  const isRoot = isAll || !cfg.hasCategories;

  const category = isRoot ? null : categories.find((c) => c.slug === categorySlug);

  // Compute pageTitle safely before any early return (hooks must be unconditional)
  const pageTitle = isRoot
    ? `${cfg.label} — ${siteData.name}`
    : category
      ? `${category.name} — ${cfg.label} — ${siteData.name}`
      : cfg.label;
  useDocumentTitle(pageTitle);

  // Unknown category → 404
  if (!isRoot && !category) {
    const allLabel =
      cfg.basePath === TYPE_BASE_PATH.portfolio
        ? portfolioConfig.allProjectsLink
        : FALLBACK_BACK_LABEL;
    return <NotFound backLabel={allLabel} backHref={cfg.basePath} />;
  }

  const categoryLabel = isAll ? cfg.allLabel : (category?.name ?? cfg.label);

  const filtered = isRoot
    ? cfg.items
    : cfg.items.filter((item) => item.category === category!.name);

  const breadcrumbs = buildBreadcrumbs(siteData.homeLabel, cfg.label, categoryLabel, cfg.basePath);

  return (
    <>
      <BreadCrumbs items={breadcrumbs} />
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
            articleHref={(item) =>
              getArticleHref(detectedType, item, categorySlug ?? DEFAULT_CATEGORY)
            }
            detailsLabel={cfg.detailsLabel}
            basePath={cfg.basePath}
            cta={cfg.cta}
            emptyLabel={cfg.emptyLabel}
            perPage={cfg.perPage}
            categories={cfg.hasCategories ? categories : undefined}
            allLabel={cfg.allLabel}
            activeSlug={cfg.hasCategories ? categorySlug : undefined}
          />
        </Container>
      </section>
    </>
  );
}

export default ArticleCategoryPage;
