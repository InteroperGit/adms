// src/components/articles/PortfolioOverview.tsx
import { Container } from '@/components/layout/Container';
import { portfolioConfig } from '@/types/config/portfolioConfig';

interface PortfolioOverviewProps {
  /** Client name as it appears on the article. */
  client: string;
  /** Human-readable category name (not slug). */
  category: string;
  /** Four-digit year the project was completed, e.g. `"2024"`. */
  year: string;
  /** Comma-separated list of services rendered for this article. */
  services: string;
}

/**
 * Project metadata grid displayed directly below the hero on article detail pages.
 *
 * Renders four labelled stat items — client, category, year, services — in a
 * responsive grid that collapses to 1 column on mobile, 2 on small screens, and
 * 4 on desktop. Each item shows a small-caps label (from `overviewLabels`) and a
 * semibold value. The section is separated from the content below by a bottom border.
 *
 * Field labels are sourced from `portfolioConfig.overviewLabels`
 * (`data/config/portfolio.json`) for white-label localisation.
 *
 * @param props - See {@link PortfolioOverviewProps}.
 * @returns A bordered `<section>` containing the metadata grid.
 *
 * @example
 * <PortfolioOverview
 *   client="ACME Corp"
 *   category="Брендинг"
 *   year="2024"
 *   services="Логотип, Фирменный стиль, Гайдлайн"
 * />
 */
export function PortfolioOverview({ client, category, year, services }: PortfolioOverviewProps) {
  const { overviewLabels } = portfolioConfig;

  const items = [
    { label: overviewLabels.client, value: client },
    { label: overviewLabels.category, value: category },
    { label: overviewLabels.year, value: year },
    { label: overviewLabels.services, value: services },
  ];

  return (
    <section className="border-b border-border py-16">
      <Container>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {items.map(({ label, value }) => (
            <div key={label}>
              <p className="mb-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                {label}
              </p>
              <p className="font-semibold text-foreground">{value}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
