import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { ChartBlock as ChartBlockData } from '@/types/blocks';
import { CustomTooltip } from './CustomTooltip';
import { resolveChartColor } from './colorResolver';

/**
 * Horizontal bar chart component displaying data items as left-to-right bars.
 * Useful for comparing multiple categories or long labels that fit better horizontally.
 * Bars do not resize on hover; background beneath hovered bar receives a subtle highlight.
 * Chart height is dynamic based on item count (minimum 200px, 40px per item).
 * Includes labels to the right of bars and custom tooltip.
 *
 * @component
 * @description Renders a horizontal bar chart with dynamic height and hover interaction
 * @param {Object} props
 * @param {ChartBlockData} props.block - Chart configuration with items and optional color
 * @returns {JSX.Element} Recharts ResponsiveContainer with horizontal BarChart
 *
 * @example <caption>Regional sales comparison</caption>
 * <HorizontalBarChart block={{
 *   __component: 'chart',
 *   type: 'horizontal-bar',
 *   items: [
 *     { label: 'North America', value: 15000, suffix: 'K$' },
 *     { label: 'Europe', value: 12000, suffix: 'K$' },
 *     { label: 'Asia Pacific', value: 18000, suffix: 'K$' }
 *   ],
 *   color: { type: 'accent' }
 * }} />
 *
 * @example <caption>Many-item horizontal bar chart</caption>
 * <HorizontalBarChart block={{
 *   __component: 'chart',
 *   type: 'horizontal-bar',
 *   items: [
 *     { label: 'Item 1', value: 50 },
 *     { label: 'Item 2', value: 75 },
 *     { label: 'Item 3', value: 60 }
 *   ]
 * }} />
 */
export function HorizontalBarChart({ block }: { block: ChartBlockData }) {
  const data = block.items.map((item) => ({
    label: item.label,
    value: item.value,
    displayValue: `${item.value}${item.suffix || ''}`,
  }));

  const chartColor = resolveChartColor(block.color);

  return (
    <ResponsiveContainer width="100%" height={Math.max(200, block.items.length * 40)}>
      <RechartsBarChart
        data={data}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="5 5" stroke="hsl(var(--border))" strokeWidth={1.5} />
        <XAxis type="number" hide />
        <YAxis
          dataKey="label"
          type="category"
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          width={90}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: 'hsl(var(--primary) / 0.1)' }}
          wrapperStyle={{
            pointerEvents: 'none',
            zIndex: 1000,
          }}
        />
        <Bar dataKey="value" fill={chartColor} radius={[0, 4, 4, 0]} activeBar={false}>
          <LabelList
            dataKey="displayValue"
            position="right"
            fill="hsl(var(--foreground))"
            fontSize={12}
            fontWeight={600}
            offset={8}
          />
        </Bar>
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
