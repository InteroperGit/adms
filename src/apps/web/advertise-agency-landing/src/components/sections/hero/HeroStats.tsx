import { Award, TrendingUp, Users } from 'lucide-react';
import { useRandomButtonHighlight } from '@/hooks/useRandomButtonHighlight';
import { useViewportAnimation } from '@/hooks/useViewportAnimation';
import { CountingStat } from './CountingStat';

const STAT_ICONS = [Award, TrendingUp, Users];

interface HeroStatsProps {
  stats: { value: string; label: string }[];
}

/**
 * @component
 * @description Grid of statistics with count-up animations triggered on scroll into view
 * @param {HeroStatsProps} props
 * @param {{ value: string; label: string }[]} props.stats - Array of stat objects (up to 3 items)
 * @returns {JSX.Element} Three-column grid with CountingStat components and staggered animations
 * @example <caption>Hero stats section</caption>
 * <HeroStats stats={[{ value: "150+", label: "Clients" }, { value: "200+", label: "Projects" }, { value: "10+", label: "Years" }]} />
 */
export function HeroStats({ stats }: HeroStatsProps) {
  const [ref, hasAnimated] = useViewportAnimation({ threshold: 0.3 });
  const animatingIndex = useRandomButtonHighlight(hasAnimated ? stats.length : 0);

  return (
    <div ref={ref} className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
      {stats.map((stat, i) => {
        const Icon = STAT_ICONS[i] ?? Award;
        return (
          <CountingStat
            key={stat.label}
            value={stat.value}
            label={stat.label}
            icon={Icon}
            animate={hasAnimated}
            index={i}
            isAnimating={animatingIndex === i}
          />
        );
      })}
    </div>
  );
}
