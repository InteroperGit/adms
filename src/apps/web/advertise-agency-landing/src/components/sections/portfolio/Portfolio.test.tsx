// src/components/sections/portfolio/Portfolio.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Portfolio } from './index';

const mocks = vi.hoisted(() => ({
  portfolioTestData: {
    allCategory: 'All',
    label: 'Portfolio',
    title: 'Selected cases',
    description: 'A few featured projects',
    cta: {
      label: 'View all',
      href: '/portfolio',
    },
    categories: ['Web', 'DevOps'],
    articles: [
      {
        slug: 'web-a',
        title: 'Web A',
        category: 'Web',
        href: '/portfolio/web/web-a',
      },
      {
        slug: 'web-b',
        title: 'Web B',
        category: 'Web',
        href: '/portfolio/web/web-b',
      },
      {
        slug: 'devops-a',
        title: 'DevOps A',
        category: 'DevOps',
        href: '/portfolio/devops/devops-a',
      },
    ],
  },
}));

vi.mock('@/types/sections/portfolio/portfolioContent', () => ({
  portfolioSectionContent: mocks.portfolioTestData,
}));

vi.mock('@/types/config/categories', () => ({
  categories: mocks.portfolioTestData.categories.map((name) => ({ name })),
}));

vi.mock('@/types/articles/allArticles', () => ({
  allPortfolioArticles: mocks.portfolioTestData.articles,
}));

vi.mock('@/types/config/portfolioConfig', () => ({
  portfolioConfig: {
    detailsLabel: 'Details',
  },
}));

vi.mock('@/libs/articleUtils', () => ({
  getArticleHref: (_type: string, item: { href?: string }) => item.href ?? '#',
}));

vi.mock('@/components/layout/Container', () => ({
  Container: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/components/shared/section/SectionHeader', () => ({
  SectionHeader: ({
    label,
    title,
    description,
  }: {
    label: string;
    title: string;
    description: string;
  }) => (
    <header>
      <p>{label}</p>
      <h2>{title}</h2>
      <p>{description}</p>
    </header>
  ),
}));

vi.mock('@/components/sections/portfolio/PortfolioFilter', () => ({
  PortfolioFilter: ({
    categories,
    active,
    onChange,
  }: {
    categories: string[];
    active: string;
    onChange: (value: string) => void;
  }) => (
    <div>
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          aria-pressed={active === category}
          onClick={() => onChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  ),
}));

vi.mock('@/components/articles/ArticleCard', () => ({
  ArticleCard: ({
    article,
    detailsLabel,
  }: {
    article: { title: string; href: string };
    detailsLabel: string;
  }) => (
    <article>
      <a href={article.href}>{article.title}</a>
      <span>{detailsLabel}</span>
    </article>
  ),
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ asChild, children }: { asChild?: boolean; children: React.ReactNode }) =>
    asChild ? <>{children}</> : <button type="button">{children}</button>,
}));

vi.mock('@/hooks/useStaggeredReveal', () => ({
  useStaggeredReveal: () => ({
    ref: vi.fn(),
    isVisible: true,
    getDelay: () => 0,
  }),
}));

describe('Portfolio', () => {
  it('renders section, cards, filter and CTA', () => {
    render(<Portfolio />);

    expect(
      screen.getByRole('heading', { name: mocks.portfolioTestData.title })
    ).toBeInTheDocument();
    expect(screen.getByText(mocks.portfolioTestData.description)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: mocks.portfolioTestData.cta.label })).toHaveAttribute(
      'href',
      mocks.portfolioTestData.cta.href
    );

    expect(screen.getByRole('link', { name: 'Web A' })).toHaveAttribute(
      'href',
      '/portfolio/web/web-a'
    );
    expect(screen.getByRole('link', { name: 'Web B' })).toHaveAttribute(
      'href',
      '/portfolio/web/web-b'
    );
    expect(screen.getByRole('link', { name: 'DevOps A' })).toHaveAttribute(
      'href',
      '/portfolio/devops/devops-a'
    );
  });

  it('filters articles by category', async () => {
    const user = userEvent.setup();
    render(<Portfolio />);

    await user.click(screen.getByRole('button', { name: 'Web' }));

    expect(screen.getByRole('link', { name: 'Web A' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Web B' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'DevOps A' })).not.toBeInTheDocument();
  });

  it('switches back to all categories', async () => {
    const user = userEvent.setup();
    render(<Portfolio />);

    await user.click(screen.getByRole('button', { name: 'Web' }));
    await user.click(screen.getByRole('button', { name: mocks.portfolioTestData.allCategory }));

    expect(screen.getByRole('link', { name: 'DevOps A' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Web A' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Web B' })).toBeInTheDocument();
  });
});
