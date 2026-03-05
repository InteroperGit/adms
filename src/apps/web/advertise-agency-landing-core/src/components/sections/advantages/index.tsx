import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { advantages } from '@/types/advantages';
import { content } from '@/types/content';
import { AdvantageCard } from './AdvantageCard';

export function Advantages() {
  return (
    <section
      id="advantages"
      className="relative overflow-hidden py-24 md:py-32"
      style={{ backgroundColor: 'hsl(var(--foreground))' }}
    >
      {/* Decorative blurred circles */}
      <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-accent/15 blur-3xl" />

      <Container className="relative">
        <SectionHeader
          label={content.advantages.label}
          title={content.advantages.title}
          titleHighlight={content.advantages.titleHighlight}
          description={content.advantages.description}
          variant="dark"
          className="mb-16"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {advantages.map((item, index) => (
            <AdvantageCard key={item.title} item={item} index={index} />
          ))}
        </div>
      </Container>
    </section>
  );
}
