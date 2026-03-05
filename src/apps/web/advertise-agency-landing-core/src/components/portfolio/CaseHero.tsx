// src/components/portfolio/CaseHero.tsx
import { Badge } from '@/components/ui/badge';
import { Container } from '@/components/layout/Container';
import { cn } from '@/lib/utils';

interface CaseHeroProps {
  gradient: string;
  category: string;
  title: string;
  description: string;
}

export function CaseHero({ gradient, category, title, description }: CaseHeroProps) {
  return (
    <section className={cn('bg-gradient-to-br py-24 text-white', gradient)}>
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
