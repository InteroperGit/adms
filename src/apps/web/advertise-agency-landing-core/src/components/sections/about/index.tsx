import { Container } from '@/components/layout/Container';
import { cn } from '@/lib/utils';
import { AboutCard } from '@/components/sections/about/AboutCard';
import { AboutText } from '@/components/sections/about/AboutText';
import { AboutValues } from '@/components/sections/about/AboutValues';
import { SectionHeader } from '@/components/ui/section/SectionHeader';
import { aboutContent } from '@/types/sections/aboutContent';
import { useFadeIn } from '@/hooks/useFadeIn';

export function About() {
  const about = aboutContent;
  const { ref, isVisible } = useFadeIn();

  return (
    <section ref={ref} id="about" className="bg-background py-24 md:py-32">
      <div className={cn('fade-in-section', isVisible && 'is-visible')}>
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
      </div>
    </section>
  );
}
