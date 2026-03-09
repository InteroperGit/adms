import { cn } from '@/lib/utils';
import type { MetricsBlock as MetricsBlockData } from '@/types/portfolio/blocks';

interface MetricsBlockProps {
  block: MetricsBlockData;
  caseGradient: string;
}

export function MetricsBlock({ block, caseGradient }: MetricsBlockProps) {
  return (
    <div className="mx-auto max-w-4xl">
      {block.title && <h2 className="mb-8 text-2xl font-bold md:text-3xl">{block.title}</h2>}
      <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
        {block.items.map(({ metric, label, description }) => (
          <div
            key={metric}
            className={cn(
              'rounded-2xl p-6',
              block.gradient
                ? cn('bg-gradient-to-br text-white', caseGradient)
                : 'border border-border bg-white shadow-sm'
            )}
          >
            <p className={cn('text-4xl font-bold leading-none', !block.gradient && 'text-primary')}>
              {metric}
            </p>
            <p
              className={cn(
                'mt-1 text-sm font-medium uppercase tracking-widest',
                block.gradient ? 'text-white/70' : 'text-muted-foreground'
              )}
            >
              {label}
            </p>
            <p
              className={cn(
                'mt-3 text-sm',
                block.gradient ? 'text-white/80' : 'text-muted-foreground'
              )}
            >
              {description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
