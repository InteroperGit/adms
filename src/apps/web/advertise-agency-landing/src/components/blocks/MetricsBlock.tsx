import { useMemo } from 'react';
import { cn } from '@/libs/utils';
import { useCountUp } from '@/hooks/useCountUp';
import { useViewportAnimation } from '@/hooks/useViewportAnimation';
import type { MetricsBlock as MetricsBlockData } from '@/types/blocks';

const HIDDEN_STYLE: React.CSSProperties = { opacity: 0 };
const STAGGER_ANIMATION_BASE = {
  animationName: 'stagger-fade-in',
  animationDuration: '0.5s',
  animationTimingFunction: 'ease-out',
  animationFillMode: 'both',
} satisfies React.CSSProperties;
const COUNT_POP_STYLE: React.CSSProperties = { animation: 'count-pop 0.2s ease-out' };
const SUFFIX_FADE_STYLE: React.CSSProperties = {
  animation: 'suffix-fade-in 0.1s ease-out forwards',
};

interface MetricsBlockProps {
  block: MetricsBlockData;
  caseGradient: string;
}

interface ColorConfig {
  colored: boolean;
  isGradient: boolean;
  isSolid: boolean;
  isPrimary: boolean;
  isAccent: boolean;
  gradientStops: string;
  metricTextColor: string;
  labelTextColor: string;
  descriptionTextColor: string;
}

interface MetricCardProps {
  metric: string;
  label: string;
  description: string;
  index: number;
  animate: boolean;
  colorConfig: ColorConfig;
}

function MetricCard({ metric, label, description, index, animate, colorConfig }: MetricCardProps) {
  const {
    colored,
    isGradient,
    isSolid,
    isPrimary,
    isAccent,
    gradientStops,
    metricTextColor,
    labelTextColor,
    descriptionTextColor,
  } = colorConfig;
  const { prefix, targetNum, suffix, hasNumber } = useMemo(() => {
    const m = metric.match(/^([^\d]*)(\d+(?:[.,]\d+)?)(.*)$/);
    const num = m ? Math.round(parseFloat(m[2].replace(',', '.'))) : 0;
    return {
      prefix: m ? m[1] : '',
      targetNum: num,
      suffix: m ? m[3] : '',
      hasNumber: !!m && num > 0,
    };
  }, [metric]);

  const count = useCountUp(targetNum, animate && hasNumber, 1200, index * 150);
  const isCountingComplete = hasNumber && animate && count === targetNum;

  return (
    <div
      className={cn(
        'rounded-2xl p-6',
        isGradient && cn('bg-gradient-to-br', gradientStops),
        (isSolid || isPrimary) && 'bg-primary',
        isAccent && 'bg-accent',
        !colored && 'border border-border bg-card shadow-sm'
      )}
      style={
        animate ? { ...STAGGER_ANIMATION_BASE, animationDelay: `${index * 80}ms` } : HIDDEN_STYLE
      }
    >
      {animate && hasNumber ? (
        <div className="flex items-baseline gap-0.5">
          {prefix && (
            <span className={cn('text-4xl font-bold leading-none', metricTextColor)}>{prefix}</span>
          )}
          <span
            className={cn('text-4xl font-bold leading-none', metricTextColor)}
            style={isCountingComplete ? COUNT_POP_STYLE : undefined}
          >
            {count}
          </span>
          {isCountingComplete && suffix && (
            <span
              className={cn('text-4xl font-bold leading-none', metricTextColor)}
              style={SUFFIX_FADE_STYLE}
            >
              {suffix}
            </span>
          )}
        </div>
      ) : (
        <p className={cn('text-4xl font-bold leading-none', metricTextColor)}>{metric}</p>
      )}
      <p className={cn('mt-1 text-sm font-medium uppercase tracking-widest', labelTextColor)}>
        {label}
      </p>
      <p className={cn('mt-3 text-sm', descriptionTextColor)}>{description}</p>
    </div>
  );
}

/**
 * @component
 * @description Grid of key metrics with scroll-triggered count-up animation, value, label and description, supporting gradient/solid coloring
 * @param {MetricsBlockProps} props
 * @param {MetricsBlockData} props.block - Metrics block with title and items (metric, label, description)
 * @param {string} props.caseGradient - Fallback gradient for colored metrics
 * @returns {JSX.Element} Metrics grid with animated count-up on scroll entry
 * @example
 * <MetricsBlock block={metricsData} caseGradient="from-blue-500 to-purple-500" />
 */
export function MetricsBlock({ block, caseGradient }: MetricsBlockProps) {
  const color = block.color;
  const bgColor = color?.background;
  const isGradient = bgColor?.type === 'gradient';
  const isSolid = bgColor?.type === 'solid';
  const isPrimary = bgColor?.type === 'primary';
  const isAccent = bgColor?.type === 'accent';
  const colored = isGradient || isSolid || isPrimary || isAccent;

  const colorConfig: ColorConfig = {
    colored,
    isGradient,
    isSolid,
    isPrimary,
    isAccent,
    gradientStops: bgColor?.value ?? caseGradient,
    metricTextColor: color?.metric || (colored ? 'text-white' : 'text-primary'),
    labelTextColor: color?.label || (colored ? 'text-white/70' : 'text-muted-foreground'),
    descriptionTextColor:
      color?.description || (colored ? 'text-white/80' : 'text-muted-foreground'),
  };

  const [ref, hasAnimated] = useViewportAnimation({ threshold: 0.2 });

  return (
    <div className="mx-auto max-w-4xl">
      {block.title && <h2 className="mb-8 text-2xl font-bold md:text-3xl">{block.title}</h2>}
      <div ref={ref} className="grid gap-4 sm:grid-cols-3 sm:gap-6">
        {block.items.map(({ metric, label, description }, index) => (
          <MetricCard
            key={metric}
            metric={metric}
            label={label}
            description={description}
            index={index}
            animate={hasAnimated}
            colorConfig={colorConfig}
          />
        ))}
      </div>
    </div>
  );
}
