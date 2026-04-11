import { SocialLinks } from '@/components/shared/socialLinks/SocialLinks';
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

/**
 * @component
 * @description Navigation bar content for desktop viewports (hidden on mobile)
 * @param {HeaderDesktopNavProps} props
 * @param {boolean} props.isHome - Whether currently on home page; affects nav link hrefs
 * @param {number | null} props.highlightedActionIndex - Which action button should be highlighted
 * @param {boolean} props.isDark - Current dark mode state
 * @param {() => void} props.onToggleDark - Callback to toggle dark mode
 * @returns {JSX.Element} Horizontal nav with links, social buttons, divider, and dark mode toggle
 * @example <caption>Desktop header navigation</caption>
 * <HeaderDesktopNav isHome={true} highlightedActionIndex={0} isDark={false} onToggleDark={toggle} />
 */
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
