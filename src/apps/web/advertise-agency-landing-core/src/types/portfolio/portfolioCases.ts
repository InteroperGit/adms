import type { PortfolioCase } from '@/types/portfolio';
import { PortfolioCaseSchema } from '@/types/portfolio';

const modules = import.meta.glob<PortfolioCase>('@data/portfolio/**/*.json', {
  eager: true,
  import: 'default',
});

export const portfolioCaseMap: Record<string, PortfolioCase> = Object.fromEntries(
  Object.entries(modules).map(([, data]) => {
    const parsed = PortfolioCaseSchema.parse(data);
    return [parsed.slug, parsed];
  })
);

export const allPortfolioCases: PortfolioCase[] = Object.values(portfolioCaseMap);
