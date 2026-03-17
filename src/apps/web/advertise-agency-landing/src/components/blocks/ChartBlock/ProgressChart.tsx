import { cn } from '@/libs/utils';
import type { BlockColor, ChartBlock as ChartBlockData } from '@/types/blocks';

/**
 * Determines the background CSS class for progress bar fill.
 * Returns a Tailwind class based on the color configuration (primary, accent, solid, or gradient).
 * If no color is specified, defaults to primary color.
 *
 * @description Maps BlockColor configuration to a Tailwind background class
 * @param {BlockColor | undefined} color - Color configuration object
 * @param {string} caseGradient - Fallback Tailwind gradient class if color type is gradient
 * @returns {string} Tailwind class name for the progress bar background
 */
function barBgClass(color: BlockColor | undefined, caseGradient: string): string {
  if (!color) {
    return 'bg-primary';
  }
  if (color.type === 'accent') {
    return 'bg-accent';
  }
  if (color.type === 'gradient') {
    return cn('bg-gradient-to-r', color.value ?? caseGradient);
  }
  if (color.type === 'solid') {
    return 'bg-primary';
  }
  return 'bg-primary';
}

/**
 * Progress chart component displaying data items as horizontal progress bars.
 * Each item is rendered as a labeled bar with a percentage-based fill. The bar width
 * is calculated relative to the maximum value in the dataset. Supports custom colors
 * (primary, accent, solid, gradient) with fallback to the provided case gradient.
 * Useful for showing completion rates, utilization, or other percentage-based metrics.
 *
 * @component
 * @description Renders a series of horizontal progress bars with labels and values
 * @param {Object} props
 * @param {ChartBlockData} props.block - Chart configuration with items and optional color
 * @param {string} props.caseGradient - Tailwind gradient classes fallback for gradient colors
 * @returns {JSX.Element} Container with list of progress bar rows
 *
 * @example <caption>Task completion progress</caption>
 * <ProgressChart
 *   block={{
 *     __component: 'chart',
 *     type: 'progress',
 *     items: [
 *       { label: 'Phase 1', value: 100, suffix: '%' },
 *       { label: 'Phase 2', value: 75, suffix: '%' },
 *       { label: 'Phase 3', value: 40, suffix: '%' }
 *     ],
 *     color: { type: 'accent' }
 *   }}
 *   caseGradient="from-blue-500 to-purple-500"
 * />
 *
 * @example <caption>Resource utilization bars</caption>
 * <ProgressChart
 *   block={{
 *     __component: 'chart',
 *     type: 'progress',
 *     items: [
 *       { label: 'CPU', value: 85 },
 *       { label: 'Memory', value: 62 },
 *       { label: 'Disk', value: 45 }
 *     ]
 *   }}
 *   caseGradient="from-blue-500 to-purple-500"
 * />
 */
export function ProgressChart({
  block,
  caseGradient,
}: {
  block: ChartBlockData;
  caseGradient: string;
}) {
  const max = Math.max(...block.items.map((i) => i.value), 1);
  const bg = barBgClass(block.color, caseGradient);

  return (
    <div className="space-y-3">
      {block.items.map((item) => {
        const pct = (item.value / max) * 100;
        return (
          <div key={item.label} className="flex items-center gap-3">
            <span className="w-28 shrink-0 text-sm text-muted-foreground">{item.label}</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className={cn('h-full rounded-full transition-all', bg)}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="w-12 shrink-0 text-right text-sm font-semibold text-foreground">
              {item.value}
              {item.suffix}
            </span>
          </div>
        );
      })}
    </div>
  );
}
