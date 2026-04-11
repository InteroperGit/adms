// src/components/ui/SectionHeader.tsx
import { cn } from '@/libs/utils';
import { SectionBadge } from '@/components/shared/section/SectionBadge';

interface SectionHeaderProps {
  label: string;
  title: string;
  description?: string;
  titleHighlight?: string;
  variant?: 'light' | 'dark';
  className?: string;
}

/**
 * @component
 * @description Section heading with badge, title, optional highlight span and description text
 * @param {SectionHeaderProps} props
 * @param {string} props.label - Badge text
 * @param {string} props.title - Main heading text
 * @param {string} [props.description] - Optional subtitle/description
 * @param {string} [props.titleHighlight] - Portion of title to render in primary color
 * @param {'light'|'dark'} [props.variant='light'] - Visual theme
 * @param {string} [props.className] - Additional classes
 * @returns {JSX.Element} Centered heading container
 * @example
 * <SectionHeader label="Featured" title="Our Services" description="Professional solutions" titleHighlight="Services" />
 */
export function SectionHeader({
  label,
  title,
  description,
  titleHighlight,
  variant = 'light',
  className,
}: SectionHeaderProps) {
  const isDark = variant === 'dark';

  return (
    <div className={cn('mx-auto max-w-2xl text-center', className)}>
      <SectionBadge label={label} variant={variant} className="mb-4" />
      <h2 className={cn('mb-4', isDark && 'text-white')}>
        {title}
        {titleHighlight && <span className="text-primary">{titleHighlight}</span>}
      </h2>
      {description && (
        <p className={isDark ? 'text-white/60' : 'text-muted-foreground'}>{description}</p>
      )}
    </div>
  );
}
