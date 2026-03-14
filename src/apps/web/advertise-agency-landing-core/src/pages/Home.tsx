import { Carousel } from '@/components/sections/carousel';
import { Hero } from '@/components/sections/hero';
import { About } from '@/components/sections/about';
import { Services } from '@/components/sections/services';
import { Portfolio } from '@/components/sections/portfolio';
import { Advantages } from '@/components/sections/advantages';
import { CallToAction } from '@/components/sections/call-to-action';
import { Testimonials } from '@/components/sections/testimonials';
import { Contact } from '@/components/sections/contact';
import { SectionDivider } from '@/components/ui/section/SectionDivider';

/**
 * @component
 * @description Landing page homepage with full-page sections: carousel, hero, about, services, portfolio, advantages, CTA, testimonials, contact
 * @returns {JSX.Element} Main element with composed section components
 * @example
 * <Home />
 */
export default function Home() {
  return (
    <main id="main-content" tabIndex={-1}>
      <Carousel />
      <Hero />
      <About />
      <SectionDivider variant="bg-to-muted" />
      <Services />
      <SectionDivider variant="muted-to-bg" />
      <Portfolio />
      <SectionDivider variant="bg-to-muted" flipX />
      <Advantages />
      <SectionDivider variant="muted-to-primary" />
      <CallToAction />
      <SectionDivider variant="primary-to-bg" />
      <Testimonials />
      <SectionDivider variant="bg-to-muted" flipX />
      <Contact />
      <SectionDivider variant="muted-to-surface-dark" />
    </main>
  );
}
