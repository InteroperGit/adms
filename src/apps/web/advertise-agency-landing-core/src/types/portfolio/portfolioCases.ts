import type { PortfolioCase } from '@/types/portfolio';
import { PortfolioCaseSchema } from '@/types/portfolio';

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
 * sorted; caller should sort by publishDate if needed.
 */
export const allPortfolioCases: PortfolioCase[] = Object.values(portfolioCaseMap);
