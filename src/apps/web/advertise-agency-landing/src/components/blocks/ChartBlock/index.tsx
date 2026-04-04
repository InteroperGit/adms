import type { ChartBlock as ChartBlockData } from '@/types/blocks';
import { BarChart } from './BarChart';
import { HorizontalBarChart } from './HorizontalBarChart';
import { ProgressChart } from './ProgressChart';
import { LineChart } from './LineChart';
import { PieChart } from './PieChart';

export interface ChartBlockProps {
  block: ChartBlockData;
  articleGradient: string;
}

/**
 * Multi-type data visualization router that renders different chart types based on configuration.
 * Supports bar, horizontal bar, progress, line, and pie charts. Automatically routes to the
 * correct chart component and applies consistent styling with optional title.
 *
 * @component
 * @description Renders a chart with optional title and routes to type-specific chart renderer
 * @param {ChartBlockProps} props
 * @param {ChartBlockData} props.block - Chart configuration containing type, data items, colors, and optional title
 * @param {string} props.articleGradient - Tailwind gradient classes to use as fallback for gradient colors
 * @returns {JSX.Element} Container with optional title and routed chart component
 *
 * @example <caption>Vertical bar chart with custom color</caption>
 * <ChartBlock
 *   block={{
 *     __component: 'chart',
 *     type: 'bar',
 *     title: 'Monthly Revenue',
 *     items: [{ label: 'Jan', value: 4000, suffix: '$' }],
 *     color: { type: 'accent' }
 *   }}
 *   articleGradient="from-blue-500 to-purple-500"
 * />
 *
 * @example <caption>Interactive pie chart without title</caption>
 * <ChartBlock
 *   block={{
 *     __component: 'chart',
 *     type: 'pie',
 *     items: [
 *       { label: 'Product A', value: 60, suffix: '%' },
 *       { label: 'Product B', value: 40, suffix: '%' }
 *     ]
 *   }}
 *   articleGradient="from-blue-500 to-purple-500"
 * />
 */
export function ChartBlock({ block, articleGradient }: ChartBlockProps) {
  return (
    <div className="mx-auto max-w-4xl">
      {block.title && <h2 className="mb-6 text-2xl font-bold md:text-3xl">{block.title}</h2>}
      {block.type === 'bar' && <BarChart block={block} />}
      {block.type === 'horizontal-bar' && <HorizontalBarChart block={block} />}
      {block.type === 'progress' && (
        <ProgressChart block={block} articleGradient={articleGradient} />
      )}
      {block.type === 'line' && <LineChart block={block} />}
      {block.type === 'pie' && <PieChart block={block} />}
    </div>
  );
}
