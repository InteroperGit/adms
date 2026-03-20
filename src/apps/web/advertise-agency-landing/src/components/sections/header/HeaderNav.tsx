import { cn } from '@/libs/utils';
import { headerContent } from '@/types/sections/header/header';

interface HeaderNavProps {
  isHome: boolean;
  variant?: 'desktop' | 'mobile';
  onLinkClick?: () => void;
  animateItems?: boolean;
}

/**
 * @component
 * @description Navigation links list with responsive styling for desktop or mobile layouts
 * @param {HeaderNavProps} props
 * @param {boolean} props.isHome - Whether on home page; prefixes hrefs with "/" for other pages
 * @param {'desktop' | 'mobile'} [props.variant='desktop'] - Layout variant; desktop uses row with hover underlines
 * @param {() => void} [props.onLinkClick] - Optional callback when link clicked (used to close mobile menu)
 * @param {boolean} [props.animateItems=false] - Whether to animate nav items with stagger (mobile only)
 * @returns {JSX.Element} Navigation list with section anchor links
 * @example <caption>Mobile navigation links with staggered animation</caption>
 * <HeaderNav isHome={false} variant="mobile" onLinkClick={closeMobileMenu} animateItems={true} />
 */
export function HeaderNav({
  isHome,
  variant = 'desktop',
  onLinkClick,
  animateItems = false,
}: HeaderNavProps) {
  const isDesktop = variant === 'desktop';

  return (
    <nav
      className={cn(
        isDesktop ? 'hidden items-center gap-8 md:flex' : 'flex flex-col py-4',
        !isDesktop && animateItems && 'mobile-nav-animating'
      )}
    >
      {headerContent.nav.map((link, index) => {
        const href = isHome ? link.href : `/${link.href}`;
        return (
          <a
            key={link.href}
            href={href}
            onClick={onLinkClick}
            className={cn(
              isDesktop
                ? 'group relative text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-ring'
                : 'py-3 text-base font-medium text-muted-foreground transition-colors hover:text-foreground focus-ring',
              !isDesktop && animateItems && 'mobile-nav-item'
            )}
            style={!isDesktop && animateItems ? { animationDelay: `${index * 40}ms` } : undefined}
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
