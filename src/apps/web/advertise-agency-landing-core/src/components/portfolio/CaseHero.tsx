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

/**
 * @component
 * @description Full-height hero section for portfolio case pages with image or gradient background
 * @param {CaseHeroProps} props
 * @param {string} props.hero.image - Optional image URL; if provided, overlaid with dark overlay
 * @param {string} props.hero.gradient - Tailwind gradient class applied when no image
 * @param {string} props.category - Category badge text displayed above title
 * @param {string} props.title - Main case title
 * @param {string} props.description - Subtitle text
 * @returns {JSX.Element} Hero section with image/gradient background and centered content
 * @example <caption>Case page hero with image</caption>
 * <CaseHero hero={{ image: "/img.jpg", gradient: "" }} category="Branding" title="Project Name" description="Brief description" />
 */
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
