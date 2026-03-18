import type { LucideIcon } from 'lucide-react';
import { useCountUp } from '@/hooks/useCountUp';
import { cn } from '@/libs/utils';

interface CountingStatProps {
  value: string;
  label: string;
  icon: LucideIcon;
  animate: boolean;
  index: number;
  isAnimating?: boolean;
}

const STAGGER_DELAY = 200;

/**
 * @component
 * @description Statistic display with icon, animated count-up number, and label text
 * @param {CountingStatProps} props
 * @param {string} props.value - Numeric string with optional suffix (e.g., "150+", "12k")
 * @param {string} props.label - Descriptive label below the count
 * @param {LucideIcon} props.icon - Icon component to display above count
 * @param {boolean} props.animate - Whether to animate count-up from 0 to target number
 * @param {number} props.index - Index of the stat for staggered animation
 * @param {boolean} [props.isAnimating] - Whether this specific stat should have the pulse animation
 * @returns {JSX.Element} Card with icon, animated count, and label
 * @example <caption>Hero section stat with animation</caption>
 * <CountingStat value="150+" label="Happy Clients" icon={Award} index={0} animate={true} isAnimating={true} />
 */
export function CountingStat({
  value,
  label,
  icon: Icon,
  animate,
  index,
  isAnimating = false,
}: CountingStatProps) {
  const match = value.match(/^(\d+)(.*)$/);
  const targetNum = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : value;
  const hasNumber = !!match;

  const delay = index * STAGGER_DELAY;
  const count = useCountUp(targetNum, animate && hasNumber, 1500, delay);
  const isCountingComplete = count === targetNum && animate && hasNumber;

  return (
    <div
      className="rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 dark:border-primary/30 p-6 flex flex-col items-center gap-2"
      style={
        animate
          ? {
              animation: `fade-in 0.5s ease-out forwards`,
              animationDelay: `${delay}ms`,
            }
          : undefined
      }
    >
      <div
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-xl border border-transparent bg-primary/10 text-primary dark:border-primary/50',
          isAnimating && 'animate-cta-pulse-slow'
        )}
      >
        <Icon size={20} />
      </div>
      <div className="flex items-baseline gap-1">
        <span
          className="font-heading text-3xl font-bold text-foreground"
          style={
            isCountingComplete
              ? {
                  animation: `count-pop 0.2s ease-out`,
                }
              : undefined
          }
        >
          {hasNumber ? `${animate ? count : targetNum}` : value}
        </span>
        {isCountingComplete && hasNumber && suffix && (
          <span
            className="font-heading text-3xl font-bold text-foreground"
            style={{
              animation: `suffix-fade-in 0.1s ease-out forwards`,
            }}
          >
            {suffix}
          </span>
        )}
      </div>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}
