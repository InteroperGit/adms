// src/components/portfolio/CaseOverview.tsx
import { Container } from '@/components/layout/Container';
import { cn } from '@/libs/utils';
import { portfolioCaseContent } from '@/types/portfolio/portfolioCaseContent';

interface CaseOverviewProps {
  client: string;
  category: string;
  year: string;
  services: string;
}

/**
 * @component
 * @description Overview section on case detail page displaying key project information in a grid
 * @param {CaseOverviewProps} props
 * @param {string} props.client - Client name
 * @param {string} props.category - Project category
 * @param {string} props.year - Year of project completion
 * @param {string} props.services - Comma-separated list of services provided
 * @returns {JSX.Element} Grid layout with four info items (client, category, year, services)
 * @example <caption>Case overview with project details</caption>
 * <CaseOverview client="ACME Co" category="Branding" year="2024" services="Logo design, Brand guidelines" />
 */
export function CaseOverview({ client, category, year, services }: CaseOverviewProps) {
  const { overviewLabels } = portfolioCaseContent;

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
              <p
                className={cn(
                  'mb-1 text-xs font-medium uppercase tracking-widest text-muted-foreground'
                )}
              >
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
