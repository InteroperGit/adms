import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/shared/section/SectionHeader';
import { useStaggeredReveal } from '@/hooks/useStaggeredReveal';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { PortfolioFilter } from '@/components/sections/portfolio/PortfolioFilter';
import { allPortfolioArticles } from '@/types/articles/allArticles';
import { portfolioConfig } from '@/types/config/portfolioConfig';
import { portfolioSectionContent } from '@/types/sections/portfolio/portfolioContent.ts';
import { categories } from '@/types/config/categories';
import { getArticleHref } from '@/libs/articleUtils';
import { cn } from '@/libs/utils';

// --- Constants ---

const ARTICLE_TYPE = 'portfolio' as const;

const GRID_COLS = 'grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3';

const PREVIEW_LIMIT = 6;

const ITEMS = allPortfolioArticles;

const CATEGORIES: string[] = [
  portfolioSectionContent.allCategory,
  ...categories.map((c) => c.name),
];

// --- Component ---

/**
 * @component
 * @description Portfolio section displaying up to 6 featured cases with category filter.
 *   Loads cases from nested JSON data structure with dynamic routing. Includes "View All" CTA.
 * @returns {JSX.Element} Full-width section with header, category filter tabs,
 *   case cards grid with staggered reveal, and view all button
 * @example <caption>Portfolio section on home page</caption>
 * <Portfolio />
 */
export function Portfolio() {
  const { allCategory, label, title, description, cta } = portfolioSectionContent;
  const [activeCategory, setActiveCategory] = useState(allCategory);

  const isAll = activeCategory === allCategory;

  const filtered = isAll ? ITEMS : ITEMS.filter((item) => item.category === activeCategory);

  const displayed = filtered.slice(0, PREVIEW_LIMIT);

  const { ref, isVisible, getDelay } = useStaggeredReveal();

  return (
    <section id="portfolio" className="bg-background py-24 md:py-32">
      <Container>
        <SectionHeader label={label} title={title} description={description} className="mb-12" />

        <PortfolioFilter
          categories={CATEGORIES}
          active={activeCategory}
          onChange={setActiveCategory}
        />

        <div ref={ref} className={cn(GRID_COLS, isVisible && 'stagger-visible')}>
          {displayed.map((item, index) => (
            <div
              key={item.slug}
              className="stagger-item h-full"
              style={{ animationDelay: `${getDelay(index)}ms` }}
            >
              <ArticleCard
                article={{
                  ...item,
                  href: getArticleHref(ARTICLE_TYPE, item, item.category ?? ''),
                }}
                detailsLabel={portfolioConfig.detailsLabel}
              />
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full px-8 dark:border-primary/50 hover:bg-muted hover:text-primary"
          >
            <a href={cta.href}>{cta.label}</a>
          </Button>
        </div>
      </Container>
    </section>
  );
}

export default Portfolio;
