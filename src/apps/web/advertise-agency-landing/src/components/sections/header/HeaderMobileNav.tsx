import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/libs/utils';
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

/**
 * @component
 * @description Mobile navigation with hamburger menu that toggles overlay navigation drawer
 * @param {HeaderMobileNavProps} props
 * @param {boolean} props.isHome - Whether currently on home page; affects nav link hrefs
 * @param {number | null} props.highlightedActionIndex - Which action button should be highlighted
 * @param {boolean} props.isDark - Current dark mode state
 * @param {() => void} props.onToggleDark - Callback to toggle dark mode
 * @returns {JSX.Element} Hamburger menu button and overlay drawer (hidden on desktop)
 * @example <caption>Mobile header navigation</caption>
 * <HeaderMobileNav isHome={false} highlightedActionIndex={1} isDark={true} onToggleDark={toggle} />
 */
export function HeaderMobileNav({
  isHome,
  highlightedActionIndex,
  isDark,
  onToggleDark,
}: HeaderMobileNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen && !closing ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen, closing]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setMenuOpen(false);
      setClosing(false);
    }, 200);
  };

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
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-lg',
            'text-foreground transition-colors hover:bg-muted'
          )}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? headerContent.closeMenuLabel : headerContent.openMenuLabel}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {(menuOpen || closing) && (
        <>
          {/* Backdrop overlay */}
          <div
            className={cn(
              'fixed inset-0 top-16 z-30 bg-black/20 backdrop-blur-sm md:hidden',
              'transition-opacity duration-200',
              closing ? 'opacity-0' : 'opacity-100'
            )}
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Menu drawer */}
          <div
            className={cn(
              'fixed inset-x-0 top-16 z-40 border-b border-border bg-background md:hidden',
              'overflow-y-auto max-h-[calc(100dvh-4rem)]',
              'transition-opacity duration-200',
              closing ? 'opacity-0' : 'opacity-100'
            )}
            style={
              closing
                ? {
                    animation: 'slide-down 0.2s ease-out forwards',
                    animationDirection: 'reverse',
                  }
                : {
                    animation: 'slide-down 0.3s ease-out',
                  }
            }
          >
            <Container>
              <div className="py-4">
                <HeaderNav
                  isHome={isHome}
                  variant="mobile"
                  onLinkClick={() => handleClose()}
                  animateItems={!closing}
                />
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
        </>
      )}
    </>
  );
}
