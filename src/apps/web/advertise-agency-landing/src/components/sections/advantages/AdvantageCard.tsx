import { ItemCard } from '@/components/ui/ItemCard';
import { SectionIconBox } from '@/components/ui/section/SectionIconBox';
import { ICON_MAP } from '@/types/shared/iconMap';
import type { Advantage } from '@/types/sections/advantages/advantages';

interface AdvantageCardProps {
  item: Advantage;
  index: number;
}

/**
 * @component
 * @description Single advantage card with icon, index number, title, and description
 * @param {AdvantageCardProps} props
 * @param {Advantage} props.item - Advantage object with icon, title, and description
 * @param {number} props.index - Zero-based index used to display padded sequential number
 * @returns {JSX.Element} Card with icon box, sequential number, title, and description text
 * @example <caption>Single advantage in grid</caption>
 * <AdvantageCard item={advantages[0]} index={0} />
 */
export function AdvantageCard({ item, index }: AdvantageCardProps) {
  const Icon = ICON_MAP[item.icon];
  const isEven = index % 2 === 0;
  return (
    <ItemCard className="p-6">
      <div className="mb-4 flex items-center gap-4">
        <SectionIconBox
          icon={Icon}
          size={20}
          variant={isEven ? 'primary' : 'accent'}
          className="icon-shake h-11 w-11 shrink-0"
        />
        <span
          aria-hidden="true"
          className={`font-heading text-3xl font-bold text-foreground/25 dark:text-foreground/40 transition-colors duration-300 ${
            isEven ? 'group-hover:text-primary/40' : 'group-hover:text-accent/40'
          }`}
        >
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <h3 className="mb-2 text-base font-semibold text-foreground">{item.title}</h3>
      <p className="flex-grow text-sm leading-relaxed text-muted-foreground">{item.description}</p>
    </ItemCard>
  );
}
