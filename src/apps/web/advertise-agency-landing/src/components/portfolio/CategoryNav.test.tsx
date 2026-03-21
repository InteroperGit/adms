import { render, screen } from '@/test/utils';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/hooks/useAnimatedPillPosition', () => ({
  useAnimatedPillPosition: vi.fn(() => ({
    position: { top: 0, left: 0, width: 100, height: 36 },
    isAnimating: false,
  })),
}));

vi.mock('@/types/config/categories', () => ({
  categories: [
    { name: 'Брендинг', slug: 'branding' },
    { name: 'Контекстная реклама', slug: 'contextual-ads' },
  ],
}));

vi.mock('@/types/config/portfolioConfig', () => ({
  portfolioConfig: {
    perPage: 9,
    allLabel: 'Все',
    prevLabel: 'Назад',
    nextLabel: 'Вперёд',
    pageLabel: 'Страница {current} из {total}',
    emptyLabel: 'Проектов нет.',
    notFoundCategory: 'Категория не найдена.',
    allProjectsLink: 'Все проекты',
    cta: { label: 'Обсудить проект', href: '/#contact' },
  },
}));

import { CategoryNav } from './CategoryNav';

describe('CategoryNav', () => {
  it('renders the "All" link', () => {
    render(<CategoryNav activeSlug={null} />);
    expect(screen.getByRole('link', { name: 'Все' })).toBeInTheDocument();
  });

  it('renders a link for each category', () => {
    render(<CategoryNav activeSlug={null} />);
    expect(screen.getByRole('link', { name: 'Брендинг' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Контекстная реклама' })).toBeInTheDocument();
  });

  it('"All" link points to /portfolio', () => {
    render(<CategoryNav activeSlug={null} />);
    expect(screen.getByRole('link', { name: 'Все' })).toHaveAttribute('href', '/portfolio');
  });

  it('category links point to the correct paths', () => {
    render(<CategoryNav activeSlug={null} />);
    expect(screen.getByRole('link', { name: 'Брендинг' })).toHaveAttribute(
      'href',
      '/portfolio/branding'
    );
    expect(screen.getByRole('link', { name: 'Контекстная реклама' })).toHaveAttribute(
      'href',
      '/portfolio/contextual-ads'
    );
  });

  it('applies active style to the "All" link when activeSlug is null', () => {
    render(<CategoryNav activeSlug={null} />);
    expect(screen.getByRole('link', { name: 'Все' })).toHaveClass('text-white');
  });

  it('applies active style to the "All" link when activeSlug is "all"', () => {
    render(<CategoryNav activeSlug="all" />);
    expect(screen.getByRole('link', { name: 'Все' })).toHaveClass('text-white');
  });

  it('applies active style to the matching category link', () => {
    render(<CategoryNav activeSlug="branding" />);
    expect(screen.getByRole('link', { name: 'Брендинг' })).toHaveClass('text-white');
  });

  it('applies inactive style to non-active links', () => {
    render(<CategoryNav activeSlug="branding" />);
    expect(screen.getByRole('link', { name: 'Все' })).toHaveClass('text-muted-foreground');
    expect(screen.getByRole('link', { name: 'Контекстная реклама' })).toHaveClass(
      'text-muted-foreground'
    );
  });

  it('inactive links have an accent border class', () => {
    render(<CategoryNav activeSlug={null} />);
    expect(screen.getByRole('link', { name: 'Брендинг' })).toHaveClass('border-accent/40');
  });
});
