import { SocialLinks } from '@/components/ui/SocialLinks';
import { DarkModeToggle } from './DarkModeToggle';
import { PhoneButton } from './PhoneButton';
import { HeaderNav } from './HeaderNav';
import { siteData } from '@/types/config/siteData';

interface Props {
  isHome: boolean;
  /** 0=Phone, 1=Telegram, 2=VK, 3=CTA — null when no button is highlighted */
  highlightedActionIndex: number | null;
  isDark: boolean;
  onToggleDark: () => void;
}

export function HeaderDesktopNav({ isHome, highlightedActionIndex, isDark, onToggleDark }: Props) {
  return (
    <>
      <HeaderNav isHome={isHome} />

      <div className="hidden items-center gap-3 md:flex">
        <PhoneButton highlighted={highlightedActionIndex === 0} />
        <SocialLinks
          telegram={siteData.contact.telegram}
          vk={siteData.contact.vk}
          variant="colored"
          highlightedIndex={
            highlightedActionIndex === 1 ? 0 : highlightedActionIndex === 2 ? 1 : null
          }
        />
        <div className="h-6 w-px bg-border" />
        <DarkModeToggle isDark={isDark} onToggle={onToggleDark} />
      </div>
    </>
  );
}
