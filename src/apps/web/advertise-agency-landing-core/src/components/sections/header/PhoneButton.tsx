import { cn } from '@/lib/utils';
import { resolveIcon } from '@/types/shared/iconMap';
import { siteData } from '@/types/config/siteData';

const PhoneIcon = resolveIcon('Phone');

interface Props {
  highlighted?: boolean;
  /** sm = h-10 w-10 rounded-lg (mobile top bar); md = h-11 w-11 rounded-xl shadow-sm (default) */
  size?: 'sm' | 'md';
  className?: string;
}

export function PhoneButton({ highlighted, size = 'md', className }: Props) {
  return (
    <a
      href={`tel:${siteData.contact.phone}`}
      aria-label="Позвонить"
      className={cn(
        'flex items-center justify-center border',
        'bg-green-500/5 text-green-600',
        'border-green-500/25',
        'dark:border-green-400/50 dark:text-green-400',
        'transition-colors hover:bg-green-500/10 dark:hover:bg-green-400/15',
        size === 'sm' ? 'h-10 w-10 rounded-lg' : 'h-11 w-11 rounded-xl shadow-sm',
        highlighted && 'animate-pulse-green',
        className
      )}
    >
      {PhoneIcon && <PhoneIcon size={size === 'sm' ? 18 : 16} />}
    </a>
  );
}
