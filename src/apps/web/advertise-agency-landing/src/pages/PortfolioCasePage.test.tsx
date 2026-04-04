import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router';
import type { PortfolioCase } from '@/types/portfolio';

const { MOCK_CASE } = vi.hoisted(() => {
  const MOCK_CASE: PortfolioCase = {
    slug: 'test-case',
    publishedAt: '2024-05-10',
    title: 'Тестовый кейс',
    category: 'Брендинг',
    description: 'Описание тестового кейса',
    hero: { gradient: 'from-blue-500 to-purple-600' },
    tags: ['Лого'],
    meta: { title: 'Meta title', description: 'Meta desc' },
    overview: { client: 'ООО Клиент', year: '2024', services: 'Брендинг' },
    content: [],
  };
  return { MOCK_CASE };
});

vi.mock('@/types/portfolio/portfolioCases', () => ({
  portfolioCaseMap: { 'test-case': MOCK_CASE },
}));

vi.mock('@/types/portfolio/portfolioCaseContent', () => ({
  portfolioCaseContent: {
    backLabel: '← Портфолио',
    overviewLabels: { client: 'Клиент', category: 'Категория', year: 'Год', services: 'Услуги' },
    challengeTitle: 'Задача',
    solutionTitle: 'Решение',
    resultsTitle: 'Результаты',
    cta: { title: 'Обсудить проект', subtitle: '', label: 'Связаться', href: '/#contact' },
    notFound: { title: 'Кейс не найден', back: 'Назад к портфолио' },
  },
}));

vi.mock('@/types/sections/portfolio/portfolioPage', () => ({
  portfolioPageContent: { label: 'Портфолио', title: 'Наши работы', description: '' },
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
    pageLabel: '',
    emptyLabel: '',
    notFoundCategory: '',
    allProjectsLink: 'Все проекты',
    cta: { label: 'Обсудить', href: '/#contact' },
  },
}));

vi.mock('@/types/config/siteData', () => ({
  siteData: { name: 'Рекламастер', homeLabel: 'Главная' },
}));

vi.mock('@/components/articles/ArticleHero', () => ({
  ArticleHero: ({ title }: { title: string }) => <div data-testid="article-hero">{title}</div>,
}));

vi.mock('@/components/articles/PortfolioOverview', () => ({
  PortfolioOverview: ({ client }: { client: string }) => (
    <div data-testid="article-overview">{client}</div>
  ),
}));

vi.mock('@/components/articles/ArticleCTA', () => ({
  ArticleCTA: () => <div data-testid="article-cta" />,
}));

vi.mock('@/components/blocks/BlockRenderer', () => ({
  BlockRenderer: () => <div data-testid="block-renderer" />,
}));

vi.mock('@/components/ui/navigation/BreadCrumbs', () => ({
  BreadCrumbs: () => <nav data-testid="breadcrumbs" />,
}));

vi.mock('@/types/config/notFound', () => ({
  notFoundContent: {
    code: '404',
    title: 'Страница не найдена',
    description: '',
    backLabel: 'На главную',
    backHref: '/',
  },
}));

import { PortfolioCasePage } from './PortfolioCasePage';

const ROUTE = '/portfolio/:categorySlug/:year/:month/:caseSlug';

function renderCase(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path={ROUTE} element={<PortfolioCasePage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('PortfolioCasePage', () => {
  it('renders ArticleHero with case title when slug matches', () => {
    renderCase('/portfolio/branding/2024/05/test-case');
    expect(screen.getByTestId('article-hero')).toHaveTextContent('Тестовый кейс');
  });

  it('renders PortfolioOverview with client name', () => {
    renderCase('/portfolio/branding/2024/05/test-case');
    expect(screen.getByTestId('article-overview')).toHaveTextContent('ООО Клиент');
  });

  it('renders ArticleCTA section', () => {
    renderCase('/portfolio/branding/2024/05/test-case');
    expect(screen.getByTestId('article-cta')).toBeInTheDocument();
  });

  it('renders breadcrumbs', () => {
    renderCase('/portfolio/branding/2024/05/test-case');
    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
  });

  it('renders NotFound (404 code) when caseSlug is not in the map', () => {
    renderCase('/portfolio/branding/2024/05/unknown-slug');
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('does not render ArticleHero when slug is unknown', () => {
    renderCase('/portfolio/branding/2024/05/unknown-slug');
    expect(screen.queryByTestId('article-hero')).not.toBeInTheDocument();
  });

  it('renders with "all" as categorySlug', () => {
    renderCase('/portfolio/all/2024/05/test-case');
    expect(screen.getByTestId('article-hero')).toBeInTheDocument();
  });
});
