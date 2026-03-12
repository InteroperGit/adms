// src/pages/PortfolioCategoryPage.tsx
import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { PortfolioGrid } from '@/components/portfolio/PortfolioGrid';
import { BreadCrumbs } from '@/components/ui/BreadCrumbs';
import { portfolioPageContent } from '@/types/sections/portfolioPage';
import { portfolioConfig } from '@/types/config/portfolioConfig';
import { categories } from '@/types/config/categories';
import { portfolioCaseMap } from '@/types/portfolio/portfolioCases';

const ALL_ITEMS = Object.values(portfolioCaseMap);

export function PortfolioCategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const p = portfolioPageContent;

  const isAll = categorySlug === 'all';
  const category = isAll ? null : categories.find((c) => c.slug === categorySlug);
  const categoryLabel = isAll ? portfolioConfig.allLabel : (category?.name ?? '');

  useEffect(() => {
    if (isAll) {
      document.title = `${p.title} — РА «Рекламастер»`;
    } else if (category) {
      document.title = `${category.name} — Портфолио — РА «Рекламастер»`;
    }
  }, [isAll, category, p.title]);

  if (!isAll && !category) {
    return (
      <section className="bg-background py-24 md:py-32">
        <Container>
          <p className="mb-4 text-center text-muted-foreground">Категория не найдена.</p>
          <div className="text-center">
            <Link to="/portfolio" className="text-primary underline underline-offset-4">
              Все проекты
            </Link>
          </div>
        </Container>
      </section>
    );
  }

  const filtered = isAll ? ALL_ITEMS : ALL_ITEMS.filter((item) => item.category === category!.name);

  return (
    <>
      <BreadCrumbs
        items={[
          { label: 'Главная', href: '/' },
          { label: p.title, href: '/portfolio' },
          { label: categoryLabel },
        ]}
      />
      <section className="bg-background py-24 md:py-32">
        <Container>
          <SectionHeader
            label={p.label}
            title={p.title}
            description={p.description}
            className="mb-12"
          />
          <PortfolioGrid items={filtered} activeSlug={categorySlug ?? null} />
        </Container>
      </section>
    </>
  );
}
