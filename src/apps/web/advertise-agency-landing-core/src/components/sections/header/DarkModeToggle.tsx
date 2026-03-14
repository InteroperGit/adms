import { Sun, Moon } from 'lucide-react';
import { cn } from '@/libs/utils';
import { Button } from '@/components/ui/button';

interface DarkModeToggleProps {
  isDark: boolean;
  onToggle: () => void;
  className?: string;
}

/**
 * @component
 * @description Toggle button for switching between light and dark color modes
 * @param {DarkModeToggleProps} props
 * @param {boolean} props.isDark - Current dark mode state
 * @param {() => void} props.onToggle - Callback when toggle button clicked
 * @param {string} [props.className] - Optional additional CSS classes
 * @returns {JSX.Element} Icon button showing sun (dark mode on) or moon (light mode on)
 * @example <caption>Dark mode toggle in header</caption>
 * <DarkModeToggle isDark={isDark} onToggle={handleToggle} />
 */
export function DarkModeToggle({ isDark, onToggle, className }: DarkModeToggleProps) {
  return (
    <Button
      variant="ghost"
      onClick={onToggle}
      aria-label={isDark ? 'Светлый режим' : 'Тёмный режим'}
      className={cn(
        'h-11 w-11 rounded-xl border border-border bg-muted text-muted-foreground',
        'hover:bg-neutral-200 hover:text-foreground',
        'dark:border-white/30 dark:bg-neutral-900 dark:text-white/75',
        'dark:hover:bg-neutral-800 dark:hover:text-white/80',
        className
      )}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </Button>
  );
}
