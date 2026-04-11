import { Container } from '@/components/layout/Container';
import { AboutCard } from '@/components/sections/about/AboutCard';
import { AboutText } from '@/components/sections/about/AboutText';
import { AboutValues } from '@/components/sections/about/AboutValues';
import { SectionHeader } from '@/components/shared/section/SectionHeader';
import { FadeInSection } from '@/components/shared/section/FadeInSection';
import { aboutContent } from '@/types/sections/about/aboutContent';

/**
 * @component
 * @description About section showcasing company description, values, and key statistics in two-column layout
 * @returns {JSX.Element} Fade-in section with header, left text and values, right company card
 * @example <caption>About page section</caption>
 * <About />
 */
export function About() {
  const about = aboutContent;

  return (
    <FadeInSection id="about" className="bg-background py-24 md:py-32">
      <Container>
        <SectionHeader
          label={about.label}
          title={about.title}
          titleHighlight={about.titleHighlight}
          className="mb-12"
        />

        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          {/* Left — text content */}
          <div>
            <AboutText />
            <AboutValues />
          </div>

          {/* Right — visual */}
          <AboutCard card={about.card} />
        </div>
      </Container>
    </FadeInSection>
  );
}
