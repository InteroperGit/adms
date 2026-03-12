import { cn } from '@/lib/utils';

interface SectionBadgeProps {
  label: string;
  variant?: 'light' | 'dark';
  className?: string;
}

export function SectionBadge({ label, variant = 'light', className }: SectionBadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium',
        variant === 'dark'
          ? 'border border-white/10 bg-white/10 text-white/80'
          : 'border border-primary/20 bg-primary/5 text-primary',
        className
      )}
    >
      {label}
    </div>
  );
}
