import { Carousel } from '@/components/sections/carousel';
import { Hero } from '@/components/sections/hero';
import { About } from '@/components/sections/about';
import { Services } from '@/components/sections/services';
import { Portfolio } from '@/components/sections/portfolio';
import { Advantages } from '@/components/sections/advantages';
import { CallToAction } from '@/components/sections/call-to-action';
import { Testimonials } from '@/components/sections/testimonials';
import { Contact } from '@/components/sections/contact';

export default function Home() {
  return (
    <main id="main-content" tabIndex={-1}>
      <Carousel />
      <Hero />
      <About />
      <Services />
      <Portfolio />
      <Advantages />
      <CallToAction />
      <Testimonials />
      <Contact />
    </main>
  );
}
