// src/components/ui/SocialLinks.tsx
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';

const TG = {
  colored: 'border-[#2AABEE]/30 bg-[#2AABEE]/5 text-[#2AABEE] hover:bg-[#2AABEE]/15',
  dark: 'text-white/50 hover:border-[#2AABEE]/40 hover:bg-[#2AABEE]/10 hover:text-[#2AABEE]',
  light:
    'border-border text-muted-foreground hover:border-[#2AABEE]/30 hover:bg-[#2AABEE]/5 hover:text-[#2AABEE]',
};

const VK = {
  colored: 'border-[#0077FF]/30 bg-[#0077FF]/5 text-[#0077FF] hover:bg-[#0077FF]/15',
  dark: 'text-white/50 hover:border-[#0077FF]/40 hover:bg-[#0077FF]/10 hover:text-[#0077FF]',
  light:
    'border-border text-muted-foreground hover:border-[#0077FF]/30 hover:bg-[#0077FF]/5 hover:text-[#0077FF]',
};

function VkIcon({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14C20.67 22 22 20.67 22 15.07V8.93C22 3.33 20.67 2 15.07 2zm3.08 13.37h-1.57c-.6 0-.78-.48-1.85-1.57-1-.93-1.4-.93-1.64-.93s-.3.06-.3.4v1.44c0 .29-.1.46-1.1.46-1.6 0-3.38-.98-4.63-2.8C5.9 10.1 5.34 8.27 5.34 7.9c0-.23.06-.44.38-.44h1.57c.29 0 .4.13.51.44.55 1.6 1.48 3 1.87 3s.45-.18.45-.93V8.6c-.05-.84-.48-.91-.48-1.2 0-.19.16-.38.42-.38h2.47c.23 0 .31.12.31.4v2.72c0 .23.1.31.16.31.33 0 .63-.31 1.25-1.05.77-.97 1.32-2.47 1.32-2.47.07-.2.2-.38.5-.38h1.57c.47 0 .57.24.47.56-.2.94-2.08 3.56-2.08 3.56-.17.27-.22.4 0 .7.16.22.68.68 1.03 1.09.64.72 1.12 1.33 1.25 1.75.12.42-.1.63-.5.63z" />
    </svg>
  );
}

interface SocialLinksProps {
  telegram: string;
  vk: string;
  variant?: 'light' | 'dark' | 'colored';
  className?: string;
}

export function SocialLinks({ telegram, vk, variant = 'light', className }: SocialLinksProps) {
  const isDark = variant === 'dark';
  const isColored = variant === 'colored';

  const base = cn(
    'flex h-11 w-11 items-center justify-center transition-colors',
    isDark
      ? 'rounded-lg border border-white/10 text-white/50'
      : 'rounded-xl border bg-white shadow-sm'
  );

  return (
    <div className={cn('flex gap-3', className)}>
      <a
        href={telegram}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Telegram"
        className={cn(base, isColored ? TG.colored : isDark ? TG.dark : TG.light)}
      >
        <Send size={16} />
      </a>
      <a
        href={vk}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="ВКонтакте"
        className={cn(base, isColored ? VK.colored : isDark ? VK.dark : VK.light)}
      >
        <VkIcon />
      </a>
    </div>
  );
}
