import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroCTAProps {
  cta: { label: string; href: string }[];
}

export function HeroCTA({ cta }: HeroCTAProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
      <Button asChild size="lg" className="rounded-full px-8">
        <a href={cta[0].href}>
          {cta[0].label}
          <ArrowRight size={16} />
        </a>
      </Button>
      <Button
        asChild
        variant="outline"
        size="lg"
        className="rounded-full px-8 hover:bg-muted hover:text-primary"
      >
        <a href={cta[1].href}>{cta[1].label}</a>
      </Button>
    </div>
  );
}
