import { cn } from '@/lib/utils';
import type { BlockColor, ChartBlock as ChartBlockData } from '@/types/portfolio/blocks';

interface ChartBlockProps {
  block: ChartBlockData;
  caseGradient: string;
}

/**
 * @component
 * @description Multi-type data visualization renderer (bar, horizontal bar, progress, line, pie charts)
 * @param {ChartBlockProps} props
 * @param {ChartBlockData} props.block - Chart configuration with type, items and color
 * @param {string} props.caseGradient - Fallback gradient for colored elements
 * @returns {JSX.Element} Rendered chart with title
 * @example
 * <ChartBlock block={chartData} caseGradient="from-blue-500 to-purple-500" />
 */
// Returns Tailwind bg classes for div-based bars
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

// Returns CSS color string for SVG elements
function svgColor(color: BlockColor | undefined): string {
  if (color?.type === 'accent') {
    return 'hsl(var(--accent))';
  }
  return 'hsl(var(--primary))';
}

// ─── Bar (vertical) ──────────────────────────────────────────────────────────

function BarChart({ block, caseGradient }: { block: ChartBlockData; caseGradient: string }) {
  const max = Math.max(...block.items.map((i) => i.value), 1);
  const bg = barBgClass(block.color, caseGradient);

  return (
    <div className="flex items-end justify-around gap-3">
      {block.items.map((item) => {
        const pct = (item.value / max) * 100;
        return (
          <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
            <span className="text-xs font-semibold text-foreground">
              {item.value}
              {item.suffix}
            </span>
            <div className="w-full rounded-t-md" style={{ height: '140px' }}>
              <div
                className={cn('w-full rounded-t-md transition-all', bg)}
                style={{ height: `${pct}%`, marginTop: `${100 - pct}%` }}
              />
            </div>
            <span className="text-center text-xs text-muted-foreground">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Horizontal Bar ───────────────────────────────────────────────────────────

function HorizontalBarChart({
  block,
  caseGradient,
}: {
  block: ChartBlockData;
  caseGradient: string;
}) {
  const max = Math.max(...block.items.map((i) => i.value), 1);
  const bg = barBgClass(block.color, caseGradient);

  return (
    <div className="space-y-4">
      {block.items.map((item) => {
        const pct = (item.value / max) * 100;
        return (
          <div
            key={item.label}
            className="grid grid-cols-[minmax(6rem,1fr)_3fr_auto] items-center gap-3"
          >
            <span className="text-right text-sm text-muted-foreground">{item.label}</span>
            <div className="h-6 overflow-hidden rounded-full bg-muted">
              <div
                className={cn('h-full rounded-full transition-all', bg)}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="w-12 text-sm font-semibold text-foreground">
              {item.value}
              {item.suffix}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Progress ─────────────────────────────────────────────────────────────────

function ProgressChart({ block, caseGradient }: { block: ChartBlockData; caseGradient: string }) {
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

// ─── Line (SVG) ───────────────────────────────────────────────────────────────

function LineChart({ block }: { block: ChartBlockData }) {
  const W = 600;
  const H = 200;
  const PAD = { top: 16, right: 24, bottom: 32, left: 40 };
  const values = block.items.map((i) => i.value);
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const n = values.length;

  const xStep = (W - PAD.left - PAD.right) / Math.max(n - 1, 1);
  const toX = (i: number) => PAD.left + i * xStep;
  const toY = (v: number) => PAD.top + ((max - v) / range) * (H - PAD.top - PAD.bottom);

  const points = values.map((v, i) => `${toX(i)},${toY(v)}`).join(' ');
  const fill = svgColor(block.color);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-hidden="true">
      {/* Gridlines */}
      {[0, 0.25, 0.5, 0.75, 1].map((t) => {
        const y = PAD.top + t * (H - PAD.top - PAD.bottom);
        return (
          <line
            key={t}
            x1={PAD.left}
            y1={y}
            x2={W - PAD.right}
            y2={y}
            stroke="hsl(var(--border))"
            strokeWidth="1"
          />
        );
      })}
      {/* Line */}
      <polyline
        points={points}
        fill="none"
        stroke={fill}
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Dots + labels */}
      {block.items.map((item, i) => {
        const x = toX(i);
        const y = toY(item.value);
        return (
          <g key={item.label}>
            <circle cx={x} cy={y} r={5} fill={fill} />
            <circle cx={x} cy={y} r={3} fill="white" />
            <text
              x={x}
              y={H - 6}
              textAnchor="middle"
              fontSize="11"
              fill="hsl(var(--muted-foreground))"
            >
              {item.label}
            </text>
            <text x={x} y={y - 10} textAnchor="middle" fontSize="11" fontWeight="600" fill={fill}>
              {item.value}
              {item.suffix}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Pie (SVG) ────────────────────────────────────────────────────────────────

function PieChart({ block }: { block: ChartBlockData }) {
  const total = block.items.reduce((s, i) => s + i.value, 0) || 1;
  const R = 60;
  const CX = 80;
  const CY = 80;
  const CIRCUMFERENCE = 2 * Math.PI * R;

  const baseColor = svgColor(block.color);
  const palette = block.items.map((_, idx) => {
    const opacity = 1 - idx * (0.6 / Math.max(block.items.length - 1, 1));
    return opacity;
  });

  const segments = block.items.map((item, i) => {
    const cumulative = block.items.slice(0, i).reduce((s, it) => s + it.value, 0);
    const pct = item.value / total;
    const dash = pct * CIRCUMFERENCE;
    const gap = CIRCUMFERENCE - dash;
    const rotate = (cumulative / total) * 360 - 90;
    return { dash, gap, rotate, opacity: palette[i], item };
  });

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-10">
      <svg viewBox="0 0 160 160" className="w-40 shrink-0" aria-hidden="true">
        {segments.map(({ dash, gap, rotate, opacity, item }) => (
          <circle
            key={item.label}
            cx={CX}
            cy={CY}
            r={R}
            fill="none"
            stroke={baseColor}
            strokeOpacity={opacity}
            strokeWidth="28"
            strokeDasharray={`${dash} ${gap}`}
            transform={`rotate(${rotate} ${CX} ${CY})`}
          />
        ))}
      </svg>
      {/* Legend */}
      <ul className="space-y-2">
        {block.items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-2 text-sm">
            <span
              className="inline-block h-3 w-3 shrink-0 rounded-full"
              style={{ background: baseColor, opacity: palette[i] }}
            />
            <span className="text-muted-foreground">{item.label}</span>
            <span className="ml-auto pl-4 font-semibold text-foreground">
              {item.value}
              {item.suffix}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Dispatcher ───────────────────────────────────────────────────────────────

export function ChartBlock({ block, caseGradient }: ChartBlockProps) {
  return (
    <div className="mx-auto max-w-4xl">
      {block.title && <h2 className="mb-6 text-2xl font-bold md:text-3xl">{block.title}</h2>}
      {block.type === 'bar' && <BarChart block={block} caseGradient={caseGradient} />}
      {block.type === 'horizontal-bar' && (
        <HorizontalBarChart block={block} caseGradient={caseGradient} />
      )}
      {block.type === 'progress' && <ProgressChart block={block} caseGradient={caseGradient} />}
      {block.type === 'line' && <LineChart block={block} />}
      {block.type === 'pie' && <PieChart block={block} />}
    </div>
  );
}
