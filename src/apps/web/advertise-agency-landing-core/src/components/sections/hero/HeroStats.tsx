import { useEffect, useRef, useState } from 'react';
import { Award, TrendingUp, Users } from 'lucide-react';

const STAT_ICONS = [Award, TrendingUp, Users];

interface CountingStatProps {
  value: string;
  label: string;
  icon: typeof Award;
  animate: boolean;
}

function CountingStat({ value, label, icon: Icon, animate }: CountingStatProps) {
  const match = value.match(/^(\d+)(.*)$/);
  const targetNum = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : value;
  const hasNumber = !!match;

  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!animate || !hasNumber) {
      return;
    }
    const duration = 1500;
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setCount(Math.round(eased * targetNum));
      if (progress >= 1) {
        clearInterval(timer);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [animate, targetNum, hasNumber]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon size={20} />
      </div>
      <span
        style={{ fontFamily: 'var(--font-heading)' }}
        className="text-3xl font-bold text-foreground"
      >
        {hasNumber ? `${animate ? count : targetNum}${suffix}` : value}
      </span>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}

interface HeroStatsProps {
  stats: { value: string; label: string }[];
}

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
