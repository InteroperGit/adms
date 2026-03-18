import { type AboutSectionContent } from '@/types/sections/about/aboutContent';
import { Logo } from '@/components/ui/Logo';
import { cn } from '@/libs/utils';

interface AboutCardProps {
  card: AboutSectionContent['card'];
}

/**
 * @component
 * @description Visual card component displaying company logo, tagline, and mini statistics
 * @param {AboutCardProps} props
 * @param {AboutSectionContent['card']} props.card - Card data with logo tagline and stats array
 * @returns {JSX.Element} Elevated card with decorative background blobs, rotating ring, logo header, and divided stats rows
 * @example <caption>About section company card</caption>
 * <AboutCard card={aboutContent.card} />
 */
export function AboutCard({ card }: AboutCardProps) {
  return (
    <div className="relative flex items-center justify-center">
      {/* Decorative background blobs — z-0 (behind card) */}
      <div className="absolute inset-0 h-80 w-80 z-0 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 z-0 rounded-full bg-accent/15 blur-3xl" />

      {/* Rotating ring — z-0 (behind card), slow-spin animation */}
      <div className="absolute -inset-4 h-96 w-96 z-0 rounded-full border-2 border-dashed border-primary/20" />

      {/* Main card */}
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-card/95 backdrop-blur-sm shadow-2xl">
        {/* Card header */}
        <div className="border-b border-border/50 bg-linear-to-r from-background to-card/50 px-6 py-8 dark:bg-primary/10">
          <Logo className="mb-3 h-12 w-42" />
          <p className="mt-2 text-sm font-medium text-muted-foreground">{card.tagline}</p>
        </div>

        {/* Card body — mini stats with pulse animation */}
        <div className="divide-y divide-border/50 p-1">
          {card.stats.map((item) => (
            <div
              key={item.label}
              className={cn(
                'group flex items-center justify-between px-6 py-5 border-l-4 border-l-transparent transition-all duration-300'
              )}
            >
              <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground/80">
                {item.label}
              </span>
              <span className="font-heading text-lg font-black text-foreground drop-shadow-sm">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
