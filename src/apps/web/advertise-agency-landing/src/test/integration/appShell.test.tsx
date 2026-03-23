import { createMemoryRouter, RouterProvider } from 'react-router';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';

// ---------------------------------------------------------------------------
// localStorage stub — jsdom may not implement it fully
// ---------------------------------------------------------------------------
const localStore: Record<string, string> = {};
vi.stubGlobal('localStorage', {
  getItem: vi.fn((key: string) => localStore[key] ?? null),
  setItem: vi.fn((key: string, value: string) => {
    localStore[key] = value;
  }),
  removeItem: vi.fn((key: string) => {
    delete localStore[key];
  }),
  clear: vi.fn(() => {
    Object.keys(localStore).forEach((k) => delete localStore[k]);
  }),
});

// ---------------------------------------------------------------------------
// window.matchMedia stub
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

vi.mock('@/types/config/cookies', () => ({
  cookiesContent: {
    ariaLabel: 'Cookie consent',
    title: 'Cookies',
    text: 'We use cookies.',
    closeLabel: 'Close',
    privacyLink: { label: 'Privacy', href: '/privacy-policy' },
    acceptAllLabel: 'Accept all',
    necessaryOnlyLabel: 'Necessary only',
  },
}));

vi.mock('@/types/config/errorFallback', () => ({
  errorFallbackContent: {
    title: 'Ошибка',
    description: 'Что-то пошло не так.',
    resetLabel: 'На главную',
  },
}));

// ---------------------------------------------------------------------------
// Section component mocks — minimal stubs that render just their root element
// ---------------------------------------------------------------------------
vi.mock('@/components/sections/header', () => ({
  Header: () => <header data-testid="header" />,
}));
vi.mock('@/components/sections/footer', () => ({
  Footer: () => <footer data-testid="footer" />,
}));

// ---------------------------------------------------------------------------
// Other utility component mocks (not under integration test here)
// ---------------------------------------------------------------------------
vi.mock('@/components/analytics/MetrikaScript', () => ({
  MetrikaScript: () => null,
}));
vi.mock('@/components/ui/navigation/ScrollToTop', () => ({
  ScrollToTop: () => null,
}));
vi.mock('@/components/ui/navigation/HomeHashScroll', () => ({
  HomeHashScroll: () => null,
}));
vi.mock('@/components/layout/PageTransition', () => ({
  PageTransition: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// ---------------------------------------------------------------------------
// Imports — after all vi.mock() declarations
// ---------------------------------------------------------------------------
import App from '@/App';

// ---------------------------------------------------------------------------
// Router helper — renders App shell at "/" with an empty outlet
// ---------------------------------------------------------------------------
function renderAppShell() {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: <App />,
        children: [{ index: true, element: <div data-testid="page-content">Page</div> }],
      },
    ],
    { initialEntries: ['/'] }
  );
  return render(<RouterProvider router={router} />);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('App shell integration', () => {
  it('renders <header> element', () => {
    renderAppShell();
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('renders <footer> element', () => {
    renderAppShell();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('renders main#main-content (Outlet slot)', () => {
    const { container } = renderAppShell();
    expect(container.querySelector('main#main-content')).toBeInTheDocument();
  });

  it('renders SkipToContent link pointing to #main-content', () => {
    renderAppShell();
    const link = screen.getByRole('link', { name: /содержимому/i });
    expect(link).toHaveAttribute('href', '#main-content');
  });

  it('ScrollProgress does not crash (returns null when page is short in jsdom)', () => {
    // jsdom has scrollHeight === innerHeight, so ScrollProgress renders null —
    // we just verify it does not throw and the app shell remains intact.
    const { container } = renderAppShell();
    expect(container.querySelector('main#main-content')).toBeInTheDocument();
    // No progressbar expected since jsdom scrollable height is 0
    expect(container.querySelector('[role="progressbar"]')).not.toBeInTheDocument();
  });

  it('ErrorBoundary does not crash on normal render (children visible)', () => {
    renderAppShell();
    expect(screen.getByTestId('page-content')).toBeInTheDocument();
  });

  it('CookieBanner is present (role=dialog when no localStorage consent)', () => {
    // In jsdom, localStorage is empty by default, so banner should render
    renderAppShell();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
