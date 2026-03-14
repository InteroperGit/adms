import { Phone, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

const PHONE = {
  dark: 'border-green-400/50 bg-green-400/5 text-green-400 hover:bg-green-400/15',
  light:
    'border-green-500/25 bg-green-500/5 text-green-600 hover:bg-green-500/10 dark:border-green-400/50 dark:text-green-400 dark:hover:bg-green-400/15',
};

const TG = {
  dark: 'border-[#2AABEE]/50 bg-[#2AABEE]/5 text-[#2AABEE] hover:bg-[#2AABEE]/15',
  light:
    'border-[#2AABEE]/20 bg-[#2AABEE]/5 text-[#2AABEE] hover:bg-[#2AABEE]/10 dark:border-[#2AABEE]/50 dark:hover:bg-[#2AABEE]/15',
};

const VK = {
  dark: 'border-[#0077FF]/50 bg-[#0077FF]/5 text-[#0077FF] hover:bg-[#0077FF]/15',
  light:
    'border-[#0077FF]/20 bg-[#0077FF]/5 text-[#0077FF] hover:bg-[#0077FF]/10 dark:border-[#0077FF]/50 dark:hover:bg-[#0077FF]/15',
};

function VkIcon({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14C20.67 22 22 20.67 22 15.07V8.93C22 3.33 20.67 2 15.07 2zm3.08 13.37h-1.57c-.6 0-.78-.48-1.85-1.57-1-.93-1.4-.93-1.64-.93s-.3.06-.3.4v1.44c0 .29-.1.46-1.1.46-1.6 0-3.38-.98-4.63-2.8C5.9 10.1 5.34 8.27 5.34 7.9c0-.23.06-.44.38-.44h1.57c.29 0 .4.13.51.44.55 1.6 1.48 3 1.87 3s.45-.18.45-.93V8.6c-.05-.84-.48-.91-.48-1.2 0-.19.16-.38.42-.38h2.47c.23 0 .31.12.31.4v2.72c0 .23.1.31.16.31.33 0 .63-.31 1.25-1.05.77-.97 1.32-2.47 1.32-2.47.07-.2.2-.38.5-.38h1.57c.47 0 .57.24.47.56-.2.94-2.08 3.56-2.08 3.56-.17.27-.22.4 0 .7.16.22.68.68 1.03 1.09.64.72 1.12 1.33 1.25 1.75.12.42-.1.63-.5.63z" />
    </svg>
  );
}

interface SocialLinksProps {
  /** When provided (non-empty), renders a phone button */
  phone?: string;
  /** When provided (non-empty), renders a Telegram button */
  telegram?: string;
  /** When provided (non-empty), renders a VK button */
  vk?: string;
  variant?: 'light' | 'dark';
  /** sm = 40×40 rounded-lg (mobile top bar); md = 44×44 rounded-xl (default) */
  size?: 'sm' | 'md';
  className?: string;
  /** 0 = phone, 1 = telegram, 2 = vk; null/undefined = none */
  highlightedIndex?: number | null;
}

/**
 * @component
 * @description Renders a group of social contact buttons (phone, Telegram, VK) with optional highlighting and visual variants
 * @param {SocialLinksProps} props
 * @param {string} [props.phone] - Phone number for tel: link
 * @param {string} [props.telegram] - Telegram URL
 * @param {string} [props.vk] - VK profile URL
 * @param {'light'|'dark'} [props.variant='light'] - Color scheme variant
 * @param {'sm'|'md'} [props.size='md'] - Button size (small for mobile bars)
 * @param {string} [props.className] - Additional container classes
 * @param {number|null} [props.highlightedIndex] - Index of button to highlight with animation
 * @returns {JSX.Element} Flex container with conditional buttons
 * @example
 * <SocialLinks phone="79991234567" telegram="https://t.me/agency" vk="https://vk.com/agency" variant="light" />
 */
export function SocialLinks({
  phone,
  telegram,
  vk,
  variant = 'light',
  size = 'md',
  className,
  highlightedIndex,
}: SocialLinksProps) {
  const v = variant;
  const isSm = size === 'sm';
  const iconSize = isSm ? 18 : 16;

  const base = cn(
    'flex items-center justify-center border transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
    isSm ? 'h-10 w-10 rounded-lg' : 'h-11 w-11 rounded-xl'
  );

  return (
    <div className={cn('flex', isSm ? 'gap-2' : 'gap-3', className)}>
      {phone && (
        <a
          href={`tel:${phone}`}
          aria-label="Позвонить"
          className={cn(base, PHONE[v], highlightedIndex === 0 && 'animate-pulse-green')}
        >
          <Phone size={iconSize} />
        </a>
      )}
      {telegram && (
        <a
          href={telegram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Telegram"
          className={cn(base, TG[v], highlightedIndex === 1 && 'animate-pulse-tg')}
        >
          <Send size={iconSize} />
        </a>
      )}
      {vk && (
        <a
          href={vk}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="ВКонтакте"
          className={cn(base, VK[v], highlightedIndex === 2 && 'animate-pulse-vk')}
        >
          <VkIcon size={iconSize} />
        </a>
      )}
    </div>
  );
}
