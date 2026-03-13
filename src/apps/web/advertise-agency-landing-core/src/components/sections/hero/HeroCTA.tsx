import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroCTAProps {
  cta: { label: string; href: string }[];
}

export function HeroCTA({ cta }: HeroCTAProps) {
  const [primary, secondary] = cta;
  return (
    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
      {primary && (
        <Button asChild size="lg" className="animate-cta-pulse rounded-full px-8">
          <a href={primary.href}>
            {primary.label}
            <ArrowRight size={16} />
          </a>
        </Button>
      )}
      {secondary && (
        <Button
          asChild
          variant="outline"
          size="lg"
          className="rounded-full px-8 hover:bg-muted hover:text-primary"
        >
          <a href={secondary.href}>{secondary.label}</a>
        </Button>
      )}
    </div>
  );
}
