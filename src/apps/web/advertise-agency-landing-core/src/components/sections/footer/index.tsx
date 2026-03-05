// src/components/sections/footer/index.tsx
import { Container } from '@/components/layout/Container';
import { Separator } from '@/components/ui/separator';
import { FooterBrand } from './FooterBrand';
import { FooterNav } from './FooterNav';
import { FooterServices } from './FooterServices';
import { FooterContact } from './FooterContact';
import { FooterBottom } from './FooterBottom';

export function Footer() {
  return (
    <footer style={{ backgroundColor: 'hsl(var(--foreground))' }}>
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
