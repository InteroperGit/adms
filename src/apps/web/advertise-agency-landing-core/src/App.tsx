import './index.css';
import { Header } from '@/components/sections/header';
import { Carousel } from '@/components/sections/carousel';
import { Hero } from '@/components/sections/hero';
import { About } from '@/components/sections/about';
import { Services } from '@/components/sections/services';
import { Portfolio } from '@/components/sections/portfolio';
import { Advantages } from '@/components/sections/advantages';
import { Testimonials } from '@/components/sections/testimonials';
import { CallToAction } from '@/components/sections/call-to-action';
import { Contact } from '@/components/sections/contact';
import { Footer } from '@/components/sections/footer';
import { CookieBanner } from './components/banners/CookieBanner';
import { ScrollToTop } from '@/components/ui/ScrollToTop.tsx';

function App() {
  return (
    <>
      <Header />
      <main>
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
      <Footer />
      <ScrollToTop navSelector="#main-nav" />
      <CookieBanner />
    </>
  );
}

export default App;
