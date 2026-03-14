import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroCTAProps {
  cta: { label: string; href: string }[];
}

/**
 * @component
 * @description Call-to-action button group with primary and secondary action options
 * @param {HeroCTAProps} props
 * @param {{ label: string; href: string }[]} props.cta - Array of up to two CTA objects [primary, secondary]
 * @returns {JSX.Element} Responsive flex layout with primary filled button and secondary outline button
 * @example <caption>Hero section CTA buttons</caption>
 * <HeroCTA cta={[{ label: "Get Started", href: "/#contact" }, { label: "Learn More", href: "/about" }]} />
 */
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
