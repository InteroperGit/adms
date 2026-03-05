import { content, type Content } from '@/types/content';
import { siteData } from '@/types/siteData';

interface AboutCardProps {
  card: Content['about']['card'];
}

export function AboutCard({ card }: AboutCardProps) {
  return (
    <div className="relative flex items-center justify-center">
      {/* Decorative background blob */}
      <div className="absolute h-80 w-80 rounded-full bg-primary/5 blur-3xl" />

      {/* Main card */}
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-white shadow-xl">
        {/* Card header */}
        <div className="bg-primary px-6 py-8">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-2xl font-bold text-white">
            {content.logo.letter}
          </div>
          <p className="text-lg font-semibold text-white">{siteData.name}</p>
          <p className="mt-1 text-sm text-white/70">{card.tagline}</p>
        </div>

        {/* Card body — mini stats */}
        <div className="divide-y divide-border">
          {card.stats.map((item) => (
            <div key={item.label} className="flex items-center justify-between px-6 py-4">
              <span className="text-sm text-muted-foreground">{item.label}</span>
              <span
                style={{ fontFamily: 'var(--font-heading)' }}
                className="font-bold text-foreground"
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Floating accent badge */}
      <div className="absolute bottom-0 right-0 rounded-xl border border-border bg-white px-4 py-3 shadow-lg sm:-bottom-4 sm:-right-4">
        <p className="text-xs text-muted-foreground">{card.nps.label}</p>
        <p
          style={{ fontFamily: 'var(--font-heading)' }}
          className="text-2xl font-bold text-primary"
        >
          {card.nps.value}
        </p>
      </div>
    </div>
  );
}
