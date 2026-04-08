import { createMemoryRouter, RouterProvider } from 'react-router';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';

// ---------------------------------------------------------------------------
// window.matchMedia stub (required by useAnimatedPillPosition in CategoryNav)
// ---------------------------------------------------------------------------
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockReturnValue({
      matches: false,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  });
});

// ---------------------------------------------------------------------------
// @/types mocks
// ---------------------------------------------------------------------------
vi.mock('@/types/config/siteData', () => ({
  siteData: {
    name: 'Test Agency',
    homeLabel: 'Главная',
    description: '',
    phone: '',
    email: '',
    address: '',
    mapUrl: '',
    metrikaId: '',
    hours: [],
    socialLinks: [],
    imageOptimization: { widths: [400, 800], quality: 80, format: 'webp' },
  },
}));

vi.mock('@/types/config/portfolioConfig', () => ({
  portfolioConfig: {
    perPage: 2,
    allLabel: 'Все',
    prevLabel: 'Назад',
    nextLabel: 'Вперёд',
    pageLabel: '{current} из {total}',
    emptyLabel: 'Нет проектов.',
    notFoundCategory: 'Категория не найдена.',
    allProjectsLink: 'Все проекты',
    cta: { label: 'Обсудить проект', href: '/#contact' },
  },
}));

vi.mock('@/types/config/categories', () => ({
  categories: [
    { name: 'Брендинг', slug: 'branding' },
    { name: 'Веб', slug: 'web' },
  ],
}));

vi.mock('@/types/sections/portfolio/portfolioPage', () => ({
  portfolioPageContent: {
    label: 'Портфолио',
    title: 'Наши работы',
    description: 'Примеры проектов',
  },
}));

vi.mock('@/types/articles/allArticles', () => ({
  allPortfolioArticles: [],
  allServiceArticles: [],
  allNewsArticles: [],
  allBlogArticles: [],
}));

vi.mock('@/types/config/notFound', () => ({
  notFoundContent: {
    title: 'Страница не найдена',
    code: '404',
    description: 'Такой страницы не существует.',
    backLabel: 'На главную',
    backHref: '/',
  },
}));

// 3 fake cases: 2 branding + 1 web.
// category field must match category.name (used by ArticleCategoryPage filter).
// Order matters for pagination: branding-1, branding-2 on page 1; web-1 on page 2.
vi.mock('@/types/portfolio/portfolioCases', () => ({
  portfolioCaseMap: {},
  allPortfolioCases: [
    {
      slug: 'case-branding-1',
      publishedAt: '2024-03-15',
      title: 'Брендинг кейс 1',
      category: 'Брендинг',
      description: 'Описание 1',
      hero: { gradient: 'from-blue-500 to-purple-600' },
      tags: [],
      meta: { title: '', description: '' },
      overview: { client: 'Клиент 1', year: '2024', services: 'Брендинг' },
      content: [],
    },
    {
      slug: 'case-branding-2',
      publishedAt: '2024-03-20',
      title: 'Брендинг кейс 2',
      category: 'Брендинг',
      description: 'Описание 2',
      hero: { gradient: 'from-purple-500 to-pink-600' },
      tags: [],
      meta: { title: '', description: '' },
      overview: { client: 'Клиент 2', year: '2024', services: 'Брендинг' },
      content: [],
    },
    {
      slug: 'case-web-1',
      publishedAt: '2024-04-10',
      title: 'Веб кейс 1',
      category: 'Веб',
      description: 'Описание веб',
      hero: { gradient: 'from-green-500 to-blue-600' },
      tags: [],
      meta: { title: '', description: '' },
      overview: { client: 'Клиент 3', year: '2024', services: 'Веб' },
      content: [],
    },
  ],
  allPortfolioCasesWithHref: [],
}));

// ---------------------------------------------------------------------------
// Component mocks
// ---------------------------------------------------------------------------

