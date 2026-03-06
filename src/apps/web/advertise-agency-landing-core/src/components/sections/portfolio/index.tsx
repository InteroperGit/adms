// src/components/sections/portfolio/index.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { PortfolioCard } from '@/components/ui/PortfolioCard';
import { PortfolioFilter } from '@/components/sections/portfolio/PortfolioFilter';
import { portfolioSectionContent } from '@/types/portfolio';
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
  portfolioSectionContent.allCategory,
  ...new Set(PORTFOLIO_ITEMS.map((i) => i.category)),
];

export function Portfolio() {
  const p = portfolioSectionContent;
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

        <PortfolioFilter
          categories={PORTFOLIO_CATEGORIES}
          active={activeCategory}
          onChange={setActiveCategory}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {filtered.map((item) => (
            <PortfolioCard key={item.slug} item={item} />
          ))}
        </div>

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
