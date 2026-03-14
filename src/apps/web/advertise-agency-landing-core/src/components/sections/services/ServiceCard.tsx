import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SectionIconBox } from '@/components/ui/section/SectionIconBox';
import { ICON_MAP } from '@/types/shared/iconMap';
import type { Service } from '@/types/sections/services/services';

interface ServiceCardProps {
  service: Service;
}

/**
 * @component
 * @description Individual service card displaying icon, title, and description. Features hover animation (lift effect) and responsive styling.
 * @param {ServiceCardProps} props
 * @param {Service} props.service - Service object with icon key, title, and description
 * @returns {JSX.Element} Card with icon box header and description content
 * @example <caption>Service card</caption>
 * <ServiceCard service={{ icon: 'Zap', title: 'Fast', description: 'Quick delivery' }} />
 */
export function ServiceCard({ service }: ServiceCardProps) {
  const Icon = ICON_MAP[service.icon];
  return (
    <Card className="group border-border bg-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <CardHeader className="pb-3">
        <SectionIconBox icon={Icon} size={22} className="mb-4 h-12 w-12" />
        <CardTitle className="text-lg font-semibold text-foreground">{service.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm leading-relaxed">{service.description}</CardDescription>
      </CardContent>
    </Card>
  );
}
