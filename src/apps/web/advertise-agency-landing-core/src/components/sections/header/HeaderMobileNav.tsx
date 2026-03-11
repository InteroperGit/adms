import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SocialLinks } from '@/components/ui/SocialLinks';
import { Container } from '@/components/layout/Container';
import { headerContent } from '@/types/sections/header';
import { siteData } from '@/types/config/siteData';
import { resolveIcon } from '@/types/shared/iconMap';
import { cn } from '@/lib/utils';

const PhoneIcon = resolveIcon('Phone');

interface Props {
  activeHref: string;
  isHome: boolean;
  /** 0=Phone, 1=Telegram, 2=VK, 3=CTA — null when no button is highlighted */
  highlightedActionIndex: number | null;
}

export function HeaderMobileNav({ activeHref, isHome, highlightedActionIndex }: Props) {
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
        <a
          href={`tel:${siteData.contact.phone}`}
          aria-label="Позвонить"
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-lg',
            'border border-green-700/30 bg-green-700/5 text-green-700',
            'transition-colors hover:bg-green-700/15',
            highlightedActionIndex === 0 && 'animate-pulse-green'
          )}
        >
          {PhoneIcon && <PhoneIcon size={18} />}
        </a>
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
        <div className="fixed inset-x-0 top-16 z-40 border-b border-border bg-white md:hidden">
          <Container>
            <nav className="flex flex-col py-4">
              {headerContent.nav.map((link) => {
                const isActive = link.href === activeHref;
                const href = isHome ? link.href : `/${link.href}`;
                return (
                  <a
                    key={link.href}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      'py-3 text-base font-medium transition-colors hover:text-foreground',
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    )}
                  >
                    {link.label}
                  </a>
                );
              })}
              <div className="flex items-center gap-2 pt-3">
                <a
                  href={`tel:${siteData.contact.phone}`}
                  aria-label="Позвонить"
                  className={cn(
                    'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border',
                    'border-green-700/30 bg-green-700/5 text-green-700 shadow-sm',
                    'transition-colors hover:bg-green-700/15',
                    highlightedActionIndex === 0 && 'animate-pulse-green'
                  )}
                >
                  {PhoneIcon && <PhoneIcon size={16} />}
                </a>
                <SocialLinks
                  telegram={siteData.contact.telegram}
                  vk={siteData.contact.vk}
                  variant="colored"
                  highlightedIndex={
                    highlightedActionIndex === 1 ? 0 : highlightedActionIndex === 2 ? 1 : null
                  }
                />
                <Button
                  asChild
                  className={cn(
                    'h-11 flex-1 rounded-full',
                    highlightedActionIndex === 3 && 'animate-cta-pulse'
                  )}
                  size="sm"
                >
                  <a href={isHome ? '#contact' : '/#contact'} onClick={() => setMenuOpen(false)}>
                    {headerContent.navCta}
                  </a>
                </Button>
              </div>
            </nav>
          </Container>
        </div>
      )}
    </>
  );
}
