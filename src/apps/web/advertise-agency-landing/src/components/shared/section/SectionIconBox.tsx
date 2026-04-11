// src/components/ui/SectionIconBox.tsx
import { cn } from '@/libs/utils';
import type { IconComponent } from '@/types/shared/iconMap';

interface SectionIconBoxProps {
  icon: IconComponent;
  size?: number;
  variant?: 'primary' | 'accent';
  className?: string;
}

/**
 * @component
 * @description Rounded box container for displaying a single icon with hover-to-primary/accent animation
 * @param {SectionIconBoxProps} props
 * @param {IconComponent} props.icon - Lucide icon component
 * @param {number} [props.size=22] - Icon size in pixels
 * @param {'primary'|'accent'} [props.variant='primary'] - Icon color variant
 * @param {string} [props.className] - Additional container classes
 * @returns {JSX.Element} Rounded box with icon and interactive hover state
 * @example
 * <SectionIconBox icon={CheckCircle} size={24} />
 * <SectionIconBox icon={CheckCircle} size={24} variant="accent" />
 */
export function SectionIconBox({
  icon: Icon,
  size = 22,
  variant = 'primary',
  className,
}: SectionIconBoxProps) {
  const isAccent = variant === 'accent';
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-xl',
        isAccent
          ? 'border border-accent/20 dark:border-accent/50 bg-accent/10 text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-white group-hover:border-transparent'
          : 'border border-primary/20 dark:border-primary/50 bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white group-hover:border-transparent',
        className
      )}
    >
      <Icon size={size} />
    </div>
  );
}
