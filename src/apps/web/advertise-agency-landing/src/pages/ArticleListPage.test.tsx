import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router';

const NEWS_ITEMS = vi.hoisted(() => [
  {
    type: 'news' as const,
    slug: 'news-1',
    publishedAt: '2024-05-01T00:00:00Z',
    title: 'News One',
    category: 'General',
    description: 'First news article',
    hero: { gradient: 'from-blue-500 to-purple-600' },
    tags: [],
    meta: { title: '', description: '' },
    content: [],
  },
  {
    type: 'news' as const,
    slug: 'news-2',
    publishedAt: '2024-05-10T00:00:00Z',
    title: 'News Two',
    category: 'General',
    description: 'Second news article',
    hero: { gradient: 'from-green-500 to-blue-600' },
    tags: [],
    meta: { title: '', description: '' },
    content: [],
  },
]);

const BLOG_ITEMS = vi.hoisted(() => [
  {
    type: 'blog' as const,
    slug: 'blog-1',
    publishedAt: '2024-06-01T00:00:00Z',
    title: 'Blog Post One',
    category: 'Marketing',
    description: 'First blog post',
    hero: { gradient: 'from-accent to-primary' },
    tags: [],
    meta: { title: '', description: '' },
    content: [],
  },
]);

vi.mock('@/types/articles/allArticles', () => ({
  articleMap: { 'news-1': NEWS_ITEMS[0], 'news-2': NEWS_ITEMS[1], 'blog-1': BLOG_ITEMS[0] },
  allPortfolioArticles: [],
  allServiceArticles: [],
  allNewsArticles: NEWS_ITEMS,
  allBlogArticles: BLOG_ITEMS,
}));

vi.mock('@/types/config/siteData', () => ({
  siteData: { name: 'Рекламастер', homeLabel: 'Главная' },
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

vi.mock('@/components/shared/section/SectionHeader', () => ({
  SectionHeader: ({ title, description }: { title: string; description: string }) => (
    <div data-testid="section-header">
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  ),
}));

vi.mock('@/components/articles/Pagination', () => ({
  Pagination: ({ current, total }: { current: number; total: number }) => (
    <div data-testid="pagination">
      Page {current} of {total}
    </div>
  ),
}));

vi.mock('@/components/navigation/BreadCrumbs', () => ({
  BreadCrumbs: () => <nav data-testid="breadcrumbs" />,
}));

import { ArticleListPage } from './ArticleListPage';

function renderAtRoute(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/news" element={<ArticleListPage />} />
        <Route path="/blog" element={<ArticleListPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('ArticleListPage', () => {
  it('renders section header with type label for news', () => {
    renderAtRoute('/news');
    expect(screen.getByTestId('section-header')).toHaveTextContent('Новости');
  });

  it('renders section header with type label for blog', () => {
    renderAtRoute('/blog');
    expect(screen.getByTestId('section-header')).toHaveTextContent('Блог');
  });

  it('renders breadcrumbs', () => {
    renderAtRoute('/news');
    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
  });

  it('renders all articles when under PER_PAGE limit', () => {
    renderAtRoute('/news');
    expect(screen.getByText('News One')).toBeInTheDocument();
    expect(screen.getByText('News Two')).toBeInTheDocument();
  });

  it('renders links to individual articles', () => {
    renderAtRoute('/news');
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThanOrEqual(2);
  });

  it('does not render pagination when all items fit on one page', () => {
    renderAtRoute('/news');
    expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
  });

  it('displays article descriptions', () => {
    renderAtRoute('/news');
    expect(screen.getByText('First news article')).toBeInTheDocument();
  });

  it('renders blog articles on /blog route', () => {
    renderAtRoute('/blog');
    expect(screen.getByText('Blog Post One')).toBeInTheDocument();
  });
});
