// src/components/sections/footer/FooterBottom.tsx
import { Link } from 'react-router';
import { footerContent } from '@/types/sections/footer/footer';
import { siteData } from '@/types/config/siteData';
import { cn, interpolate } from '@/libs/utils';

/**
 * @component
 * @description Footer bottom section displaying copyright notice, legal links (privacy policy, user agreement), and tagline. Responsive layout adapting to screen size.
 * @returns {JSX.Element} Bottom footer bar with copyright, legal navigation, and tagline
 * @example <caption>Footer bottom bar</caption>
 * <FooterBottom />
 */
export function FooterBottom() {
  const year = new Date().getFullYear();

  return (
    <div className="flex flex-col items-center justify-between gap-3 py-6 text-xs sm:flex-row">
      <p className="text-white/50">
        {interpolate(footerContent.copyright, { year, name: siteData.name })}
      </p>

      <nav
        className={cn(
          'flex flex-wrap items-center justify-center gap-x-4 gap-y-2',
          'text-white/35 sm:justify-start'
        )}
      >
        {footerContent.legalLinks.map((link, i) => (
          <span key={link.href}>
            {i > 0 && <span className="hidden text-white/15 sm:inline">|</span>}
            <Link
              to={link.href}
              className={cn(
                'whitespace-nowrap underline-offset-4 decoration-primary/40',
                'transition-colors hover:text-white/70 hover:underline focus-ring'
              )}
            >
              {link.label}
            </Link>
          </span>
        ))}
      </nav>

      <p className="text-white/35">{footerContent.tagline}</p>
    </div>
  );
}
