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
      publishDate: '2024-01-15',
      title: 'Кейс 1',
      category: 'Брендинг',
      description: 'Описание',
      hero: { gradient: 'from-blue-500 to-purple-600' },
      tags: [],
      meta: { title: '', description: '' },
      overview: { client: '', year: '2024', services: '' },
      content: [],
    },
    {
      slug: 'case-2',
      publishDate: '2024-02-15',
      title: 'Кейс 2',
      category: 'Веб',
      description: 'Описание 2',
      hero: { gradient: 'from-green-500 to-blue-600' },
      tags: [],
      meta: { title: '', description: '' },
      overview: { client: '', year: '2024', services: '' },
      content: [],
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

vi.mock('@/components/portfolio/PortfolioGrid', () => ({
  PortfolioGrid: ({ items }: { items: { slug: string; title: string }[] }) => (
    <div data-testid="portfolio-grid">
      {items.map((item) => (
        <span key={item.slug} data-testid="grid-item">
          {item.title}
        </span>
      ))}
    </div>
  ),
}));

vi.mock('@/components/ui/navigation/BreadCrumbs', () => ({
  BreadCrumbs: () => <nav data-testid="breadcrumbs" />,
}));

import { PortfolioCategoryPage } from './PortfolioCategoryPage';

function renderAtRoute(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/portfolio/:categorySlug" element={<PortfolioCategoryPage />} />
        <Route path="/portfolio" element={<PortfolioCategoryPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('PortfolioCategoryPage', () => {
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
    expect(screen.getAllByTestId('grid-item')).toHaveLength(2);
  });

  it('filters cases when a specific category slug is given', () => {
    renderAtRoute('/portfolio/branding');
    const items = screen.getAllByTestId('grid-item');
    expect(items).toHaveLength(1);
    expect(items[0]).toHaveTextContent('Кейс 1');
  });

  it('filters to web cases for web slug', () => {
    renderAtRoute('/portfolio/web');
    const items = screen.getAllByTestId('grid-item');
    expect(items).toHaveLength(1);
    expect(items[0]).toHaveTextContent('Кейс 2');
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
