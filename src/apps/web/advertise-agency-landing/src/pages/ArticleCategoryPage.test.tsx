import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router';

vi.mock('@/types/sections/portfolio/portfolioPage', () => ({
  portfolioPageContent: {
    label: 'Портфолио',
    title: 'Наши работы',
    description: 'Примеры проектов',
  },
}));

vi.mock('@/types/config/portfolioConfig', () => ({
  portfolioConfig: {
    perPage: 9,
    allLabel: 'Все',
    prevLabel: 'Назад',
    nextLabel: 'Вперёд',
    pageLabel: '{current} из {total}',
    emptyLabel: 'Нет проектов.',
    notFoundCategory: 'Не найдено.',
    allProjectsLink: 'Все проекты',
    cta: { label: 'Обсудить', href: '/#contact' },
  },
}));

vi.mock('@/types/config/categories', () => ({
  categories: [
    { name: 'Брендинг', slug: 'branding' },
    { name: 'Веб', slug: 'web' },
  ],
}));

vi.mock('@/types/portfolio/portfolioCases', () => ({
  allPortfolioCases: [
    {
      slug: 'case-1',
      publishedAt: '2024-01-15',
      title: 'Кейс 1',
      category: 'Брендинг',
      description: 'Описание',
      hero: { gradient: 'from-blue-500 to-purple-600' },
      tags: [],
      meta: { title: '', description: '' },
      overview: { client: '', year: '2024', services: '' },
      content: [],
      images: { preview: '/images/case-1.jpg' },
    },
    {
      slug: 'case-2',
      publishedAt: '2024-02-15',
      title: 'Кейс 2',
      category: 'Веб',
      description: 'Описание 2',
      hero: { gradient: 'from-green-500 to-blue-600' },
      tags: [],
      meta: { title: '', description: '' },
      overview: { client: '', year: '2024', services: '' },
      content: [],
    },
    {
      slug: 'case-3',
      publishedAt: '2024-03-15',
      title: 'Кейс 3',
      category: 'Брендинг',
      description: 'Описание 3',
      hero: { gradient: 'from-red-500 to-orange-600' },
      tags: [],
      meta: { title: '', description: '' },
      overview: { client: '', year: '2024', services: '' },
      content: [],
      images: { preview: 'https://external.com/img.jpg' },
    },
  ],
}));

vi.mock('@/types/config/siteData', () => ({
  siteData: { name: 'Рекламастер', homeLabel: 'Главная' },
}));

vi.mock('@/types/config/notFound', () => ({
  notFoundContent: {
    code: '404',
    title: 'Страница не найдена',
    description: '',
    backLabel: 'Все проекты',
    backHref: '/portfolio',
  },
}));

vi.mock('@/components/articles/PortfolioGrid', () => ({
  PortfolioGrid: ({
    items,
    activeSlug,
  }: {
    items: { slug: string; title: string; images?: { preview?: string } }[];
    activeSlug: string | null;
  }) => (
    <div data-testid="portfolio-grid" data-active-slug={activeSlug ?? 'null'}>
      {items.map((item) => (
        <span key={item.slug} data-testid="grid-item" data-has-image={!!item.images?.preview}>
          {item.title}
        </span>
      ))}
    </div>
  ),
}));

vi.mock('@/components/ui/navigation/BreadCrumbs', () => ({
  BreadCrumbs: () => <nav data-testid="breadcrumbs" />,
}));

import { ArticleCategoryPage } from './ArticleCategoryPage';

function renderAtRoute(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/portfolio/:categorySlug" element={<ArticleCategoryPage />} />
        <Route path="/portfolio" element={<ArticleCategoryPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('ArticleCategoryPage', () => {
  it('renders section header title', () => {
    renderAtRoute('/portfolio/all');
    expect(screen.getByText('Наши работы')).toBeInTheDocument();
  });

  it('renders breadcrumbs', () => {
    renderAtRoute('/portfolio/all');
    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
  });

  it('renders portfolio grid', () => {
    renderAtRoute('/portfolio/all');
    expect(screen.getByTestId('portfolio-grid')).toBeInTheDocument();
  });

  it('shows all cases when categorySlug is "all"', () => {
    renderAtRoute('/portfolio/all');
    expect(screen.getAllByTestId('grid-item')).toHaveLength(3);
  });

  it('shows all cases at root /portfolio route', () => {
    renderAtRoute('/portfolio');
    expect(screen.getAllByTestId('grid-item')).toHaveLength(3);
  });

  it('passes activeSlug=null at root /portfolio route', () => {
    renderAtRoute('/portfolio');
    expect(screen.getByTestId('portfolio-grid')).toHaveAttribute('data-active-slug', 'null');
  });

  it('passes activeSlug="all" at /portfolio/all route', () => {
    renderAtRoute('/portfolio/all');
    expect(screen.getByTestId('portfolio-grid')).toHaveAttribute('data-active-slug', 'all');
  });

  it('filters cases when a specific category slug is given', () => {
    renderAtRoute('/portfolio/branding');
    const items = screen.getAllByTestId('grid-item');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent('Кейс 1');
  });

  it('filters to web cases for web slug', () => {
    renderAtRoute('/portfolio/web');
    const items = screen.getAllByTestId('grid-item');
    expect(items).toHaveLength(1);
    expect(items[0]).toHaveTextContent('Кейс 2');
  });

  it('passes case without images.preview — grid item has data-has-image false', () => {
    renderAtRoute('/portfolio/web');
    const items = screen.getAllByTestId('grid-item');
    expect(items[0]).toHaveAttribute('data-has-image', 'false');
  });

  it('passes case with non-/images/ path — still included in results', () => {
    renderAtRoute('/portfolio/branding');
    const items = screen.getAllByTestId('grid-item');
    expect(items.some((el) => el.textContent === 'Кейс 3')).toBe(true);
  });

  it('renders NotFound for an unknown category slug', () => {
    renderAtRoute('/portfolio/unknown-slug');
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('does not render the grid for an unknown slug', () => {
    renderAtRoute('/portfolio/unknown-slug');
    expect(screen.queryByTestId('portfolio-grid')).not.toBeInTheDocument();
  });
});
