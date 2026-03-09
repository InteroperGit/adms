// src/components/portfolio/CaseOverview.tsx
import { Container } from '@/components/layout/Container';
import { portfolioCaseContent } from '@/types/portfolio/portfolioCaseContent';

interface CaseOverviewProps {
  client: string;
  category: string;
  year: string;
  services: string;
}

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
