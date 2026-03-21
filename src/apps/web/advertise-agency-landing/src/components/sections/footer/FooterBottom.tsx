// src/components/sections/footer/FooterBottom.tsx
import { Link } from 'react-router';
import { footerContent } from '@/types/sections/footer/footer';
import { siteData } from '@/types/config/siteData';
import { interpolate } from '@/libs/utils';

const year = new Date().getFullYear();

/**
 * @component
 * @description Footer bottom section displaying copyright notice, legal links (privacy policy, user agreement), and tagline. Responsive layout adapting to screen size.
 * @returns {JSX.Element} Bottom footer bar with copyright, legal navigation, and tagline
 * @example <caption>Footer bottom bar</caption>
 * <FooterBottom />
 */
export function FooterBottom() {
  return (
    <div className="flex flex-col items-center justify-between gap-3 py-6 text-xs sm:flex-row">
      <p className="text-white/50">
        {interpolate(footerContent.copyright, { year, name: siteData.name })}
      </p>

      <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-white/35 sm:justify-start">
        {footerContent.legalLinks.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            className="whitespace-nowrap underline-offset-4 decoration-primary/40 transition-colors hover:text-white/70 hover:underline focus-ring"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <p className="text-white/35">{footerContent.tagline}</p>
    </div>
  );
}
