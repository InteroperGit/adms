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
 * Vertical bar chart component that displays data items as rectangular bars.
 * Uses Recharts for rendering and includes a custom tooltip, grid, and labels
 * above each bar. Bars do not resize on hover; instead, the background beneath
 * the hovered bar receives a subtle highlight color.
 *
 * @component
 * @description Renders a vertical bar chart with theme-aware styling and hover interaction
 * @param {Object} props
 * @param {ChartBlockData} props.block - Chart configuration with items and optional color
 * @returns {JSX.Element} Recharts ResponsiveContainer with BarChart
 *
 * @example <caption>Sales data bar chart</caption>
 * <BarChart block={{
 *   __component: 'chart',
 *   type: 'bar',
 *   items: [
 *     { label: 'Q1', value: 2500, suffix: '$K' },
 *     { label: 'Q2', value: 3200, suffix: '$K' },
 *     { label: 'Q3', value: 2800, suffix: '$K' }
 *   ],
 *   color: { type: 'accent' }
 * }} />
 *
 * @example <caption>Bar chart with primary color</caption>
 * <BarChart block={{
 *   __component: 'chart',
 *   type: 'bar',
 *   items: [
 *     { label: 'Jan', value: 100 },
 *     { label: 'Feb', value: 150 }
 *   ]
 * }} />
 */
export function BarChart({ block }: { block: ChartBlockData }) {
  const data = block.items.map((item) => ({
    label: item.label,
    value: item.value,
    displayValue: `${item.value}${item.suffix || ''}`,
  }));

  const chartColor = resolveChartColor(block.color);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsBarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="5 5" stroke="hsl(var(--border))" strokeWidth={1.5} />
        <XAxis dataKey="label" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
        <YAxis hide />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: 'hsl(var(--primary) / 0.1)' }}
          wrapperStyle={{
            pointerEvents: 'none',
            zIndex: 1000,
          }}
        />
        <Bar dataKey="value" fill={chartColor} radius={[4, 4, 0, 0]} activeBar={false}>
          <LabelList
            dataKey="displayValue"
            position="top"
            fill="hsl(var(--foreground))"
            fontSize={12}
            fontWeight={600}
          />
        </Bar>
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
