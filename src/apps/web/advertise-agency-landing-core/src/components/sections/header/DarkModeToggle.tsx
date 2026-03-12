import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button.tsx';

interface Props {
  isDark: boolean;
  onToggle: () => void;
  className?: string;
}

export function DarkModeToggle({ isDark, onToggle, className }: Props) {
  return (
    <Button
      onClick={onToggle}
      aria-label={isDark ? 'Светлый режим' : 'Тёмный режим'}
      className={cn(
        'flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-border',
        'bg-muted text-muted-foreground transition-colors',
        'dark:border-white/30 dark:bg-neutral-900 dark:text-white/75 dark:hover:bg-neutral-800 dark:hover:text-white/80',
        'hover:bg-neutral-200 hover:text-foreground',
        className
      )}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </Button>
  );
}
