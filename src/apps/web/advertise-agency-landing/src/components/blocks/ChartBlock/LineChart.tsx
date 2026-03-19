import { useState } from 'react';
import {
  CartesianGrid,
  LabelList,
  Legend,
  Line,
  LineChart as RechartsLineChart,
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
 * Line chart component displaying data points connected by a line with interactive hover effects.
 * Increases line stroke width and enlarges dots on mouse over. Always displays data values
 * above each point. Includes legend, grid, and custom tooltip with theme-aware styling.
 * Recharts animation fires on scroll entry (not page load) via useViewportAnimation.
 *
 * @component
 * @description Renders an interactive line chart with hover effects, value labels, and scroll-triggered animation
 * @param {Object} props
 * @param {ChartBlockData} props.block - Chart configuration with items and optional color
 * @returns {JSX.Element} Recharts ResponsiveContainer with LineChart
 */
export function LineChart({ block }: { block: ChartBlockData }) {
  const [isHovered, setIsHovered] = useState(false);

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
          <RechartsLineChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <CartesianGrid strokeDasharray="5 5" stroke="hsl(var(--border))" strokeWidth={1.5} />
            <XAxis dataKey="label" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
            <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ strokeDasharray: '5 5', stroke: 'hsl(var(--primary))' }}
              wrapperStyle={{
                pointerEvents: 'none',
                zIndex: 1000,
              }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Line
              type="monotone"
              dataKey="value"
              name="Value"
              stroke={chartColor}
              strokeWidth={isHovered ? 4 : 2.5}
              dot={{ fill: chartColor, r: 5 }}
              activeDot={{
                r: 7,
                fill: chartColor,
                stroke: 'hsl(var(--background))',
                strokeWidth: 2,
              }}
              style={{ transition: 'stroke-width 0.2s ease' }}
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
                offset={10}
              />
            </Line>
          </RechartsLineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
