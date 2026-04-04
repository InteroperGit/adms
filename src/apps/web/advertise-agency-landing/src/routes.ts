import type { RouteConfig } from '@react-router/dev/routes';

export default [
  {
    file: './App.tsx',
    children: [
      { index: true, file: './pages/Home.tsx' },
      { id: 'portfolio-all', path: 'portfolio', file: './pages/ArticleCategoryPage.tsx' },
      {
        id: 'portfolio-category',
        path: 'portfolio/:categorySlug',
        file: './pages/ArticleCategoryPage.tsx',
      },
      {
        id: 'portfolio-case',
        path: 'portfolio/:categorySlug/:year/:month/:slug',
        file: './pages/ArticlePage.tsx',
      },
      { id: 'service-article', path: 'services/:slug', file: './pages/ArticlePage.tsx' },
      { id: 'news', path: 'news', file: './pages/ArticleListPage.tsx' },
      { id: 'news-article', path: 'news/:year/:month/:slug', file: './pages/ArticlePage.tsx' },
      { id: 'blog', path: 'blog', file: './pages/ArticleListPage.tsx' },
      { id: 'blog-article', path: 'blog/:year/:month/:slug', file: './pages/ArticlePage.tsx' },
      { path: 'privacy-policy', file: './pages/PrivacyPolicy.tsx' },
      { path: 'user-agreement', file: './pages/UserAgreement.tsx' },
      { path: 'consent', file: './pages/Consent.tsx' },
      { id: 'not-found-explicit', path: '404', file: './pages/NotFound.tsx' },
      { id: 'not-found-catch-all', path: '*', file: './pages/NotFound.tsx' },
    ],
  },
] satisfies RouteConfig;
