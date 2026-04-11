import { useLocation } from 'react-router';
import { Container } from '@/components/layout/Container';
import { useRandomButtonHighlight } from '@/hooks/useRandomButtonHighlight';
import { useViewportAnimation } from '@/hooks/useViewportAnimation';
import { HeaderDesktopNav } from './HeaderDesktopNav';
import { HeaderMobileNav } from './HeaderMobileNav';
import { Logo } from '@/components/shared/logo/Logo';
import { useTheme } from '@/hooks/useTheme';

// 4 buttons: 0=Phone, 1=Telegram, 2=VK, 3=CTA
const HEADER_BUTTON_COUNT = 4;

/**
 * @component
 * @description Main site header with logo, navigation, social links, and dark mode toggle
 * @returns {JSX.Element} Sticky header bar with responsive desktop and mobile navigation
 * @example <caption>Main site header</caption>
 * <Header />
 */
export function Header() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const [headerRef, isHeaderVisible] = useViewportAnimation({ threshold: 0 });
  const highlightRaw = useRandomButtonHighlight(isHeaderVisible ? HEADER_BUTTON_COUNT : 0);
  const { isDark, toggle } = useTheme();

  // Only show highlight when header is in viewport
  const highlightedActionIndex = isHeaderVisible ? highlightRaw : null;

  return (
    <header
      ref={headerRef}
      id="main-nav"
      className="border-b border-border bg-background shadow-sm"
    >
      <Container>
        <div className="flex h-16 items-center justify-between md:h-20">
          <Logo />

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
