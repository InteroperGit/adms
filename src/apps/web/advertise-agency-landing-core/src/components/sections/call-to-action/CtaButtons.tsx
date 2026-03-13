import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { LabeledLink } from '@/types/shared/labeledLink';

interface CtaButtonsProps {
  cta: LabeledLink[];
}

export function CtaButtons({ cta }: CtaButtonsProps) {
  const [primary, secondary] = cta;
  return (
    <div className="flex flex-col justify-center gap-4 sm:flex-row">
      {primary && (
        <Button
          asChild
          size="lg"
          className={cn(
            'w-full animate-cta-pulse-white rounded-full bg-white px-8',
            'text-primary hover:bg-white/90 hover:text-primary sm:w-auto'
          )}
        >
          <a href={primary.href}>
            {primary.label}
            <ArrowRight size={16} className="ml-2" />
          </a>
        </Button>
      )}
      {secondary && (
        <Button
          asChild
          size="lg"
          variant="outline"
          className={cn(
            'w-full rounded-full border-white/40 bg-transparent px-8 text-white',
            'hover:border-white hover:bg-white/10 hover:text-white sm:w-auto'
          )}
        >
          <a href={secondary.href}>{secondary.label}</a>
        </Button>
      )}
    </div>
  );
}
