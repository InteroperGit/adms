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
  const bgColor = color?.background;
  const isGradient = bgColor?.type === 'gradient';
  const isSolid = bgColor?.type === 'solid';
  const isPrimary = bgColor?.type === 'primary';
  const isAccent = bgColor?.type === 'accent';
  const colored = isGradient || isSolid || isPrimary || isAccent;
  const gradientStops = bgColor?.value ?? caseGradient;

  // Resolve text colors with custom overrides
  const metricTextColor = color?.metric || (colored ? 'text-white' : 'text-primary');
  const labelTextColor = color?.label || (colored ? 'text-white/70' : 'text-muted-foreground');
  const descriptionTextColor =
    color?.description || (colored ? 'text-white/80' : 'text-muted-foreground');

  return (
    <div className="mx-auto max-w-4xl">
      {block.title && <h2 className="mb-8 text-2xl font-bold md:text-3xl">{block.title}</h2>}
      <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
        {block.items.map(({ metric, label, description }) => (
          <div
            key={metric}
            className={cn(
              'rounded-2xl p-6',
              isGradient && cn('bg-gradient-to-br', gradientStops),
              isSolid && 'bg-primary',
              isPrimary && 'bg-primary',
              isAccent && 'bg-accent',
              !colored && 'border border-border bg-card shadow-sm'
            )}
          >
            <p className={cn('text-4xl font-bold leading-none', metricTextColor)}>{metric}</p>
            <p className={cn('mt-1 text-sm font-medium uppercase tracking-widest', labelTextColor)}>
              {label}
            </p>
            <p className={cn('mt-3 text-sm', descriptionTextColor)}>{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
