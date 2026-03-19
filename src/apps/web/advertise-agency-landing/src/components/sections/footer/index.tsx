// src/components/sections/footer/index.tsx
import { Container } from '@/components/layout/Container';
import { FooterBrand } from './FooterBrand';
import { FooterNav } from './FooterNav';
import { FooterServices } from './FooterServices';
import { FooterContact } from './FooterContact';
import { FooterBottom } from './FooterBottom';

/**
 * @component
 * @description Full footer section with dark background containing brand/logo, navigation links, services, contact info, and legal bottom bar. Multi-column responsive layout.
 * @returns {JSX.Element} Footer element with dark background and responsive grid layout
 * @example <caption>Site footer</caption>
 * <Footer />
 */
export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-surface-dark via-surface-dark to-black/80">
      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -left-32 top-1/3 h-72 w-72 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <Container>
        <div className="relative z-10 grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 sm:gap-16 sm:py-20 lg:grid-cols-4 lg:gap-8">
          <FooterBrand />
          <FooterNav />
          <FooterServices />
          <FooterContact />
        </div>

        <div className="relative z-10 border-t border-white/10">
          <FooterBottom />
        </div>
      </Container>
    </footer>
  );
}
