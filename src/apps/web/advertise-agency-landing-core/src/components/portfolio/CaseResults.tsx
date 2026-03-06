// src/components/portfolio/CaseResults.tsx
import { Container } from '@/components/layout/Container';
import { portfolioCaseContent } from '@/types/portfolioCaseContent';
import { cn } from '@/lib/utils';
import type { PortfolioCase } from '@/types/portfolio';

interface CaseResultsProps {
  results: PortfolioCase['results'];
  gradient: string;
}

export function CaseResults({ results, gradient }: CaseResultsProps) {
  return (
    <section className="py-16">
      <Container>
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-10 text-2xl font-bold md:text-3xl">
            {portfolioCaseContent.resultsTitle}
          </h2>
          <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
            {results.map(({ metric, label, description }) => (
              <div
                key={metric}
                className={cn('rounded-2xl bg-gradient-to-br p-6 text-white', gradient)}
              >
                <p className="text-4xl font-bold leading-none">{metric}</p>
                <p className="mt-1 text-sm font-medium uppercase tracking-widest text-white/70">
                  {label}
                </p>
                <p className="mt-3 text-sm text-white/80">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
