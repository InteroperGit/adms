import type { PortfolioCase } from '@/types/portfolio';

const modules = import.meta.glob<PortfolioCase>('@data/portfolio/*.json', {
  eager: true,
  import: 'default',
});

export const portfolioCaseMap: Record<string, PortfolioCase> = Object.fromEntries(
  Object.entries(modules).map(([path, data]) => {
    const slug = path.replace(/.*\/(.+)\.json$/, '$1');
    return [slug, data];
  })
);
