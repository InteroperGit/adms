import { Link } from 'react-router';
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
 * @description Individual service card linking to a service article with click navigation.
 */
export function ServiceCard({ service, index }: ServiceCardProps) {
  const Icon = ICON_MAP[service.icon];
  const isOdd = index % 2 === 1;

  return (
    <Link to={`/services/${service.slug}`} className="group/card flex h-full cursor-pointer">
      <ItemCard className="w-full p-6">
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
    </Link>
  );
}
