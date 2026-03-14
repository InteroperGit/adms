import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { SocialLinks } from '@/components/ui/SocialLinks';
import { Container } from '@/components/layout/Container';
import { DarkModeToggle } from './DarkModeToggle';
import { HeaderNav } from './HeaderNav';
import { siteData } from '@/types/config/siteData';
import { headerContent } from '@/types/sections/header/header';

interface HeaderMobileNavProps {
  isHome: boolean;
  /** 0=Phone, 1=Telegram, 2=VK, 3=CTA — null when no button is highlighted */
  highlightedActionIndex: number | null;
  isDark: boolean;
  onToggleDark: () => void;
}

export function HeaderMobileNav({
  isHome,
  highlightedActionIndex,
  isDark,
  onToggleDark,
}: HeaderMobileNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <div className="flex items-center gap-1 md:hidden">
        <SocialLinks
          size="sm"
          phone={siteData.contact.phone}
          telegram={siteData.contact.telegram}
          variant="light"
          highlightedIndex={highlightedActionIndex}
        />
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? headerContent.closeMenuLabel : headerContent.openMenuLabel}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {menuOpen && (
        <div className="fixed inset-x-0 top-16 z-40 border-b border-border bg-background md:hidden">
          <Container>
            <div className="py-4">
              <HeaderNav isHome={isHome} variant="mobile" onLinkClick={() => setMenuOpen(false)} />
              <div className="flex items-center gap-2 pt-3">
                <SocialLinks
                  phone={siteData.contact.phone}
                  telegram={siteData.contact.telegram}
                  vk={siteData.contact.vk}
                  variant="light"
                  highlightedIndex={highlightedActionIndex}
                  className="shrink-0"
                />
                <DarkModeToggle isDark={isDark} onToggle={onToggleDark} className="shrink-0" />
              </div>
            </div>
          </Container>
        </div>
      )}
    </>
  );
}
