import { cn } from '@/lib/utils';
import type { CardsBlock as CardsBlockData } from '@/types/portfolio/blocks';

interface CardsBlockProps {
  block: CardsBlockData;
  caseGradient: string;
}

const COLS_CLASS = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
} as const;

export function CardsBlock({ block, caseGradient }: CardsBlockProps) {
  const cols = block.columns ?? 3;

  return (
    <div className="mx-auto max-w-4xl">
      {block.title && <h2 className="mb-8 text-2xl font-bold md:text-3xl">{block.title}</h2>}
      <div className={cn('grid gap-4 sm:gap-6', COLS_CLASS[cols])}>
        {block.items.map(({ title, description }) => (
          <div key={title} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            {block.gradient && (
              <div className={cn('mb-3 h-1 w-10 rounded-full bg-gradient-to-r', caseGradient)} />
            )}
            <h3 className="mb-2 font-semibold">{title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
