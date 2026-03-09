import { ICON_MAP } from '@/types/shared/iconMap';
import type { Advantage } from '@/types/sections/advantages';

interface Props {
  item: Advantage;
  index: number;
}

export function AdvantageCard({ item, index }: Props) {
  const Icon = ICON_MAP[item.icon];
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors duration-300 hover:border-primary/40 hover:bg-white/10">
      <div className="mb-4 flex items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
          <Icon size={20} />
        </div>
        <span
          style={{ fontFamily: 'var(--font-heading)' }}
          className="text-3xl font-bold text-white/10"
        >
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <h3 className="mb-2 text-base font-semibold text-white">{item.title}</h3>
      <p className="text-sm leading-relaxed text-white/55">{item.description}</p>
    </div>
  );
}
