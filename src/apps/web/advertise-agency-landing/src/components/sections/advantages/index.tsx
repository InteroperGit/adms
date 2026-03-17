import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/ui/section/SectionHeader';
import { useStaggeredReveal } from '@/hooks/useStaggeredReveal';
import { advantages } from '@/types/sections/advantages/advantages';
import { advantagesContent } from '@/types/sections/advantages/advantagesContent';
import { AdvantageCard } from './AdvantageCard';
import { cn } from '@/libs/utils';

/**
 * @component
 * @description Advantages section displaying numbered benefit cards in a responsive grid
 * @returns {JSX.Element} Section with header and three-column grid of advantage cards with staggered reveal
 * @example <caption>Advantages/benefits section</caption>
 * <Advantages />
 */
export function Advantages() {
  const { ref, isVisible, getDelay } = useStaggeredReveal();

  return (
    <section id="advantages" className="bg-muted py-24 md:py-32">
      <Container>
        <SectionHeader
          label={advantagesContent.label}
          title={advantagesContent.title}
          titleHighlight={advantagesContent.titleHighlight}
          description={advantagesContent.description}
          className="mb-16"
        />

        <div
          ref={ref}
          className={cn(
            'grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3',
            isVisible && 'stagger-visible'
          )}
        >
          {advantages.map((item, index) => (
            <div
              key={item.title}
              className="stagger-item h-full"
              style={{ animationDelay: `${getDelay(index)}ms` }}
            >
              <AdvantageCard item={item} index={index} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
