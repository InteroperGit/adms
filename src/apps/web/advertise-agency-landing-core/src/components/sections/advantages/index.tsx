import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/ui/section/SectionHeader';
import { advantages } from '@/types/sections/advantages';
import { advantagesContent } from '@/types/sections/advantagesContent';
import { cn } from '@/lib/utils';
import { useFadeIn } from '@/hooks/useFadeIn';
import { AdvantageCard } from './AdvantageCard';

export function Advantages() {
  const { ref, isVisible } = useFadeIn();

  return (
    <section ref={ref} id="advantages" className="bg-muted py-24 md:py-32">
      <div className={cn('fade-in-section', isVisible && 'is-visible')}>
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
      </div>
    </section>
  );
}
