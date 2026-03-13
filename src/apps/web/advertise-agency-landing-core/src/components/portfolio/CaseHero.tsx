// src/components/portfolio/CaseHero.tsx
import { Badge } from '@/components/ui/badge';
import { Container } from '@/components/layout/Container';
import { cn } from '@/lib/utils';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

interface CaseHeroProps {
  hero: { image?: string; gradient: string };
  category: string;
  title: string;
  description: string;
}

export function CaseHero({ hero, category, title, description }: CaseHeroProps) {
  const content = (
    <Container className={hero.image ? 'relative z-10' : undefined}>
      <div className="mx-auto max-w-3xl text-center">
        <Badge className="mb-6 border-0 bg-white/20 text-white backdrop-blur-sm">{category}</Badge>
        <h1 className="mb-4 text-3xl font-bold leading-tight text-white md:text-5xl">{title}</h1>
        <p className="text-base text-white/80 md:text-lg">{description}</p>
      </div>
    </Container>
  );

  if (hero.image) {
    return (
      <section className="relative bg-neutral-900 py-24">
        <OptimizedImage
          src={hero.image}
          alt={title}
          sizes="100vw"
          priority
          className="absolute inset-0 h-full w-full object-cover"
          dev={import.meta.env.DEV}
        />
        <div className="absolute inset-0 bg-neutral-900/60" />
        {content}
      </section>
    );
  }

  return (
    <section className={cn('bg-gradient-to-br py-24 text-white', hero.gradient)}>{content}</section>
  );
}
