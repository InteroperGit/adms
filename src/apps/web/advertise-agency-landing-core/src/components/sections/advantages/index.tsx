import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/ui/section/SectionHeader';
import { FadeInSection } from '@/components/ui/section/FadeInSection';
import { advantages } from '@/types/sections/advantages/advantages';
import { advantagesContent } from '@/types/sections/advantages/advantagesContent';
import { AdvantageCard } from './AdvantageCard';

export function Advantages() {
  return (
    <FadeInSection id="advantages" className="bg-muted py-24 md:py-32">
      <Container>
        <SectionHeader
          label={advantagesContent.label}
          title={advantagesContent.title}
          titleHighlight={advantagesContent.titleHighlight}
          description={advantagesContent.description}
          className="mb-16"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {advantages.map((item, index) => (
            <AdvantageCard key={item.title} item={item} index={index} />
          ))}
        </div>
      </Container>
    </FadeInSection>
  );
}
