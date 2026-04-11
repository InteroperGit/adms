import { cn } from '@/libs/utils';

interface SectionBadgeProps {
  label: string;
  variant?: 'light' | 'dark' | 'accent';
  dot?: boolean;
  className?: string;
}

/**
 * @component
 * @description Small decorative label badge typically used above section headings
 * @param {SectionBadgeProps} props
 * @param {string} props.label - Badge text
 * @param {'light'|'dark'} [props.variant='light'] - Color scheme
 * @param {boolean} [props.dot=false] - Show animated dot indicator before label
 * @param {string} [props.className] - Additional classes
 * @returns {JSX.Element} Rounded pill badge with border and background
 * @example
 * <SectionBadge label="Our Services" variant="light" />
 * <SectionBadge label="Featured" dot variant="light" />
 */
export function SectionBadge({
  label,
  variant = 'light',
  dot = false,
  className,
}: SectionBadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium',
        variant === 'dark'
          ? 'border border-white/10 bg-white/10 text-white/80'
          : variant === 'accent'
            ? 'border border-accent/20 bg-accent/5 text-accent dark:border-accent/50'
            : 'border border-primary/20 bg-primary/5 text-primary dark:border-primary/50',
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            'h-1.5 w-1.5 rounded-full',
            variant === 'accent' ? 'bg-accent' : 'bg-primary'
          )}
          data-testid="dot-indicator"
        />
      )}
      {label}
    </div>
  );
}
