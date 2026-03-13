import type { LucideIcon } from 'lucide-react';
import { useCountUp } from '@/hooks/useCountUp';

interface CountingStatProps {
  value: string;
  label: string;
  icon: LucideIcon;
  animate: boolean;
}

export function CountingStat({ value, label, icon: Icon, animate }: CountingStatProps) {
  const match = value.match(/^(\d+)(.*)$/);
  const targetNum = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : value;
  const hasNumber = !!match;

  const count = useCountUp(targetNum, animate && hasNumber);

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
