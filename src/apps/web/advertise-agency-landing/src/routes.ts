import type { RouteConfig } from '@react-router/dev/routes';

export default [
  {
    file: './App.tsx',
    children: [
      { index: true, file: './pages/Home.tsx' },
      { id: 'portfolio-all', path: 'portfolio', file: './pages/PortfolioCategoryPage.tsx' },
      {
        id: 'portfolio-category',
        path: 'portfolio/:categorySlug',
        file: './pages/PortfolioCategoryPage.tsx',
      },
      {
        path: 'portfolio/:categorySlug/:year/:month/:caseSlug',
        file: './pages/PortfolioCasePage.tsx',
      },
      { path: 'privacy-policy', file: './pages/PrivacyPolicy.tsx' },
      { path: 'user-agreement', file: './pages/UserAgreement.tsx' },
      { path: 'consent', file: './pages/Consent.tsx' },
      { id: 'not-found-explicit', path: '404', file: './pages/NotFound.tsx' },
      { id: 'not-found-catch-all', path: '*', file: './pages/NotFound.tsx' },
    ],
  },
] satisfies RouteConfig;
