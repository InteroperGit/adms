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
import { ErrorBoundary, SilentErrorFallback } from '@/components/error';

/**
 * Landing page — full-page section composition.
 *
 * Renders all homepage sections in order: Carousel → Hero → About → Services →
 * Portfolio → Advantages → CallToAction → Testimonials → Contact, separated by
 * `<SectionDivider>` transitions.
 *
 * The Carousel is wrapped in an `<ErrorBoundary>` with a silent fallback so that
 * any carousel failure (e.g. missing slide data) does not block the rest of the
 * page from rendering.
 *
 * @component
 * @returns {JSX.Element} `<main>` element containing all homepage sections.
 * @example
 * <Home />
 */
export default function Home() {
  return (
    <main id="main-content" tabIndex={-1}>
      <ErrorBoundary fallback={<SilentErrorFallback />}>
        <Carousel />
      </ErrorBoundary>
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
