// src/components/sections/footer/FooterBottom.tsx
import { Link } from 'react-router';
import { footerContent } from '@/types/sections/footer/footer';
import { siteData } from '@/types/config/siteData';
import { interpolate } from '@/libs/utils';

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
    <div className="flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/35 sm:flex-row">
      <p>{interpolate(footerContent.copyright, { year, name: siteData.name })}</p>

      <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:justify-start">
        {footerContent.legalLinks.map((link, i) => (
          <span key={link.href}>
            {i > 0 && <span className="hidden text-white/15 sm:inline">|</span>}
            <Link
              to={link.href}
              className="whitespace-nowrap transition-colors hover:text-white/70 focus-ring"
            >
              {link.label}
            </Link>
          </span>
        ))}
      </nav>

      <p>{footerContent.tagline}</p>
    </div>
  );
}
