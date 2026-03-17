import type { LucideIcon } from 'lucide-react';
import { useCountUp } from '@/hooks/useCountUp';
import { cn } from '@/libs/utils';

interface CountingStatProps {
  value: string;
  label: string;
  icon: LucideIcon;
  animate: boolean;
  isAnimating?: boolean;
}

/**
 * @component
 * @description Statistic display with icon, animated count-up number, and label text
 * @param {CountingStatProps} props
 * @param {string} props.value - Numeric string with optional suffix (e.g., "150+", "12k")
 * @param {string} props.label - Descriptive label below the count
 * @param {LucideIcon} props.icon - Icon component to display above count
 * @param {boolean} props.animate - Whether to animate count-up from 0 to target number
 * @param {boolean} [props.isAnimating] - Whether this specific stat should have the pulse animation
 * @returns {JSX.Element} Vertically centered icon, animated count, and label
 * @example <caption>Hero section stat with animation</caption>
 * <CountingStat value="150+" label="Happy Clients" icon={Award} animate={true} isAnimating={true} />
 */
export function CountingStat({
  value,
  label,
  icon: Icon,
  animate,
  isAnimating = false,
}: CountingStatProps) {
  const match = value.match(/^(\d+)(.*)$/);
  const targetNum = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : value;
  const hasNumber = !!match;

  const count = useCountUp(targetNum, animate && hasNumber);

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-xl border border-transparent bg-primary/10 text-primary dark:border-primary/50',
          isAnimating && 'animate-cta-pulse-slow'
        )}
      >
        <Icon size={20} />
      </div>
      <span
        style={{ fontFamily: 'var(--font-heading)' }}
        className="text-3xl font-bold text-foreground"
      >
        {hasNumber ? `${animate ? count : targetNum}${suffix}` : value}
      </span>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}
