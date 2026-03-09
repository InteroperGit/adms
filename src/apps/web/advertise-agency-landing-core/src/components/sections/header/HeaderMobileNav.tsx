import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout/Container';
import { headerContent } from '@/types/sections/header';
import { cn } from '@/lib/utils';

interface Props {
  activeSection: string;
  isHome: boolean;
  forcedActiveHref: string;
}

export function HeaderMobileNav({ activeSection, isHome, forcedActiveHref }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

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
              <div className="pt-3">
                <Button asChild className="w-full rounded-full" size="sm">
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
