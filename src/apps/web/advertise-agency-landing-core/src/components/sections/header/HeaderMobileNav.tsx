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
  activeSection: string;
  isHome: boolean;
  forcedActiveHref: string;
}

export function HeaderMobileNav({ activeSection, isHome, forcedActiveHref }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <button
        className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted md:hidden"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
      >
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {menuOpen && (
        <div className="fixed inset-x-0 top-16 z-40 border-b border-border bg-white md:hidden">
          <Container>
            <nav className="flex flex-col py-4">
              {headerContent.nav.map((link) => {
                const isActive =
                  link.href === `#${activeSection}` || link.href === forcedActiveHref;
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
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-green-700/30 bg-green-700/5 text-green-700 shadow-sm transition-colors hover:bg-green-700/15"
                >
                  {PhoneIcon && <PhoneIcon size={16} />}
                </a>
                <SocialLinks
                  telegram={siteData.contact.telegram}
                  vk={siteData.contact.vk}
                  variant="colored"
                />
                <Button asChild className="h-11 flex-1 rounded-full" size="sm">
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
