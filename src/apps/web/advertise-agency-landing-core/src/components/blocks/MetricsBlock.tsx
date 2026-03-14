import { cn } from '@/libs/utils';
import type { MetricsBlock as MetricsBlockData } from '@/types/portfolio/blocks';

interface MetricsBlockProps {
  block: MetricsBlockData;
  caseGradient: string;
}

/**
 * @component
 * @description Grid of key metrics with value, label and description, supporting gradient/solid coloring
 * @param {MetricsBlockProps} props
 * @param {MetricsBlockData} props.block - Metrics block with title and items (metric, label, description)
 * @param {string} props.caseGradient - Fallback gradient for colored metrics
 * @returns {JSX.Element} Metrics grid with title
 * @example
 * <MetricsBlock block={metricsData} caseGradient="from-blue-500 to-purple-500" />
 */
export function MetricsBlock({ block, caseGradient }: MetricsBlockProps) {
  const color = block.color;
  const isGradient = color?.type === 'gradient';
  const isSolid = color?.type === 'solid';
  const isPrimary = color?.type === 'primary';
  const isAccent = color?.type === 'accent';
  const colored = isGradient || isSolid || isPrimary || isAccent;
  const gradientStops = color?.value ?? caseGradient;

  return (
    <div className="mx-auto max-w-4xl">
      {block.title && <h2 className="mb-8 text-2xl font-bold md:text-3xl">{block.title}</h2>}
      <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
        {block.items.map(({ metric, label, description }) => (
          <div
            key={metric}
            className={cn(
              'rounded-2xl p-6',
              isGradient && cn('bg-gradient-to-br text-white', gradientStops),
              isSolid && 'bg-primary text-white',
              isPrimary && 'bg-primary text-white',
              isAccent && 'bg-accent text-white',
              !colored && 'border border-border bg-card shadow-sm'
            )}
          >
            <p className={cn('text-4xl font-bold leading-none', !colored && 'text-primary')}>
              {metric}
            </p>
            <p
              className={cn(
                'mt-1 text-sm font-medium uppercase tracking-widest',
                colored ? 'text-white/70' : 'text-muted-foreground'
              )}
            >
              {label}
            </p>
            <p className={cn('mt-3 text-sm', colored ? 'text-white/80' : 'text-muted-foreground')}>
              {description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
