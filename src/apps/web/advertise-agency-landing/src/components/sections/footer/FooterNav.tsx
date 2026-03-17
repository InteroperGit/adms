// src/components/sections/footer/FooterNav.tsx
import { footerContent } from '@/types/sections/footer/footer';
import { headerContent } from '@/types/sections/header/header';

/**
 * @component
 * @description Footer navigation column displaying main site navigation links (reused from header content). Links are hash anchors or internal routes.
 * @returns {JSX.Element} Column with navigation title and list of nav links
 * @example <caption>Footer navigation links</caption>
 * <FooterNav />
 */
export function FooterNav() {
  return (
    <div>
      <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-white/40">
        {footerContent.navTitle}
      </p>
      <ul className="space-y-3">
        {headerContent.nav.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="text-sm text-white/60 transition-colors hover:text-primary"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
