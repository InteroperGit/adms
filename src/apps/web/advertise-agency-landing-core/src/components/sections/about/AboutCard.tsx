import { type AboutSectionContent } from '@/types/sections/aboutContent';
import { headerContent } from '@/types/sections/header';
import { siteData } from '@/types/config/siteData';

interface AboutCardProps {
  card: AboutSectionContent['card'];
}

export function AboutCard({ card }: AboutCardProps) {
  return (
    <div className="relative flex items-center justify-center">
      {/* Decorative background blob */}
      <div className="absolute h-80 w-80 rounded-full bg-primary/5 blur-3xl" />

      {/* Main card */}
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
        {/* Card header */}
        <div className="bg-primary px-6 py-8">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-2xl font-bold text-white">
            {headerContent.logo.letter}
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
    </div>
  );
}
