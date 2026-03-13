// src/components/ui/SectionIconBox.tsx
import { cn } from '@/lib/utils';
import type { IconComponent } from '@/types/shared/iconMap';

interface SectionIconBoxProps {
  icon: IconComponent;
  size?: number;
  className?: string;
}

export function SectionIconBox({ icon: Icon, size = 22, className }: SectionIconBoxProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-xl',
        'border border-primary/20 dark:border-primary/50',
        'bg-primary/10 text-primary',
        'transition-colors duration-300 group-hover:bg-primary group-hover:text-white group-hover:border-transparent',
        className
      )}
    >
      <Icon size={size} />
    </div>
  );
}
