// src/pages/PortfolioPage.tsx
import { useEffect } from 'react';
import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { PortfolioGrid } from '@/components/portfolio/PortfolioGrid';
import { BreadCrumbs } from '@/components/ui/BreadCrumbs';
import { portfolioPageContent } from '@/types/sections/portfolioPage';
import { portfolioCaseMap } from '@/types/portfolio/portfolioCases';

const ALL_ITEMS = Object.values(portfolioCaseMap);

export function PortfolioPage() {
  const p = portfolioPageContent;

  useEffect(() => {
    document.title = `${p.title} — РА «Рекламастер»`;
  }, [p.title]);

  return (
    <>
      <BreadCrumbs items={[{ label: 'Главная', href: '/' }, { label: p.title }]} />
      <section className="bg-white py-24 md:py-32">
        <Container>
          <SectionHeader
            label={p.label}
            title={p.title}
            description={p.description}
            className="mb-12"
          />
          <PortfolioGrid items={ALL_ITEMS} activeSlug={null} />
        </Container>
      </section>
    </>
  );
}
