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
import { useViewportAnimation } from '@/hooks/useViewportAnimation';
import { CustomTooltip } from './CustomTooltip';
import { resolveChartColor } from './colorResolver';

/**
 * Horizontal bar chart component displaying data items as left-to-right bars.
 * Useful for comparing multiple categories or long labels that fit better horizontally.
 * Bars do not resize on hover; background beneath hovered bar receives a subtle highlight.
 * Chart height is dynamic based on item count (minimum 200px, 40px per item).
 * Recharts animation fires on scroll entry (not page load) via useViewportAnimation.
 *
 * @component
 * @description Renders a horizontal bar chart with dynamic height and scroll-triggered animation
 * @param {Object} props
 * @param {ChartBlockData} props.block - Chart configuration with items and optional color
 * @returns {JSX.Element} Recharts ResponsiveContainer with horizontal BarChart
 */
export function HorizontalBarChart({ block }: { block: ChartBlockData }) {
  const data = block.items.map((item) => ({
    label: item.label,
    value: item.value,
    displayValue: `${item.value}${item.suffix || ''}`,
  }));

  const chartColor = resolveChartColor(block.color);
  const chartHeight = Math.max(200, block.items.length * 40);
  const [ref, inView] = useViewportAnimation({ threshold: 0.2 });

  return (
    <div ref={ref} style={{ height: chartHeight }}>
      {inView && (
        <ResponsiveContainer width="100%" height={chartHeight}>
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
            <Bar
              dataKey="value"
              fill={chartColor}
              radius={[0, 4, 4, 0]}
              activeBar={false}
              isAnimationActive={true}
              animationDuration={800}
              animationEasing="ease-out"
            >
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
      )}
    </div>
  );
}
