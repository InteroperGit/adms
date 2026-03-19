import { type AboutSectionContent } from '@/types/sections/about/aboutContent';
import { Logo } from '@/components/ui/Logo';
import { cn } from '@/libs/utils';

interface AboutCardProps {
  card: AboutSectionContent['card'];
}

function AboutCardDecorations() {
  return (
    <>
      <div className="absolute inset-0 z-0 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
      <div
        className={cn(
          'absolute -bottom-24 -right-24 z-0 h-72 w-72',
          'rounded-full bg-accent/15 blur-3xl'
        )}
      />
      <div
        className={cn(
          'absolute -inset-4 z-0 h-96 w-96',
          'rounded-full border-2 border-dashed border-primary/20'
        )}
      />
    </>
  );
}

interface AboutCardHeaderProps {
  tagline: string;
}

function AboutCardHeader({ tagline }: AboutCardHeaderProps) {
  return (
    <div
      className={cn(
        'border-b border-border/50 px-6 py-8 dark:bg-primary/10',
        'bg-linear-to-r from-background to-card/50'
      )}
    >
      <Logo className="mb-3 h-12 w-42" />
      <p className="mt-2 text-sm font-medium text-muted-foreground">{tagline}</p>
    </div>
  );
}

interface AboutCardStatRowProps {
  label: string;
  value: string;
}

function AboutCardStatRow({ label, value }: AboutCardStatRowProps) {
  return (
    <div
      className={cn(
        'group flex items-center justify-between px-6 py-5',
        'border-l-4 border-l-transparent transition-all duration-300'
      )}
    >
      <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground/80">
        {label}
      </span>
      <span className="font-heading text-lg font-black text-foreground drop-shadow-sm">
        {value}
      </span>
    </div>
  );
}

interface AboutCardPanelProps {
  card: AboutSectionContent['card'];
}

function AboutCardPanel({ card }: AboutCardPanelProps) {
  return (
    <div
      className={cn(
        'relative w-full max-w-sm overflow-hidden rounded-2xl shadow-md',
        'border border-border bg-card/95 backdrop-blur-sm'
      )}
    >
      <AboutCardHeader tagline={card.tagline} />

      <div className="divide-y divide-border/50 p-1">
        {card.stats.map((item) => (
          <AboutCardStatRow key={item.label} label={item.label} value={item.value} />
        ))}
      </div>
    </div>
  );
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
      <div className="hidden sm:contents">
        <AboutCardDecorations />
      </div>

      <AboutCardPanel card={card} />
    </div>
  );
}
