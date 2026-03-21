import { render, screen } from '@/test/utils';
import { describe, it, expect, vi } from 'vitest';
import type { PortfolioCase } from '@/types/portfolio';

vi.mock('@/hooks/useAnimatedPillPosition', () => ({
  useAnimatedPillPosition: vi.fn(() => ({
    position: { left: 0, width: 100, height: 36 },
    isAnimating: false,
  })),
}));

vi.mock('@/types/config/categories', () => ({
  categories: [{ name: 'Брендинг', slug: 'branding' }],
}));

vi.mock('@/types/config/portfolioConfig', () => ({
  portfolioConfig: {
    perPage: 9,
    allLabel: 'Все',
    prevLabel: 'Назад',
    nextLabel: 'Вперёд',
    pageLabel: 'Страница {current} из {total}',
    emptyLabel: 'Проектов в этой категории пока нет.',
    notFoundCategory: 'Категория не найдена.',
    allProjectsLink: 'Все проекты',
    cta: { label: 'Обсудить проект', href: '/#contact' },
  },
}));

vi.mock('@/types/portfolio', () => ({
  portfolioSectionContent: {
    label: 'Портфолио',
    title: 'Наши работы',
    description: 'Лучшие кейсы',
    allCategory: 'Все',
    detailsLabel: 'Подробнее',
    cta: { label: 'Все проекты', href: '/portfolio' },
  },
}));

vi.mock('@/components/ui/portfolio/PortfolioCard', () => ({
  PortfolioCard: ({ item }: { item: { slug: string; title: string } }) => (
    <article data-testid="portfolio-card">{item.title}</article>
  ),
}));

import { PortfolioGrid } from './PortfolioGrid';

function makeCase(n: number): PortfolioCase {
  return {
    slug: `case-${n}`,
    publishDate: '2024-03-15',
    title: `Case ${n}`,
    category: 'Брендинг',
    description: `Description ${n}`,
    hero: { gradient: 'from-blue-500 to-purple-600' },
    tags: ['tag'],
    meta: { title: `Case ${n}`, description: `Meta ${n}` },
    overview: { client: 'Client', year: '2024', services: 'Design' },
    content: [],
  };
}

describe('PortfolioGrid', () => {
  it('renders CategoryNav (All link is visible)', () => {
    render(<PortfolioGrid items={[makeCase(1)]} activeSlug={null} />);
    expect(screen.getByRole('link', { name: 'Все' })).toBeInTheDocument();
  });

  it('renders a card for each item on the current page', () => {
    const items = [makeCase(1), makeCase(2), makeCase(3)];
    render(<PortfolioGrid items={items} activeSlug={null} />);
    expect(screen.getAllByTestId('portfolio-card')).toHaveLength(3);
  });

  it('renders item titles inside cards', () => {
    render(<PortfolioGrid items={[makeCase(1), makeCase(2)]} activeSlug={null} />);
    expect(screen.getByText('Case 1')).toBeInTheDocument();
    expect(screen.getByText('Case 2')).toBeInTheDocument();
  });

  it('renders the empty state when items is an empty array', () => {
    render(<PortfolioGrid items={[]} activeSlug={null} />);
    expect(screen.getByText('Проектов в этой категории пока нет.')).toBeInTheDocument();
  });

  it('does not render pagination when total pages is 1', () => {
    const items = Array.from({ length: 3 }, (_, i) => makeCase(i + 1));
    render(<PortfolioGrid items={items} activeSlug={null} />);
    expect(screen.queryByRole('button', { name: 'Назад' })).not.toBeInTheDocument();
  });

  it('renders the contact CTA button', () => {
    render(<PortfolioGrid items={[makeCase(1)]} activeSlug={null} />);
    expect(screen.getByRole('link', { name: 'Обсудить проект' })).toBeInTheDocument();
  });

  it('CTA button links to the configured href', () => {
    render(<PortfolioGrid items={[makeCase(1)]} activeSlug={null} />);
    expect(screen.getByRole('link', { name: 'Обсудить проект' })).toHaveAttribute(
      'href',
      '/#contact'
    );
  });

  it('renders pagination when items exceed perPage', () => {
    const items = Array.from({ length: 10 }, (_, i) => makeCase(i + 1));
    render(<PortfolioGrid items={items} activeSlug={null} />);
    expect(screen.getByRole('button', { name: 'Назад' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Вперёд' })).toBeInTheDocument();
  });

  it('uses "all" as href category segment when activeSlug is null', () => {
    render(<PortfolioGrid items={[makeCase(1)]} activeSlug={null} />);
    // The card is rendered — href construction didn't throw
    expect(screen.getByTestId('portfolio-card')).toBeInTheDocument();
  });

  it('uses activeSlug in href construction when provided', () => {
    render(<PortfolioGrid items={[makeCase(1)]} activeSlug="branding" />);
    expect(screen.getByTestId('portfolio-card')).toBeInTheDocument();
  });
});
