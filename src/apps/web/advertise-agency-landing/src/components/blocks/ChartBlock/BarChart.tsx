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
 * Vertical bar chart component that displays data items as rectangular bars.
 * Uses Recharts for rendering and includes a custom tooltip, grid, and labels
 * above each bar. Bars do not resize on hover; instead, the background beneath
 * the hovered bar receives a subtle highlight color.
 * Recharts animation fires on scroll entry (not page load) via useViewportAnimation.
 *
 * @component
 * @description Renders a vertical bar chart with theme-aware styling and scroll-triggered animation
 * @param {Object} props
 * @param {ChartBlockData} props.block - Chart configuration with items and optional color
 * @returns {JSX.Element} Recharts ResponsiveContainer with BarChart
 */
export function BarChart({ block }: { block: ChartBlockData }) {
  const data = block.items.map((item) => ({
    label: item.label,
    value: item.value,
    displayValue: `${item.value}${item.suffix || ''}`,
  }));

  const chartColor = resolveChartColor(block.color);
  const [ref, inView] = useViewportAnimation({ threshold: 0.2 });

  return (
    <div ref={ref} style={{ height: 300 }}>
      {inView && (
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
            <Bar
              dataKey="value"
              fill={chartColor}
              radius={[4, 4, 0, 0]}
              activeBar={false}
              isAnimationActive={true}
              animationDuration={800}
              animationEasing="ease-out"
            >
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
      )}
    </div>
  );
}
