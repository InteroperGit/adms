import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { PortfolioCard } from '@/components/ui/PortfolioCard';
import { content } from '@/lib/content';
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

const PORTFOLIO_CATEGORIES = [
  content.portfolio.allCategory,
  ...new Set(PORTFOLIO_ITEMS.map((i) => i.category)),
];

export function Portfolio() {
  const { portfolio: p } = content;
  const [activeCategory, setActiveCategory] = useState(p.allCategory);

  const filtered =
    activeCategory === p.allCategory
      ? PORTFOLIO_ITEMS
      : PORTFOLIO_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <section id="portfolio" className="bg-white py-24 md:py-32">
      <Container>
        <SectionHeader
          label={p.label}
          title={p.title}
          description={p.description}
          className="mb-12"
        />

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
            <PortfolioCard key={item.slug} item={item} />
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
            <a href={p.cta.href}>{p.cta.label}</a>
          </Button>
        </div>
      </Container>
    </section>
  );
}
