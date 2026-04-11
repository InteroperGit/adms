import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router';

const MOCK_ARTICLE = vi.hoisted(() => ({
  type: 'portfolio' as const,
  slug: 'test-article',
  publishedAt: '2024-05-10T00:00:00Z',
  title: 'Test Article',
  category: 'Брендинг',
  description: 'Test description',
  hero: { gradient: 'from-primary to-accent' },
  tags: ['Брендинг'],
  meta: { title: 'Meta title', description: 'Meta desc' },
  overview: { client: 'ООО Клиент', year: '2024', services: 'Брендинг' },
  content: [],
}));

vi.mock('@/types/articles/allArticles', () => ({
  articleMap: { 'test-article': MOCK_ARTICLE },
  allPortfolioArticles: [MOCK_ARTICLE],
  allServiceArticles: [],
  allNewsArticles: [],
  allBlogArticles: [],
  ArticleType: 'portfolio' as const,
  BaseArticle: typeof MOCK_ARTICLE,
}));

vi.mock('@/types/config/categories', () => ({
  categories: [{ name: 'Брендинг', slug: 'branding' }],
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

vi.mock('@/components/navigation/BreadCrumbs', () => ({
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

import { ArticlePage } from './ArticlePage';

const ROUTE = '/portfolio/:categorySlug/:year/:month/:slug';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path={ROUTE} element={<ArticlePage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('ArticlePage', () => {
  it('renders ArticleHero with article title when slug matches', () => {
    renderAt('/portfolio/branding/2024/05/test-article');
    expect(screen.getByTestId('article-hero')).toHaveTextContent('Test Article');
  });

  it('renders PortfolioOverview with client name', () => {
    renderAt('/portfolio/branding/2024/05/test-article');
    expect(screen.getByTestId('article-overview')).toHaveTextContent('ООО Клиент');
  });

  it('renders ArticleCTA section', () => {
    renderAt('/portfolio/branding/2024/05/test-article');
    expect(screen.getByTestId('article-cta')).toBeInTheDocument();
  });

  it('renders breadcrumbs', () => {
    renderAt('/portfolio/branding/2024/05/test-article');
    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
  });

  it('renders NotFound when slug is not in articleMap', () => {
    renderAt('/portfolio/branding/2024/05/unknown-slug');
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('does not render ArticleHero when slug is unknown', () => {
    renderAt('/portfolio/branding/2024/05/unknown-slug');
    expect(screen.queryByTestId('article-hero')).not.toBeInTheDocument();
  });

  it('renders with "all" as categorySlug', () => {
    renderAt('/portfolio/all/2024/05/test-article');
    expect(screen.getByTestId('article-hero')).toBeInTheDocument();
  });
});
