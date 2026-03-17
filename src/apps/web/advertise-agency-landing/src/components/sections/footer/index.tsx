// src/components/sections/footer/index.tsx
import { Container } from '@/components/layout/Container';
import { Separator } from '@/components/ui/separator';
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
    <footer className="bg-surface-dark">
      <Container>
        <div className="grid grid-cols-1 gap-6 py-12 sm:grid-cols-2 sm:gap-10 sm:py-16 lg:grid-cols-4">
          <FooterBrand />
          <FooterNav />
          <FooterServices />
          <FooterContact />
        </div>

        <Separator className="bg-white/10" />

        <FooterBottom />
      </Container>
    </footer>
  );
}
