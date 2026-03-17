import { ItemCard } from '@/components/ui/ItemCard';
import { SectionIconBox } from '@/components/ui/section/SectionIconBox';
import { ICON_MAP } from '@/types/shared/iconMap';
import type { Service } from '@/types/sections/services/services';

interface ServiceCardProps {
  service: Service;
}

/**
 * @component
 * @description Individual service card displaying icon, title, and description. Features hover animation (lift effect) and icon shake on hover.
 * @param {ServiceCardProps} props
 * @param {Service} props.service - Service object with icon key, title, and description
 * @returns {JSX.Element} Card with icon box header and description content
 * @example <caption>Service card</caption>
 * <ServiceCard service={{ icon: 'Zap', title: 'Fast', description: 'Quick delivery' }} />
 */
export function ServiceCard({ service }: ServiceCardProps) {
  const Icon = ICON_MAP[service.icon];

  return (
    <ItemCard className="p-6">
      <div className="mb-3">
        <SectionIconBox icon={Icon} size={22} className="icon-shake mb-4 h-12 w-12" />
        <h3 className="text-lg font-semibold text-foreground">{service.title}</h3>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">{service.description}</p>
    </ItemCard>
  );
}
