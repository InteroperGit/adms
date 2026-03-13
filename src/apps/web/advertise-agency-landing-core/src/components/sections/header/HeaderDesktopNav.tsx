import { SocialLinks } from '@/components/ui/SocialLinks';
import { DarkModeToggle } from './DarkModeToggle';
import { HeaderNav } from './HeaderNav';
import { siteData } from '@/types/config/siteData';

interface HeaderDesktopNavProps {
  isHome: boolean;
  /** 0=Phone, 1=Telegram, 2=VK, 3=CTA — null when no button is highlighted */
  highlightedActionIndex: number | null;
  isDark: boolean;
  onToggleDark: () => void;
}

export function HeaderDesktopNav({
  isHome,
  highlightedActionIndex,
  isDark,
  onToggleDark,
}: HeaderDesktopNavProps) {
  return (
    <>
      <HeaderNav isHome={isHome} />

      <div className="hidden items-center gap-3 md:flex">
        <SocialLinks
          phone={siteData.contact.phone}
          telegram={siteData.contact.telegram}
          vk={siteData.contact.vk}
          variant="light"
          highlightedIndex={highlightedActionIndex}
        />
        <div className="h-6 w-px bg-border" />
        <DarkModeToggle isDark={isDark} onToggle={onToggleDark} />
      </div>
    </>
  );
}
