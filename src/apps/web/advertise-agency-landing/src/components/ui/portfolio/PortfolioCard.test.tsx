import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PortfolioCard } from './PortfolioCard';
import type { PortfolioCaseWithHref } from '@/types/portfolio';

vi.mock('@/types/portfolio', () => ({
  portfolioSectionContent: { detailsLabel: 'Подробнее' },
}));

vi.mock('@/components/ui/portfolio/PortfolioThumbnail', () => ({
  PortfolioThumbnail: vi.fn(
    ({
      href,
      image,
      title,
      category,
    }: {
      href: string;
      image?: string;
      title: string;
      category: string;
    }) => (
      <div
        data-testid="portfolio-thumbnail"
        data-href={href}
        data-image={image}
        data-title={title}
        data-category={category}
      />
    )
  ),
}));

const mockItem: PortfolioCaseWithHref = {
  type: 'portfolio',
  slug: 'test-case',
  publishedAt: '2024-01-01',
  title: 'Тестовый кейс',
  category: 'branding',
  description: 'Описание тестового кейса для проверки рендеринга.',
  hero: { gradient: 'from-blue-500 to-purple-600' },
  tags: ['SEO', 'Контент'],
  meta: { title: 'Meta Title', description: 'Meta Desc' },
  overview: { client: 'Клиент', year: '2024', services: 'Брендинг' },
  content: [],
  images: { preview: '/images/preview.jpg' },
  href: '/portfolio/branding/test-case',
};

describe('PortfolioCard', () => {
  it('renders the case title', () => {
    render(<PortfolioCard item={mockItem} />);
    expect(screen.getByText('Тестовый кейс')).toBeInTheDocument();
  });

  it('renders the description', () => {
    render(<PortfolioCard item={mockItem} />);
    expect(
      screen.getByText('Описание тестового кейса для проверки рендеринга.')
    ).toBeInTheDocument();
  });

  it('renders all tags as badges', () => {
    render(<PortfolioCard item={mockItem} />);
    expect(screen.getByText('SEO')).toBeInTheDocument();
    expect(screen.getByText('Контент')).toBeInTheDocument();
  });

  it('renders the details link with correct href', () => {
    render(<PortfolioCard item={mockItem} />);
    const link = screen.getByRole('link', { name: /Подробнее/i });
    expect(link).toHaveAttribute('href', '/portfolio/branding/test-case');
  });

  it('renders the PortfolioThumbnail with correct props', () => {
    render(<PortfolioCard item={mockItem} />);
    const thumbnail = screen.getByTestId('portfolio-thumbnail');
    expect(thumbnail).toHaveAttribute('data-href', '/portfolio/branding/test-case');
    expect(thumbnail).toHaveAttribute('data-image', '/images/preview.jpg');
    expect(thumbnail).toHaveAttribute('data-title', 'Тестовый кейс');
    expect(thumbnail).toHaveAttribute('data-category', 'branding');
  });

  it('renders as an article element', () => {
    const { container } = render(<PortfolioCard item={mockItem} />);
    expect(container.querySelector('article')).toBeInTheDocument();
  });

  it('renders without a preview image when images are absent', () => {
    const itemNoImages: PortfolioCaseWithHref = { ...mockItem, images: undefined };
    render(<PortfolioCard item={itemNoImages} />);
    const thumbnail = screen.getByTestId('portfolio-thumbnail');
    expect(thumbnail).not.toHaveAttribute('data-image');
  });
});
