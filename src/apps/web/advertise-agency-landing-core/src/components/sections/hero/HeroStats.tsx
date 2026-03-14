import { useEffect, useRef, useState } from 'react';
import { Award, TrendingUp, Users } from 'lucide-react';
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
 * @returns {JSX.Element} Three-column grid with divider top and CountingStat components
 * @example <caption>Hero stats section</caption>
 * <HeroStats stats={[{ value: "150+", label: "Clients" }, { value: "200+", label: "Projects" }, { value: "10+", label: "Years" }]} />
 */
export function HeroStats({ stats }: HeroStatsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const raf = requestAnimationFrame(() => setHasAnimated(true));
      return () => cancelAnimationFrame(raf);
    }
    const el = ref.current;
    if (!el) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="mt-16 grid grid-cols-1 gap-6 border-t border-border pt-12 sm:grid-cols-3"
    >
      {stats.map((stat, i) => {
        const Icon = STAT_ICONS[i] ?? Award;
        return (
          <CountingStat
            key={stat.label}
            value={stat.value}
            label={stat.label}
            icon={Icon}
            animate={hasAnimated}
          />
        );
      })}
    </div>
  );
}
