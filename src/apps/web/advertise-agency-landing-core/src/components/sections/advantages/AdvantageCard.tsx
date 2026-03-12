import { ICON_MAP } from '@/types/shared/iconMap';
import type { Advantage } from '@/types/sections/advantages';
import { cn } from '@/lib/utils';

interface Props {
  item: Advantage;
  index: number;
}

export function AdvantageCard({ item, index }: Props) {
  const Icon = ICON_MAP[item.icon];
  return (
    <div
      className={cn(
        'group rounded-2xl border border-border bg-card p-6',
        'transition-colors duration-300 hover:border-primary/40 hover:bg-background'
      )}
    >
      <div className="mb-4 flex items-center gap-4">
        <div
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
            'bg-primary/20 text-primary',
            'transition-colors duration-300 group-hover:bg-primary group-hover:text-white'
          )}
        >
          <Icon size={20} />
        </div>
        <span
          aria-hidden="true"
          style={{ fontFamily: 'var(--font-heading)' }}
          className="text-3xl font-bold text-foreground/10"
        >
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <h3 className="mb-2 text-base font-semibold text-foreground">{item.title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
    </div>
  );
}
