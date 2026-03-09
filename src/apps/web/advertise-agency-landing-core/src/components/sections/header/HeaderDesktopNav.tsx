import { Button } from '@/components/ui/button';
import { headerContent } from '@/types/sections/header';
import { cn } from '@/lib/utils';

interface Props {
  activeSection: string;
  isHome: boolean;
  forcedActiveHref: string;
}

export function HeaderDesktopNav({ activeSection, isHome, forcedActiveHref }: Props) {
  return (
    <>
      <nav className="hidden items-center gap-8 md:flex">
        {headerContent.nav.map((link) => {
          const isActive = link.href === `#${activeSection}` || link.href === forcedActiveHref;
          const href = isHome ? link.href : `/${link.href}`;
          return (
            <a
              key={link.href}
              href={href}
              className={cn(
                'group relative text-sm font-medium transition-colors hover:text-foreground',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {link.label}

              {/* Линия подчёркивания */}
              <span
                className={cn(
                  'absolute -bottom-0.5 left-0 h-px transition-all duration-300 ease-out',
                  'bg-primary',
                  isActive
                    ? 'w-full' // активная — всегда видна
                    : 'w-0 group-hover:w-full' // неактивная — появляется при наведении
                )}
              />
            </a>
          );
        })}
      </nav>

      <div className="hidden md:block">
        <Button asChild size="sm" className="rounded-full px-6">
          <a href={isHome ? '#contact' : '/#contact'}>{headerContent.navCta}</a>
        </Button>
      </div>
    </>
  );
}
