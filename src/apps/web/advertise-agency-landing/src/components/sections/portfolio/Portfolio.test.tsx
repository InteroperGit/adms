import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/hooks/useStaggeredReveal', () => ({
  useStaggeredReveal: () => ({
    ref: { current: null },
    isVisible: true,
    getDelay: (i: number) => i * 60,
  }),
}));

vi.mock('@/hooks/useAnimatedPillPosition', () => ({
  useAnimatedPillPosition: () => ({
    position: { top: 0, left: 0, width: 0, height: 0 },
    isAnimating: false,
  }),
}));

vi.mock('@/types/portfolio', () => ({
  portfolioSectionContent: {
    allCategory: 'Все',
    label: 'Портфолио',
    title: 'Наши работы',
    description: 'Примеры выполненных проектов',
    cta: { href: '/portfolio', label: 'Смотреть все' },
  },
}));

vi.mock('@/types/portfolio/portfolioCases', () => ({
  allPortfolioCasesWithHrefs: [
    {
      slug: 'case-1',
      publishedAt: '2024-01-01',
      title: 'Кейс 1',
      category: 'Брендинг',
      description: 'Описание кейса 1',
      hero: { gradient: 'from-blue-500 to-purple-600' },
      tags: ['Лого'],
      meta: { title: '', description: '' },
      overview: { client: '', year: '2024', services: '' },
      content: [],
      href: '/portfolio/branding/2024/01/case-1',
    },
    {
      slug: 'case-2',
      publishedAt: '2024-02-01',
      title: 'Кейс 2',
      category: 'Веб',
      description: 'Описание кейса 2',
      hero: { gradient: 'from-green-500 to-blue-600' },
      tags: ['Сайт'],
      meta: { title: '', description: '' },
      overview: { client: '', year: '2024', services: '' },
      content: [],
      href: '/portfolio/web/2024/02/case-2',
    },
    {
      slug: 'case-3',
      publishedAt: '2024-03-01',
      title: 'Кейс 3',
      category: 'Брендинг',
      description: 'Описание кейса 3',
      hero: { gradient: 'from-red-500 to-pink-600' },
      tags: ['Фирменный стиль'],
      meta: { title: '', description: '' },
      overview: { client: '', year: '2024', services: '' },
      content: [],
      href: '/portfolio/branding/2024/03/case-3',
    },
  ],
}));

vi.mock('@/components/ui/portfolio/PortfolioCard', () => ({
  PortfolioCard: ({ item }: { item: { title: string; slug: string } }) => (
    <div data-testid={`portfolio-card-${item.slug}`}>{item.title}</div>
  ),
}));

import { Portfolio } from './index';

describe('Portfolio', () => {
  it('renders the section with id="portfolio"', () => {
    const { container } = render(<Portfolio />);
    expect(container.querySelector('#portfolio')).toBeInTheDocument();
  });

  it('renders the section header label', () => {
    render(<Portfolio />);
    expect(screen.getByText('Портфолио')).toBeInTheDocument();
  });

  it('renders the section header title', () => {
    render(<Portfolio />);
    expect(screen.getByText('Наши работы')).toBeInTheDocument();
  });

  it('renders the section header description', () => {
    render(<Portfolio />);
    expect(screen.getByText('Примеры выполненных проектов')).toBeInTheDocument();
  });

  it('renders filter tabs for each category plus "All"', () => {
    render(<Portfolio />);
    expect(screen.getByRole('button', { name: 'Все' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Брендинг' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Веб' })).toBeInTheDocument();
  });

  it('renders all cases by default (no more than PREVIEW_LIMIT=6)', () => {
    render(<Portfolio />);
    expect(screen.getByTestId('portfolio-card-case-1')).toBeInTheDocument();
    expect(screen.getByTestId('portfolio-card-case-2')).toBeInTheDocument();
    expect(screen.getByTestId('portfolio-card-case-3')).toBeInTheDocument();
  });

  it('renders the "view all" CTA link', () => {
    render(<Portfolio />);
    const link = screen.getByRole('link', { name: 'Смотреть все' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/portfolio');
  });

  it('filters cards when a category tab is clicked', async () => {
    const user = userEvent.setup();
    render(<Portfolio />);

    await user.click(screen.getByRole('button', { name: 'Брендинг' }));

    expect(screen.getByTestId('portfolio-card-case-1')).toBeInTheDocument();
    expect(screen.getByTestId('portfolio-card-case-3')).toBeInTheDocument();
    expect(screen.queryByTestId('portfolio-card-case-2')).not.toBeInTheDocument();
  });

  it('restores all cards when "All" tab is clicked after filtering', async () => {
    const user = userEvent.setup();
    render(<Portfolio />);

    await user.click(screen.getByRole('button', { name: 'Брендинг' }));
    await user.click(screen.getByRole('button', { name: 'Все' }));

    expect(screen.getByTestId('portfolio-card-case-1')).toBeInTheDocument();
    expect(screen.getByTestId('portfolio-card-case-2')).toBeInTheDocument();
    expect(screen.getByTestId('portfolio-card-case-3')).toBeInTheDocument();
  });
});
