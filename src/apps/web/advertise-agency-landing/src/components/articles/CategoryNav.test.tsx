import { render, screen } from '@/test/utils';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/hooks/useAnimatedPillPosition', () => ({
  useAnimatedPillPosition: vi.fn(() => ({
    position: { top: 0, left: 0, width: 100, height: 36 },
    isAnimating: false,
  })),
}));

import { CategoryNav } from './CategoryNav';

const baseProps = {
  basePath: '/portfolio',
  categories: [
    { name: 'Брендинг', slug: 'branding' },
    { name: 'Контекстная реклама', slug: 'contextual-ads' },
  ],
  allLabel: 'Все',
};

describe('CategoryNav', () => {
  it('renders the "All" link', () => {
    render(<CategoryNav activeSlug={null} {...baseProps} />);
    expect(screen.getByRole('link', { name: 'Все' })).toBeInTheDocument();
  });

  it('renders a link for each category', () => {
    render(<CategoryNav activeSlug={null} {...baseProps} />);
    expect(screen.getByRole('link', { name: 'Брендинг' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Контекстная реклама' })).toBeInTheDocument();
  });

  it('"All" link points to basePath', () => {
    render(<CategoryNav activeSlug={null} {...baseProps} />);
    expect(screen.getByRole('link', { name: 'Все' })).toHaveAttribute('href', '/portfolio');
  });

  it('category links point to the correct paths', () => {
    render(<CategoryNav activeSlug={null} {...baseProps} />);
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
    render(<CategoryNav activeSlug={null} {...baseProps} />);
    expect(screen.getByRole('link', { name: 'Все' })).toHaveClass('text-white');
  });

  it('applies active style to the "All" link when activeSlug is "all"', () => {
    render(<CategoryNav activeSlug="all" {...baseProps} />);
    expect(screen.getByRole('link', { name: 'Все' })).toHaveClass('text-white');
  });

  it('applies active style to the matching category link', () => {
    render(<CategoryNav activeSlug="branding" {...baseProps} />);
    expect(screen.getByRole('link', { name: 'Брендинг' })).toHaveClass('text-white');
  });

  it('applies inactive style to non-active links', () => {
    render(<CategoryNav activeSlug="branding" {...baseProps} />);
    expect(screen.getByRole('link', { name: 'Все' })).toHaveClass('text-muted-foreground');
    expect(screen.getByRole('link', { name: 'Контекстная реклама' })).toHaveClass(
      'text-muted-foreground'
    );
  });

  it('inactive links have an accent border class', () => {
    render(<CategoryNav activeSlug={null} {...baseProps} />);
    expect(screen.getByRole('link', { name: 'Брендинг' })).toHaveClass('border-accent/40');
  });
});
