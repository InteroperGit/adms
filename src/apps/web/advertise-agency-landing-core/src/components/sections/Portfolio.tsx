import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout/Container';
import { cn } from '@/lib/utils';
import type { PortfolioCase } from '@/types/portfolio';

const modules = import.meta.glob<PortfolioCase>('@data/portfolio/*.json', {
  eager: true,
  import: 'default',
});

const PORTFOLIO_ITEMS = Object.entries(modules).map(([, data]) => ({
  ...data,
  href: `/portfolio/${data.slug}`,
}));

const PORTFOLIO_CATEGORIES = ['Все', ...new Set(PORTFOLIO_ITEMS.map((i) => i.category))];

export function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('Все');

  const filtered =
    activeCategory === 'Все'
      ? PORTFOLIO_ITEMS
      : PORTFOLIO_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <section id="portfolio" className="bg-white py-24 md:py-32">
      <Container>
        {/* Header */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            Портфолио
          </div>
          <h2 className="mb-4">Наши работы</h2>
          <p className="text-muted-foreground">
            Избранные проекты из разных отраслей — от локального бизнеса до федеральных брендов.
          </p>
        </div>

        {/* Category filter */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {PORTFOLIO_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 sm:px-5 sm:py-2 sm:text-sm',
                activeCategory === category
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {filtered.map((item) => (
            <article
              key={item.slug}
              className="group overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-shadow duration-300 hover:shadow-md"
            >
              {/* Thumbnail */}
              <div className={cn('relative h-40 bg-gradient-to-br sm:h-52', item.gradient)}>
                {item.images?.preview ? (
                  <img
                    src={item.images.preview}
                    alt={item.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  /* Dot overlay fallback for gradient-only cards */
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                      backgroundSize: '20px 20px',
                    }}
                  />
                )}
                {/* Category badge on image */}
                <div className="absolute left-4 top-4">
                  <Badge className="border-0 bg-white/20 text-white backdrop-blur-sm">
                    {item.category}
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="mb-2 text-lg font-semibold leading-snug text-foreground">
                  {item.title}
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>

                {/* Tags */}
                <div className="mb-5 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Link */}
                <a
                  href={item.href}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-gap duration-200 hover:gap-2.5"
                >
                  Подробнее
                  <ArrowRight size={14} />
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 text-center">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full px-8 hover:bg-muted hover:text-primary"
          >
            <a href="#contact">Обсудить ваш проект</a>
          </Button>
        </div>
      </Container>
    </section>
  );
}
