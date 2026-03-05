import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CtaLink {
  label: string;
  href: string;
}

interface Props {
  cta: [CtaLink, CtaLink];
}

export function CtaButtons({ cta }: Props) {
  return (
    <div className="flex flex-col justify-center gap-4 sm:flex-row">
      <Button
        asChild
        size="lg"
        className="w-full rounded-full bg-white px-8 text-primary hover:bg-white/90 hover:text-primary sm:w-auto"
      >
        <a href={cta[0].href}>
          {cta[0].label}
          <ArrowRight size={16} className="ml-2" />
        </a>
      </Button>
      <Button
        asChild
        size="lg"
        variant="outline"
        className="w-full rounded-full border-white/40 bg-transparent px-8 text-white hover:border-white hover:bg-white/10 hover:text-white sm:w-auto"
      >
        <a href={cta[1].href}>{cta[1].label}</a>
      </Button>
    </div>
  );
}
