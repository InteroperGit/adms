import { SectionIconBox } from '@/components/ui/section/SectionIconBox';
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
        <SectionIconBox icon={Icon} size={20} className="h-11 w-11 shrink-0" />
        <span
          aria-hidden="true"
          style={{ fontFamily: 'var(--font-heading)' }}
          className="text-3xl font-bold text-foreground/25 dark:text-foreground/40"
        >
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <h3 className="mb-2 text-base font-semibold text-foreground">{item.title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
    </div>
  );
}
