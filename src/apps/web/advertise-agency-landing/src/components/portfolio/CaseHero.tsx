// src/components/portfolio/CaseHero.tsx
import { Badge } from '@/components/ui/badge';
import { Container } from '@/components/layout/Container';
import { cn } from '@/libs/utils';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

interface CaseHeroProps {
  /**
   * Hero display configuration sourced from the portfolio case JSON.
   * - `image` — optional absolute path to the hero image (served from `/img/`).
   *   When present the image is rendered full-bleed with a `bg-neutral-900/60` overlay.
   * - `gradient` — Tailwind utility classes for the fallback gradient background
   *   (e.g. `"from-violet-600 to-indigo-700"`), applied when `image` is absent.
   */
  hero: { image?: string; gradient: string };
  /** Category label rendered as a frosted-glass badge above the title. */
  category: string;
  /** Main case title — rendered as the page `<h1>`. */
  title: string;
  /** Short description rendered below the title. */
  description: string;
}

/**
 * Full-height hero section for portfolio case detail pages.
 *
 * Supports two visual modes driven by `hero.image`:
 *
 * - **Image mode** — `<OptimizedImage>` is positioned absolutely, filling the section.
 *   A semi-transparent dark overlay (`bg-neutral-900/60`) ensures text contrast.
 *   The inner `<Container>` receives `relative z-10` to sit above the overlay.
 * - **Gradient mode** — the section background is set to `bg-gradient-to-br` plus
 *   the Tailwind classes in `hero.gradient`. No image or overlay is rendered.
 *
 * Both modes share identical centred content (badge → h1 → description) extracted
 * into a `content` variable to avoid JSX duplication.
 *
 * @param props - See {@link CaseHeroProps}.
 * @returns A `<section>` with the appropriate background and centred white content.
 *
 * @example
 * // Image-based hero:
 * <CaseHero
 *   hero={{ image: '/img/case-hero.jpg', gradient: '' }}
 *   category="Брендинг"
 *   title="Редизайн бренда ACME"
 *   description="Полный ребрендинг с нуля за 6 недель."
 * />
 *
 * @example
 * // Gradient-only hero (no image):
 * <CaseHero
 *   hero={{ gradient: 'from-violet-600 to-indigo-700' }}
 *   category="Контекстная реклама"
 *   title="Кампания для ритейлера"
 *   description="ROI ×3 за первый квартал."
 * />
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
          className="absolute inset-0 h-full w-full"
          imgClassName="object-cover"
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
