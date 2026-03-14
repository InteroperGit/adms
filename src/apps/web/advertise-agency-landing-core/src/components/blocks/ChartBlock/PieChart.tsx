import { useState } from 'react';
import type { ChartBlock as ChartBlockData } from '@/types/blocks';
import { svgColor } from './colorResolver';

const R = 60;
const CX = 80;
const CY = 80;
const CIRCUMFERENCE = 2 * Math.PI * R;

/**
 * Props for the PieSegment component.
 * @description Configuration for rendering a single arc segment in the pie chart
 */
interface SegmentProps {
  /** Dash length of the stroke in the circular progress path */
  dash: number;
  /** Gap length following the dash */
  gap: number;
  /** Rotation angle in degrees for positioning the segment */
  rotate: number;
  /** Opacity value (0-1) controlling segment color intensity */
  opacity: number;
  /** SVG stroke color (e.g., 'hsl(var(--primary))') */
  color: string;
  /** Whether this segment is currently active/hovered */
  isActive: boolean;
  /** Whether this segment should show faded opacity due to another being active */
  isFaded: boolean;
  /** Called when mouse enters the segment */
  onHover: () => void;
  /** Called when mouse leaves the segment */
  onLeave: () => void;
}

/**
 * Renders a single arc segment of the pie chart as an SVG circle element.
 * The segment expands in width and becomes more opaque on hover. When another
 * segment is active, non-active segments fade to 40% opacity. Smooth transitions
 * are applied to all visual changes.
 *
 * @component
 * @description SVG circle arc segment with interactive hover effects
 * @param {SegmentProps} props - Segment configuration and event handlers
 * @returns {JSX.Element} SVG circle element
 */
function PieSegment({
  dash,
  gap,
  rotate,
  opacity,
  color,
  isActive,
  isFaded,
  onHover,
  onLeave,
}: SegmentProps) {
  return (
    <circle
      cx={CX}
      cy={CY}
      r={R}
      fill="none"
      stroke={color}
      strokeOpacity={isFaded ? opacity * 0.4 : opacity}
      strokeWidth={isActive ? 34 : 28}
      strokeDasharray={`${dash} ${gap}`}
      transform={`rotate(${rotate} ${CX} ${CY})`}
      style={{
        transition: 'stroke-width 0.2s ease, stroke-opacity 0.2s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    />
  );
}

/**
 * Props for the PieLegendItem component.
 * @description Configuration for rendering a legend entry next to the pie chart
 */
interface LegendItemProps {
  /** Label text displayed next to the color dot */
  label: string;
  /** Numeric value of this item */
  value: number;
  /** Optional suffix appended to the value (e.g., '%', 'K$') */
  suffix?: string;
  /** Total sum of all items (used to calculate percentage) */
  total: number;
  /** SVG stroke color for the legend dot */
  color: string;
  /** Opacity value (0-1) for the legend dot color */
  opacity: number;
  /** Whether this item is currently active/hovered */
  isActive: boolean;
  /** Called when mouse enters the legend row */
  onHover: () => void;
  /** Called when mouse leaves the legend row */
  onLeave: () => void;
}

/**
 * Renders a single legend row for the pie chart with interactive hover.
 * Shows a colored dot, label, and value (or percentage on hover). When hovered,
 * the row background highlights, the color dot scales up, and the display
 * switches from value to percentage representation.
 *
 * @component
 * @description Interactive legend row with value/percentage swap on hover
 * @param {LegendItemProps} props - Legend item configuration and event handlers
 * @returns {JSX.Element} List item (li) element
 */
function PieLegendItem({
  label,
  value,
  suffix,
  total,
  color,
  opacity,
  isActive,
  onHover,
  onLeave,
}: LegendItemProps) {
  return (
    <li
      className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-sm transition-colors"
      style={{
        backgroundColor: isActive ? 'hsl(var(--muted))' : 'transparent',
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <span
        className="inline-block h-3 w-3 shrink-0 rounded-full transition-transform"
        style={{
          background: color,
          opacity,
          transform: isActive ? 'scale(1.4)' : 'scale(1)',
        }}
      />
      <span className="text-muted-foreground">{label}</span>
      <span className="ml-auto pl-4 font-semibold text-foreground">
        {isActive ? `${Math.round((value / total) * 100)}%` : `${value}${suffix || ''}`}
      </span>
    </li>
  );
}

/**
 * Interactive pie chart displaying data distribution with SVG donut visualization.
 * Each segment is an arc drawn using CSS stroke-dasharray. Hovering a segment or
 * legend row highlights that item: the segment expands, others fade, and the legend
 * row background highlights with the color dot scaling up. Legend displays raw values
 * by default, switching to percentages on hover. Chart height scales dynamically based
 * on item count to accommodate the legend.
 *
 * @component
 * @description Renders an interactive pie/donut chart with synchronized legend
 * @param {Object} props
 * @param {ChartBlockData} props.block - Chart configuration with items and optional color
 * @returns {JSX.Element} Container with SVG pie chart and interactive legend list
 *
 * @example <caption>Market share pie chart</caption>
 * <PieChart block={{
 *   __component: 'chart',
 *   type: 'pie',
 *   items: [
 *     { label: 'Market A', value: 45, suffix: '%' },
 *     { label: 'Market B', value: 30, suffix: '%' },
 *     { label: 'Market C', value: 25, suffix: '%' }
 *   ],
 *   color: { type: 'primary' }
 * }} />
 *
 * @example <caption>Budget breakdown pie chart</caption>
 * <PieChart block={{
 *   __component: 'chart',
 *   type: 'pie',
 *   items: [
 *     { label: 'Engineering', value: 500 },
 *     { label: 'Marketing', value: 300 },
 *     { label: 'Operations', value: 200 }
 *   ]
 * }} />
 */
export function PieChart({ block }: { block: ChartBlockData }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const total = block.items.reduce((s, i) => s + i.value, 0) || 1;

  const baseColor = svgColor(block.color);
  const palette = block.items.map((_, idx) => {
    return 1 - idx * (0.6 / Math.max(block.items.length - 1, 1));
  });

  const segments = block.items.map((item, i) => {
    const cumulative = block.items.slice(0, i).reduce((s, it) => s + it.value, 0);
    const pct = item.value / total;
    const dash = pct * CIRCUMFERENCE;
    const gap = CIRCUMFERENCE - dash;
    const rotate = (cumulative / total) * 360 - 90;
    return { dash, gap, rotate, opacity: palette[i], item, index: i };
  });

  return (
    <div className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:items-start sm:gap-10">
      <svg viewBox="0 0 160 160" className="w-40 shrink-0" aria-hidden="true">
        {segments.map(({ dash, gap, rotate, opacity, item, index }) => (
          <PieSegment
            key={item.label}
            dash={dash}
            gap={gap}
            rotate={rotate}
            opacity={opacity}
            color={baseColor}
            isActive={activeIndex === index}
            isFaded={activeIndex !== null && activeIndex !== index}
            onHover={() => setActiveIndex(index)}
            onLeave={() => setActiveIndex(null)}
          />
        ))}
      </svg>
      <ul className="space-y-2">
        {block.items.map((item, i) => (
          <PieLegendItem
            key={item.label}
            label={item.label}
            value={item.value}
            suffix={item.suffix}
            total={total}
            color={baseColor}
            opacity={palette[i]}
            isActive={activeIndex === i}
            onHover={() => setActiveIndex(i)}
            onLeave={() => setActiveIndex(null)}
          />
        ))}
      </ul>
    </div>
  );
}
