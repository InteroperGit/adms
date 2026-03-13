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

export default function Home() {
  return (
    <main id="main-content" tabIndex={-1}>
      <Carousel />
      <Hero />
      <About />
      <SectionDivider variant="white-to-muted" />
      <Services />
      <SectionDivider variant="muted-to-white" />
      <Portfolio />
      <SectionDivider variant="white-to-muted" flipX />
      <Advantages />
      <SectionDivider variant="muted-to-primary" />
      <CallToAction />
      <SectionDivider variant="primary-to-white" />
      <Testimonials />
      <SectionDivider variant="white-to-muted" flipX />
      <Contact />
      <SectionDivider variant="muted-to-surface-dark" />
    </main>
  );
}
