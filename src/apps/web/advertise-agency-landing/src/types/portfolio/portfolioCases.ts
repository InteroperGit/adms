import type { PortfolioArticle } from '@/types/articles/portfolioArticle';
import { PortfolioArticleSchema } from '@/types/articles/portfolioArticle';
import { categorySlug } from '@/libs/categorySlug';
import { extractYearMonth } from '@/libs/dateUtils';

const modules = import.meta.glob<PortfolioArticle>('@data/portfolio/**/*.json', {
  eager: true,
  import: 'default',
});

/**
 * @description Lookup map of portfolio cases by slug; keyed on case.slug field.
 * Glob-loaded from data/portfolio/**\/*.json at build/dev time, parsed and validated against
 * PortfolioArticleSchema. Use for direct case lookup when rendering case detail pages.
 */
export const portfolioCaseMap: Record<string, PortfolioArticle> = Object.fromEntries(
  Object.entries(modules).map(([, data]) => {
    const parsed = PortfolioArticleSchema.parse(data);
    return [parsed.slug, parsed];
  })
);

/**
 * @description All portfolio cases as an array, extracted from portfolioCaseMap values.
 * Use for rendering portfolio listings and filtering by category. Note: not automatically
 * sorted by publishedAt if needed.
 */
export const allPortfolioCases: PortfolioArticle[] = Object.values(portfolioCaseMap);

/**
 * @description Portfolio case with computed href for routing.
 */
export type PortfolioArticleWithHref = PortfolioArticle & { href: string };

/**
 * @description All portfolio cases with computed hrefs for routing.
 * Use for rendering portfolio listings (sections, pages) that need href attributes.
 * Each case includes the route path: `/portfolio/{categorySlug}/{year}/{month}/{slug}`
 */
export const allPortfolioCasesWithHrefs: PortfolioArticleWithHref[] = allPortfolioCases.map((c) => {
  const { year, month } = extractYearMonth(c.publishedAt);
  return {
    ...c,
    href: `/portfolio/${categorySlug(c.category)}/${year}/${month}/${c.slug}`,
  };
});
