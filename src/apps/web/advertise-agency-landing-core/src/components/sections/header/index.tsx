import { useLocation } from 'react-router-dom';
import { Container } from '@/components/layout/Container';
import { headerContent } from '@/types/sections/header';
import { useRandomButtonHighlight } from '@/hooks/useRandomButtonHighlight';
import { siteData } from '@/types/config/siteData';
import { HeaderDesktopNav } from './HeaderDesktopNav';
import { HeaderMobileNav } from './HeaderMobileNav';
import { useTheme } from "@/hooks/useTheme";

// 4 buttons: 0=Phone, 1=Telegram, 2=VK, 3=CTA
const HEADER_BUTTON_COUNT = 4;

export function Header() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const highlightedActionIndex = useRandomButtonHighlight(HEADER_BUTTON_COUNT);
  const { isDark, toggle } = useTheme();

  return (
    <header id="main-nav" className="border-b border-border bg-background shadow-sm">
      <Container>
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 text-foreground hover:text-primary">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
              {headerContent.logo.letter}
            </span>
            <span
              style={{ fontFamily: 'var(--font-heading)' }}
              className="text-lg font-bold tracking-tight"
            >
              {siteData.name}
            </span>
          </a>

          <HeaderDesktopNav
            isHome={isHome}
            highlightedActionIndex={highlightedActionIndex}
            isDark={isDark}
            onToggleDark={toggle}
          />
          <HeaderMobileNav
            isHome={isHome}
            highlightedActionIndex={highlightedActionIndex}
            isDark={isDark}
            onToggleDark={toggle}
          />
        </div>
      </Container>
    </header>
  );
}
