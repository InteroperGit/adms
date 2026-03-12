import { cn } from '@/lib/utils';
import { headerContent } from '@/types/sections/header';

interface Props {
  activeHref: string;
  isHome: boolean;
  variant?: 'desktop' | 'mobile';
  onLinkClick?: () => void;
}

export function HeaderNav({ activeHref, isHome, variant = 'desktop', onLinkClick }: Props) {
  const isDesktop = variant === 'desktop';

  return (
    <nav className={isDesktop ? 'hidden items-center gap-8 md:flex' : 'flex flex-col py-4'}>
      {headerContent.nav.map((link) => {
        const isActive = link.href === activeHref;
        const href = isHome ? link.href : `/${link.href}`;
        return (
          <a
            key={link.href}
            href={href}
            onClick={onLinkClick}
            className={cn(
              'font-medium transition-colors hover:text-foreground',
              isDesktop ? 'group relative text-sm' : 'py-3 text-base',
              isActive ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            {link.label}

            {isDesktop && (
              <span
                className={cn(
                  'absolute -bottom-0.5 left-0 h-px transition-all duration-300 ease-out',
                  'bg-primary',
                  isActive ? 'w-full' : 'w-0 group-hover:w-full'
                )}
              />
            )}
          </a>
        );
      })}
    </nav>
  );
}