// ArticleCard: mocked to avoid image loading; exposes slug via data-slug.
vi.mock('@/components/articles/ArticleCard', () => ({
  ArticleCard: ({ article }: { article: { slug: string } }) => (
    <div data-testid="portfolio-card" data-slug={article.slug} />
  ),
}));

// BreadCrumbs: not under test here.
vi.mock('@/components/ui/navigation/BreadCrumbs', () => ({
  BreadCrumbs: () => <nav data-testid="breadcrumbs" />,
}));

// ---------------------------------------------------------------------------
// Imports — after all vi.mock() declarations
// ---------------------------------------------------------------------------
import { ArticleCategoryPage } from '@/pages/ArticleCategoryPage';

// ---------------------------------------------------------------------------
// Router helper — minimal route tree for portfolio pages only.
// Note: React Router v7 uses fetch-based routing internally. Navigation via
// Link clicks triggers createClientSideRequest which fails in jsdom (AbortSignal
// mismatch). Tests verify filtering/pagination by rendering at the target path
// directly rather than simulating link clicks within a test.
// ---------------------------------------------------------------------------
function makeRouter(initialPath: string) {
  return createMemoryRouter(
    [
      { path: '/portfolio', element: <ArticleCategoryPage /> },
      { path: '/portfolio/:categorySlug', element: <ArticleCategoryPage /> },
    ],
    { initialEntries: [initialPath] }
  );
}

function renderAt(path: string) {
  return render(<RouterProvider router={makeRouter(path)} />);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('Portfolio filtering integration', () => {
  it('shows page 1 of all cases at /portfolio (perPage=2 → 2 of 3 cards)', () => {
    renderAt('/portfolio');
    // 3 total cases, perPage=2 → page 1 has 2 cards (branding-1, branding-2)
    expect(screen.getAllByTestId('portfolio-card')).toHaveLength(2);
  });

  it('shows only branding cases at /portfolio/branding', () => {
    renderAt('/portfolio/branding');
    const cards = screen.getAllByTestId('portfolio-card');
    // 2 branding cases, perPage=2 → both fit on one page
    expect(cards).toHaveLength(2);
    const slugs = cards.map((c) => c.getAttribute('data-slug'));
    expect(slugs).toContain('case-branding-1');
    expect(slugs).toContain('case-branding-2');
    expect(slugs).not.toContain('case-web-1');
  });

  it('shows only the web case at /portfolio/web', () => {
    renderAt('/portfolio/web');
    const cards = screen.getAllByTestId('portfolio-card');
    expect(cards).toHaveLength(1);
    expect(cards[0]).toHaveAttribute('data-slug', 'case-web-1');
  });

  it('CategoryNav renders filter links for all categories and the "all" link', () => {
    renderAt('/portfolio');
    // "Все" link points to /portfolio
    const allLink = screen.getByRole('link', { name: 'Все' });
    expect(allLink).toHaveAttribute('href', '/portfolio');
    // Category links point to /portfolio/<slug>
    expect(screen.getByRole('link', { name: 'Брендинг' })).toHaveAttribute(
      'href',
      '/portfolio/branding'
    );
    expect(screen.getByRole('link', { name: 'Веб' })).toHaveAttribute('href', '/portfolio/web');
  });

  it('shows pagination controls when total cases exceed perPage', () => {
    renderAt('/portfolio');
    // 3 items, perPage=2 → totalPages=2 → Pagination component renders
    const nextBtn = screen.getByRole('button', { name: 'Вперёд →' });
    const prevBtn = screen.getByRole('button', { name: /← Назад/ });
    expect(nextBtn).toBeInTheDocument();
    expect(nextBtn).not.toBeDisabled();
    // Prev is disabled on page 1
    expect(prevBtn).toBeDisabled();
  });

  it('renders page 2 content when ?page=2 is in the URL', () => {
    // ?page=2 → safePage=2 → items.slice(2, 4) → only case-web-1
    renderAt('/portfolio?page=2');
    const cards = screen.getAllByTestId('portfolio-card');
    expect(cards).toHaveLength(1);
    expect(cards[0]).toHaveAttribute('data-slug', 'case-web-1');
  });
});
