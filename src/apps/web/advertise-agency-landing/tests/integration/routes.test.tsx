import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';

// ---------------------------------------------------------------------------
// window.matchMedia stub (required by several section components)
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
// @/types mocks — all read gitignored JSON at runtime
// ---------------------------------------------------------------------------
vi.mock('@/types/config/notFound', () => ({
  notFoundContent: {
    title: 'Страница не найдена',
    code: '404',
    description: 'Такой страницы не существует.',
    backLabel: 'На главную',
    backHref: '/',
  },
}));

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

vi.mock('@/types/config/legalData', () => ({
  legalData: {
    company: {
      name: 'ИП Тест',
      inn: '000000000000',
      ogrn: '0000000000000',
      email: 'test@test.ru',
      phone: '+7 000 000-00-00',
      address: 'г. Тест',
    },
    documents: {
      privacyPolicy: { version: '1.0', effectiveDate: '01.01.2024' },
      userAgreement: { version: '1.0', effectiveDate: '01.01.2024' },
      consent: { version: '1.0', effectiveDate: '01.01.2024' },
    },
  },
}));

vi.mock('@/types/legal', () => ({
  privacyPolicyContent: { title: 'Политика конфиденциальности', sections: [] },
  userAgreementContent: { title: 'Пользовательское соглашение', sections: [] },
  consentContent: { title: 'Согласие на обработку данных', sections: [] },
}));

vi.mock('@/types/config/categories', () => ({
  categories: [
    { name: 'Брендинг', slug: 'branding' },
    { name: 'Веб', slug: 'web' },
  ],
}));

