// src/components/portfolio/CaseSolution.tsx
import { Container } from '@/components/layout/Container';
import { content } from '@/lib/content';
import { cn } from '@/lib/utils';
import type { PortfolioCase } from '@/types/portfolio';

interface CaseSolutionProps {
  solution: PortfolioCase['solution'];
  gradient: string;
}

export function CaseSolution({ solution, gradient }: CaseSolutionProps) {
  return (
    <section className="bg-muted/40 py-16">
      <Container>
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-10 text-2xl font-bold md:text-3xl">
            {content.portfolioCase.solutionTitle}
          </h2>
          <div className="grid gap-4 sm:grid-cols-3 sm:gap-8">
            {solution.map(({ title, description }) => (
              <div key={title} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                <div className={cn('mb-3 h-1 w-10 rounded-full bg-gradient-to-r', gradient)} />
                <h3 className="mb-2 font-semibold">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
