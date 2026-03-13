import { Container } from '@/components/layout/Container';
import { AboutCard } from '@/components/sections/about/AboutCard';
import { AboutText } from '@/components/sections/about/AboutText';
import { AboutValues } from '@/components/sections/about/AboutValues';
import { SectionHeader } from '@/components/ui/section/SectionHeader';
import { FadeInSection } from '@/components/ui/section/FadeInSection';
import { aboutContent } from '@/types/sections/aboutContent';

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
