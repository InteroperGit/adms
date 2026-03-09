import { useLocation } from 'react-router-dom';
import { Container } from '@/components/layout/Container';
import { headerContent } from '@/types/sections/header';
import { useActiveSection } from '@/hooks/useActiveSection';
import { siteData } from '@/types/config/siteData';
import { HeaderDesktopNav } from './HeaderDesktopNav';
import { HeaderMobileNav } from './HeaderMobileNav';

export function Header() {
  const activeSection = useActiveSection();
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const forcedActiveHref = pathname.startsWith('/portfolio/') ? '#portfolio' : '';

  return (
    <header id="main-nav" className="border-b border-border bg-white shadow-sm">
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
            activeSection={activeSection}
            isHome={isHome}
            forcedActiveHref={forcedActiveHref}
          />
          <HeaderMobileNav
            activeSection={activeSection}
            isHome={isHome}
            forcedActiveHref={forcedActiveHref}
          />
        </div>
      </Container>
    </header>
  );
}
