// src/components/sections/portfolio/index.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/ui/section/SectionHeader';
import { FadeInSection } from '@/components/ui/section/FadeInSection';
import { PortfolioCard } from '@/components/ui/portfolio/PortfolioCard';
import { PortfolioFilter } from '@/components/sections/portfolio/PortfolioFilter';
import { portfolioSectionContent } from '@/types/portfolio';
import type { PortfolioCase } from '@/types/portfolio';
import { categorySlug } from '@/libs/categorySlug';
import { extractYearMonth } from '@/libs/dateUtils';

const modules = import.meta.glob<PortfolioCase>('@data/portfolio/**/*.json', {
  eager: true,
  import: 'default',
});

const PORTFOLIO_ITEMS = Object.entries(modules).map(([, data]) => {
  const { year, month } = extractYearMonth(data.publishDate);
  return {
    ...data,
    href: `/portfolio/${categorySlug(data.category)}/${year}/${month}/${data.slug}`,
  };
});

const PORTFOLIO_CATEGORIES = [
  portfolioSectionContent.allCategory,
  ...new Set(PORTFOLIO_ITEMS.map((i) => i.category)),
];

const PREVIEW_LIMIT = 6;

/**
 * @component
 * @description Portfolio section displaying up to 6 featured cases with category filter. Loads cases from nested JSON data structure with dynamic routing. Includes "View All" CTA.
 * @returns {JSX.Element} Full-width section with header, category filter tabs, case cards grid, and view all button
 * @example <caption>Portfolio section on home page</caption>
 * <Portfolio />
 */
export function Portfolio() {
  const p = portfolioSectionContent;
  const [activeCategory, setActiveCategory] = useState(p.allCategory);

  const filtered =
    activeCategory === p.allCategory
      ? PORTFOLIO_ITEMS
      : PORTFOLIO_ITEMS.filter((item) => item.category === activeCategory);

  const displayed = filtered.slice(0, PREVIEW_LIMIT);

  return (
    <FadeInSection id="portfolio" className="bg-background py-24 md:py-32">
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
          {displayed.map((item) => (
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
    </FadeInSection>
  );
}
