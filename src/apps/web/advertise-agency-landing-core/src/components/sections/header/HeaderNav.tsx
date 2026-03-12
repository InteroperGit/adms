import { headerContent } from '@/types/sections/header';

interface Props {
  isHome: boolean;
  variant?: 'desktop' | 'mobile';
  onLinkClick?: () => void;
}

export function HeaderNav({ isHome, variant = 'desktop', onLinkClick }: Props) {
  const isDesktop = variant === 'desktop';

  return (
    <nav className={isDesktop ? 'hidden items-center gap-8 md:flex' : 'flex flex-col py-4'}>
      {headerContent.nav.map((link) => {
        const href = isHome ? link.href : `/${link.href}`;
        return (
          <a
            key={link.href}
            href={href}
            onClick={onLinkClick}
            className={
              isDesktop
                ? 'group relative text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'
                : 'py-3 text-base font-medium text-muted-foreground transition-colors hover:text-foreground'
            }
          >
            {link.label}

            {isDesktop && (
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-primary transition-all duration-300 ease-out group-hover:w-full" />
            )}
          </a>
        );
      })}
    </nav>
  );
}
