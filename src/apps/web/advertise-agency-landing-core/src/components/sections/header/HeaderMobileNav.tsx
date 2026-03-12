import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { SocialLinks } from '@/components/ui/SocialLinks';
import { Container } from '@/components/layout/Container';
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

export function HeaderMobileNav({ isHome, highlightedActionIndex, isDark, onToggleDark }: Props) {
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
        <PhoneButton size="sm" highlighted={highlightedActionIndex === 0} />
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
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
                <PhoneButton highlighted={highlightedActionIndex === 0} className="shrink-0" />
                <SocialLinks
                  telegram={siteData.contact.telegram}
                  vk={siteData.contact.vk}
                  variant="colored"
                  highlightedIndex={
                    highlightedActionIndex === 1 ? 0 : highlightedActionIndex === 2 ? 1 : null
                  }
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
