// src/components/sections/footer/FooterNav.tsx
import { footerContent } from '@/types/sections/footer/footer';
import { headerContent } from '@/types/sections/header/header';
import { FooterSection } from './FooterSection';

/**
 * @component
 * @description Footer navigation column displaying main site navigation links (reused from header content). Links are hash anchors or internal routes.
 * @returns {JSX.Element} Column with navigation title and list of nav links
 * @example <caption>Footer navigation links</caption>
 * <FooterNav />
 */
export function FooterNav() {
  return (
    <FooterSection title={footerContent.navTitle}>
      {headerContent.nav.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            className="text-sm text-white/60 transition-colors hover:text-primary focus-ring"
          >
            {link.label}
          </a>
        </li>
      ))}
    </FooterSection>
  );
}