vi.mock('@/types/config/portfolioConfig', () => ({
  portfolioConfig: {
    perPage: 9,
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

vi.mock('@/types/sections/portfolio/portfolioPage', () => ({
  portfolioPageContent: {
    label: 'Портфолио',
    title: 'Наши работы',
    description: 'Примеры проектов',
  },
}));

vi.mock('@/types/portfolio/portfolioCases', () => ({
  portfolioCaseMap: {},
  allPortfolioCases: [
    {
      slug: 'case-branding-1',
      publishedAt: '2024-03-15',
      title: 'Брендинг кейс',
      category: 'Брендинг',
      description: 'Описание',
      hero: { gradient: 'from-blue-500 to-purple-600' },
      tags: [],
      meta: { title: '', description: '' },
      overview: { client: 'Клиент', year: '2024', services: 'Брендинг' },
      content: [],
    },
    {
      slug: 'case-web-1',
      publishedAt: '2024-04-10',
      title: 'Веб кейс',
      category: 'Веб',
      description: 'Описание веб',
      hero: { gradient: 'from-green-500 to-blue-600' },
      tags: [],
      meta: { title: '', description: '' },
      overview: { client: 'Клиент 2', year: '2024', services: 'Веб' },
      content: [],
    },
  ],
  allPortfolioCasesWithHref: [],
}));

// ---------------------------------------------------------------------------
// Heavyweight section component mocks — avoid jsdom rendering complexity
// ---------------------------------------------------------------------------
vi.mock('@/components/sections/hero', () => ({
  Hero: () => <div data-testid="hero" />,
}));
vi.mock('@/components/sections/carousel', () => ({
  Carousel: () => <div data-testid="carousel" />,
}));
vi.mock('@/components/sections/about', () => ({
  About: () => <div data-testid="about" />,
}));
vi.mock('@/components/sections/services', () => ({
  Services: () => <div data-testid="services" />,
}));
vi.mock('@/components/sections/portfolio', () => ({
  Portfolio: () => <div data-testid="portfolio-section" />,
}));
vi.mock('@/components/sections/advantages', () => ({
  Advantages: () => <div data-testid="advantages" />,
}));
vi.mock('@/components/sections/call-to-action', () => ({
  CallToAction: () => <div data-testid="cta" />,
}));
vi.mock('@/components/sections/testimonials', () => ({
  Testimonials: () => <div data-testid="testimonials" />,
}));
vi.mock('@/components/sections/contact', () => ({
  Contact: () => <div data-testid="contact" />,
}));
vi.mock('@/components/sections/header', () => ({
  Header: () => <header data-testid="header" />,
}));
vi.mock('@/components/sections/footer', () => ({
  Footer: () => <footer data-testid="footer" />,
}));
vi.mock('@/components/banners/CookieBanner', () => ({
  CookieBanner: () => null,
}));
vi.mock('@/components/analytics/MetrikaScript', () => ({
  MetrikaScript: () => null,
}));
vi.mock('@/components/ui/section/SectionDivider', () => ({
  SectionDivider: () => <hr />,
}));
vi.mock('@/components/ui/navigation/ScrollToTop', () => ({
  ScrollToTop: () => null,
}));
vi.mock('@/components/ui/navigation/HomeHashScroll', () => ({
  HomeHashScroll: () => null,
}));
vi.mock('@/components/ui/navigation/SkipToContent', () => ({
  SkipToContent: () => null,
}));
vi.mock('@/components/ui/ScrollProgress', () => ({
  ScrollProgress: () => null,
}));
vi.mock('@/components/layout/PageTransition', () => ({
  PageTransition: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
vi.mock('@/components/ui/legal/LegalBlockRenderer', () => ({
  LegalBlockRenderer: () => <div data-testid="legal-block-renderer" />,
}));

// ---------------------------------------------------------------------------
// Imports — after all vi.mock() declarations
// ---------------------------------------------------------------------------
import App from '@/App';
import Home from '@/pages/Home';
import { ArticleCategoryPage } from '@/pages/ArticleCategoryPage';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import UserAgreement from '@/pages/UserAgreement';
import Consent from '@/pages/Consent';
import NotFound from '@/pages/NotFound';

// ---------------------------------------------------------------------------
// Inline route tree — mirrors src/routes.ts but using imported components
// ---------------------------------------------------------------------------
function makeRouter(initialPath: string) {
  return createMemoryRouter(
    [
      {
        path: '/',
        element: <App />,
        children: [
          { index: true, element: <Home /> },
          { path: 'portfolio', element: <ArticleCategoryPage /> },
          { path: 'portfolio/:categorySlug', element: <ArticleCategoryPage /> },
          { path: 'privacy-policy', element: <PrivacyPolicy /> },
          { path: 'user-agreement', element: <UserAgreement /> },
          { path: 'consent', element: <Consent /> },
          { path: '404', element: <NotFound /> },
          { path: '*', element: <NotFound /> },
        ],
      },
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
describe('Route rendering', () => {
  it('/ renders Home with main#main-content and hero section', () => {
    const { container } = renderAt('/');
    expect(container.querySelector('main#main-content')).toBeInTheDocument();
    expect(screen.getByTestId('hero')).toBeInTheDocument();
  });

  it('/ renders App shell (header + footer)', () => {
    renderAt('/');
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('/portfolio renders portfolio listing section', () => {
    const { container } = renderAt('/portfolio');
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('/portfolio renders the section header title', () => {
    renderAt('/portfolio');
    expect(screen.getByRole('heading', { level: 2, name: 'Портфолио' })).toBeInTheDocument();
  });

  it('/portfolio/:categorySlug with known slug renders portfolio section', () => {
    const { container } = renderAt('/portfolio/branding');
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('/portfolio/:categorySlug with unknown slug renders NotFound', () => {
    renderAt('/portfolio/unknown-category-xyz');
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('/privacy-policy renders legal page with correct title', () => {
    renderAt('/privacy-policy');
    expect(
      screen.getByRole('heading', { level: 1, name: 'Политика конфиденциальности' })
    ).toBeInTheDocument();
  });

  it('/user-agreement renders legal page with correct title', () => {
    renderAt('/user-agreement');
    expect(
      screen.getByRole('heading', { level: 1, name: 'Пользовательское соглашение' })
    ).toBeInTheDocument();
  });

  it('/consent renders legal page with correct title', () => {
    renderAt('/consent');
    expect(
      screen.getByRole('heading', { level: 1, name: 'Согласие на обработку данных' })
    ).toBeInTheDocument();
  });

  it('/404 renders NotFound with aria-label containing "Error"', () => {
    renderAt('/404');
    expect(screen.getByLabelText(/Error/i)).toBeInTheDocument();
  });

  it('/unknown-path catch-all renders NotFound with aria-label containing "Error"', () => {
    renderAt('/some-totally-unknown-path');
    expect(screen.getByLabelText(/Error/i)).toBeInTheDocument();
  });
});
