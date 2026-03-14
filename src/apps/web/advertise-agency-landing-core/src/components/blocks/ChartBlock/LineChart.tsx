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
import { CustomTooltip } from './CustomTooltip';
import { resolveChartColor } from './colorResolver';

/**
 * Line chart component displaying data points connected by a line with interactive hover effects.
 * Increases line stroke width and enlarges dots on mouse over. Always displays data values
 * above each point. Includes legend, grid, and custom tooltip with theme-aware styling.
 * Handles hover state via React state to synchronize visual feedback.
 *
 * @component
 * @description Renders an interactive line chart with hover effects and value labels
 * @param {Object} props
 * @param {ChartBlockData} props.block - Chart configuration with items and optional color
 * @returns {JSX.Element} Recharts ResponsiveContainer with LineChart
 *
 * @example <caption>Stock price trend over time</caption>
 * <LineChart block={{
 *   __component: 'chart',
 *   type: 'line',
 *   items: [
 *     { label: 'Week 1', value: 95, suffix: '$' },
 *     { label: 'Week 2', value: 102, suffix: '$' },
 *     { label: 'Week 3', value: 98, suffix: '$' }
 *   ],
 *   color: { type: 'primary' }
 * }} />
 *
 * @example <caption>Growth metrics line chart</caption>
 * <LineChart block={{
 *   __component: 'chart',
 *   type: 'line',
 *   items: [
 *     { label: 'Jan', value: 65 },
 *     { label: 'Feb', value: 78 },
 *     { label: 'Mar', value: 92 }
 *   ]
 * }} />
 */
export function LineChart({ block }: { block: ChartBlockData }) {
  const [isHovered, setIsHovered] = useState(false);

  const data = block.items.map((item) => ({
    label: item.label,
    value: item.value,
    displayValue: `${item.value}${item.suffix || ''}`,
  }));

  const chartColor = resolveChartColor(block.color);

  return (
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
          activeDot={{ r: 7, fill: chartColor, stroke: 'hsl(var(--background))', strokeWidth: 2 }}
          style={{ transition: 'stroke-width 0.2s ease' }}
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
  );
}
