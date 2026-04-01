import type { PortfolioCase, PortfolioCaseWithHref } from '@/types/portfolio';
import { PortfolioCaseSchema } from '@/types/portfolio';
import { categorySlug } from '@/libs/categorySlug';
import { extractYearMonth } from '@/libs/dateUtils';

const modules = import.meta.glob<PortfolioCase>('@data/portfolio/**/*.json', {
  eager: true,
  import: 'default',
});

/**
 * @description Lookup map of portfolio cases by slug; keyed on case.slug field.
 * Glob-loaded from data/portfolio/**\/*.json at build/dev time, parsed and validated against
 * PortfolioCaseSchema. Use for direct case lookup when rendering case detail pages.
 */
export const portfolioCaseMap: Record<string, PortfolioCase> = Object.fromEntries(
  Object.entries(modules).map(([, data]) => {
    const parsed = PortfolioCaseSchema.parse(data);
    return [parsed.slug, parsed];
  })
);

/**
 * @description All portfolio cases as an array, extracted from portfolioCaseMap values.
 * Use for rendering portfolio listings and filtering by category. Note: not automatically
 * sorted; caller should sort by publishedAt if needed.
 */
export const allPortfolioCases: PortfolioCase[] = Object.values(portfolioCaseMap);

/**
 * @description All portfolio cases with computed hrefs for routing.
 * Use for rendering portfolio listings (sections, pages) that need href attributes.
 * Each case includes the route path: `/portfolio/{categorySlug}/{year}/{month}/{slug}`
 */
export const allPortfolioCasesWithHrefs: PortfolioCaseWithHref[] = allPortfolioCases.map((c) => {
  const { year, month } = extractYearMonth(c.publishedAt);
  return {
    ...c,
    href: `/portfolio/${categorySlug(c.category)}/${year}/${month}/${c.slug}`,
  };
});
