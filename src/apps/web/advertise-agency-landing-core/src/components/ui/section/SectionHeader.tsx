// src/components/ui/SectionHeader.tsx
import { cn } from '@/lib/utils';
import { SectionBadge } from '@/components/ui/section/SectionBadge';

interface SectionHeaderProps {
  label: string;
  title: string;
  description?: string;
  titleHighlight?: string;
  variant?: 'light' | 'dark';
  className?: string;
}

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
