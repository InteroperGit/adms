import { cn } from '@/libs/utils';
import { useViewportAnimation } from '@/hooks/useViewportAnimation';
import type { BlockColor, ChartBlock as ChartBlockData } from '@/types/blocks';

/**
 * Determines the background CSS class for progress bar fill based on color configuration.
 * `solid` type is treated the same as `primary` because progress bars use Tailwind classes
 * and cannot apply arbitrary hex colors via a class string. Pass `color.value` via inline
 * `style` if you need a custom hex fill.
 *
 * @description Maps BlockColor configuration to a Tailwind background class
 * @param {BlockColor | undefined} color - Color configuration object
 * @param {string} caseGradient - Fallback Tailwind gradient class if color type is 'gradient'
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
  // 'solid' and 'primary' both map to bg-primary; solid.value (hex) cannot be used as a class
  return 'bg-primary';
}

interface ProgressChartProps {
  block: ChartBlockData;
  caseGradient: string;
}

/**
 * Progress chart component displaying data items as horizontal progress bars.
 * Each item is rendered as a labeled bar with a percentage-based fill. The bar width
 * is calculated relative to the maximum value in the dataset. Supports custom colors
 * (primary, accent, solid, gradient) with fallback to the provided case gradient.
 * Bars animate from 0% to their target width on scroll entry with staggered delays.
 *
 * @component
 * @description Renders a series of horizontal progress bars with labels and values
 * @param {ProgressChartProps} props
 * @param {ChartBlockData} props.block - Chart configuration with items and optional color
 * @param {string} props.caseGradient - Tailwind gradient classes fallback for gradient colors
 * @returns {JSX.Element} Container with list of progress bar rows
 */
export function ProgressChart({ block, caseGradient }: ProgressChartProps) {
  const max = Math.max(...block.items.map((i) => i.value), 1);
  const bg = barBgClass(block.color, caseGradient);
  const [containerRef, inView] = useViewportAnimation({ threshold: 0.2 });

  return (
    <div ref={containerRef} className="space-y-4">
      {block.items.map((item, index) => {
        const pct = (item.value / max) * 100;
        const delay = index * 100;
        return (
          <div key={item.label} className="flex items-center gap-3">
            <span className="w-28 shrink-0 text-sm text-muted-foreground">{item.label}</span>
            <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className={cn('h-full rounded-full', bg)}
                style={{
                  width: inView ? `${pct}%` : '0%',
                  transition: `width 0.8s cubic-bezier(0.25, 1, 0.5, 1) ${delay}ms`,
                }}
              />
            </div>
            <span
              className="w-12 shrink-0 text-right text-sm font-semibold text-foreground"
              style={{
                opacity: inView ? 1 : 0,
                transition: `opacity 0.4s ease-out ${delay + 600}ms`,
              }}
            >
              {item.value}
              {item.suffix}
            </span>
          </div>
        );
      })}
    </div>
  );
}
