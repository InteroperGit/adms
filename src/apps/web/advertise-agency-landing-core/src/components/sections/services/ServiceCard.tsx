import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ICON_MAP } from '@/lib/iconMap';
import type { Service } from '@/lib/services';

interface Props {
  service: Service;
}

export function ServiceCard({ service }: Props) {
  const Icon = ICON_MAP[service.icon];
  return (
    <Card className="group border-border bg-white transition-shadow duration-300 hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
          <Icon size={22} />
        </div>
        <CardTitle className="text-lg font-semibold text-foreground">{service.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm leading-relaxed">{service.description}</CardDescription>
      </CardContent>
    </Card>
  );
}
