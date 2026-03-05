import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout/Container';
import { content } from '@/types/content';
import { cn } from '@/lib/utils';

interface Props {
  activeSection: string;
}

export function HeaderMobileNav({ activeSection }: Props) {
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
              {content.nav.map((link) => {
                const isActive = link.href === `#${activeSection}`;
                return (
                  <a
                    key={link.href}
                    href={link.href}
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
                  <a href="#contact" onClick={() => setMenuOpen(false)}>
                    {content.navCta}
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
