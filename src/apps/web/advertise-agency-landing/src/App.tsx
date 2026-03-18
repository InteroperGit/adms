import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { Header } from '@/components/sections/header';
import { Footer } from '@/components/sections/footer';
import { CookieBanner } from './components/banners/CookieBanner';
import { MetrikaScript } from '@/components/analytics/MetrikaScript';
import { ScrollToTop } from '@/components/ui/navigation/ScrollToTop';
import { HomeHashScroll } from '@/components/ui/navigation/HomeHashScroll';
import { SkipToContent } from '@/components/ui/navigation/SkipToContent';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import { ErrorBoundary } from '@/components/error';

/**
 * @component
 * @description
 * Root application component that wraps all pages and features. Provides:
 * - Error boundary protection (catches and handles rendering errors)
 * - Dark mode via ThemeProvider context
 * - Global accessibility (skip to content, hash scroll navigation)
 * - Persistent layout (header, footer, scroll-to-top button)
 * - Analytics (Metrika script) and cookies banner
 * - Scroll reset on route navigation
 * @returns {JSX.Element} Full app layout with theme provider, error boundary, header, page outlet, footer, and utility features
 * @example
 * <App />
 */
export default function App() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  return (
    <>
      <ScrollProgress />
      <SkipToContent contentAnchor="#main-content" />
      <HomeHashScroll />
      <ErrorBoundary>
        <Header />
        <main id="main-content">
          <Outlet />
        </main>
        <Footer />
        <CookieBanner />
      </ErrorBoundary>
      <ScrollToTop navSelector="#main-nav" />
      <MetrikaScript />
    </>
  );
}
