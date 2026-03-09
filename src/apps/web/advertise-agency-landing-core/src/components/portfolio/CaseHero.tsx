// src/components/portfolio/CaseHero.tsx
import { Badge } from '@/components/ui/badge';
import { Container } from '@/components/layout/Container';
import { cn } from '@/lib/utils';

interface CaseHeroProps {
  hero: { image?: string; gradient: string };
  category: string;
  title: string;
  description: string;
}

export function CaseHero({ hero, category, title, description }: CaseHeroProps) {
  if (hero.image) {
    return (
      <section
        className="relative bg-neutral-900 py-24"
        style={{
          backgroundImage: `url(${hero.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-neutral-900/60" />
        <Container className="relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-6 border-0 bg-white/20 text-white backdrop-blur-sm">
              {category}
            </Badge>
            <h1 className="mb-4 text-3xl font-bold leading-tight text-white md:text-5xl">
              {title}
            </h1>
            <p className="text-base text-white/80 md:text-lg">{description}</p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className={cn('bg-gradient-to-br py-24 text-white', hero.gradient)}>
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <Badge className="mb-6 border-0 bg-white/20 text-white backdrop-blur-sm">
            {category}
          </Badge>
          <h1 className="mb-4 text-3xl font-bold leading-tight md:text-5xl">{title}</h1>
          <p className="text-base text-white/80 md:text-lg">{description}</p>
        </div>
      </Container>
    </section>
  );
}
