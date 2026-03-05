// src/components/ui/SectionHeader.tsx
import { cn } from '@/lib/utils';

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
      <div
        className={cn(
          'mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium',
          isDark
            ? 'border border-white/10 bg-white/10 text-white/80'
            : 'border border-primary/20 bg-primary/5 text-primary'
        )}
      >
        {label}
      </div>
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
