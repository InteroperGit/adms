import { Award, TrendingUp, Users } from 'lucide-react';

const STAT_ICONS = [Award, TrendingUp, Users];

interface HeroStatsProps {
  stats: { value: string; label: string }[];
}

export function HeroStats({ stats }: HeroStatsProps) {
  return (
    <div className="mt-16 grid grid-cols-1 gap-6 border-t border-border pt-12 sm:grid-cols-3">
      {stats.map((stat, i) => {
        const Icon = STAT_ICONS[i] ?? Award;
        return (
          <div key={stat.label} className="flex flex-col items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon size={20} />
            </div>
            <span
              style={{ fontFamily: 'var(--font-heading)' }}
              className="text-3xl font-bold text-foreground"
            >
              {stat.value}
            </span>
            <span className="text-sm text-muted-foreground">{stat.label}</span>
          </div>
        );
      })}
    </div>
  );
}
