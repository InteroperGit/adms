import { useEffect, useRef, useState } from 'react';
import { type AboutSectionContent } from '@/types/sections/about/aboutContent';
import { Logo } from '@/components/ui/Logo';
import { useInViewport } from '@/hooks/useInViewport';
import { cn } from '@/libs/utils';

interface AboutCardProps {
  card: AboutSectionContent['card'];
}

/**
 * @component
 * @description Visual card component displaying company logo, tagline, and mini statistics
 * @param {AboutCardProps} props
 * @param {AboutSectionContent['card']} props.card - Card data with logo tagline and stats array
 * @returns {JSX.Element} Elevated card with decorative background blob, logo header, and divided stats rows
 * @example <caption>About section company card</caption>
 * <AboutCard card={aboutContent.card} />
 */
export function AboutCard({ card }: AboutCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInViewport = useInViewport(cardRef);
  const [animatingIndex, setAnimatingIndex] = useState<number>(0);

  useEffect(() => {
    if (!isInViewport) {
      return;
    }

    const interval = setInterval(() => {
      setAnimatingIndex((prev) => (prev + 1) % card.stats.length);
    }, 2500); // Duration of one pulse animation

    return () => clearInterval(interval);
  }, [isInViewport, card.stats.length]);

  return (
    <div ref={cardRef} className="relative flex items-center justify-center">
      {/* Decorative background blob */}
      <div className="absolute h-80 w-80 rounded-full bg-primary/5 blur-3xl" />

      {/* Main card */}
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
        {/* Card header */}
        <div className="border-b border-primary bg-card px-6 py-8 dark:bg-primary/15">
          <Logo className="mb-3" />
          <p className="mt-1 text-sm text-muted-foreground">{card.tagline}</p>
        </div>

        {/* Card body — mini stats */}
        <div className="divide-y divide-border">
          {card.stats.map((item, index) => (
            <div
              key={item.label}
              className={cn(
                'flex items-center justify-between px-6 py-4 border-l-4 border-l-primary/30 transition-colors',
                animatingIndex === index && isInViewport && 'animate-cta-pulse'
              )}
            >
              <span className="text-sm text-muted-foreground">{item.label}</span>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                }}
                className="font-bold text-foreground"
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
