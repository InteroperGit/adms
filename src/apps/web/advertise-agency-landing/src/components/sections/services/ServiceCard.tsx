import { ItemCard } from '@/components/ui/ItemCard';
import { SectionIconBox } from '@/components/ui/section/SectionIconBox';
import { ICON_MAP } from '@/types/shared/iconMap';
import type { Service } from '@/types/sections/services/services';

interface ServiceCardProps {
  service: Service;
  index: number;
}

/**
 * @component
 * @description Individual service card displaying icon, title, and description. Features hover animation (lift effect), icon shake on hover, and alternating accent/primary icon colors.
 * @param {ServiceCardProps} props
 * @param {Service} props.service - Service object with icon key, title, and description
 * @param {number} props.index - Zero-based index used to alternate icon colors (odd=accent, even=primary)
 * @returns {JSX.Element} Card with icon box header and description content
 * @example <caption>Service card</caption>
 * <ServiceCard service={{ icon: 'Zap', title: 'Fast', description: 'Quick delivery' }} index={0} />
 */
export function ServiceCard({ service, index }: ServiceCardProps) {
  const Icon = ICON_MAP[service.icon];
  const isOdd = index % 2 === 1;

  return (
    <ItemCard className="p-6">
      <div className="mb-3">
        <SectionIconBox
          icon={Icon}
          size={22}
          variant={isOdd ? 'primary' : 'accent'}
          className="icon-shake mb-4 h-12 w-12"
        />
        <h3 className="text-lg font-semibold text-foreground">{service.title}</h3>
      </div>
      <p className="grow text-sm leading-relaxed text-muted-foreground">{service.description}</p>
    </ItemCard>
  );
}
