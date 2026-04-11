import { Outlet } from 'react-router';
import { Header } from '@/components/sections/header';
import { Footer } from '@/components/sections/footer';
import { PageTransition } from '@/components/layout/PageTransition';
import { CookieBanner } from './components/banners/CookieBanner';
import { MetrikaScript } from '@/components/analytics/MetrikaScript';
import { ScrollToTop } from '@/components/navigation/ScrollToTop';
import { HomeHashScroll } from '@/components/navigation/HomeHashScroll';
import { SkipToContent } from '@/components/navigation/SkipToContent';
import { ScrollProgress } from '@/components/shared/scrollProgress/ScrollProgress';
import { ErrorBoundary } from '@/components/error';
import { useScrollReset } from '@/hooks/useScrollReset';

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
  useScrollReset();

  return (
    <>
      <ScrollProgress />
      <SkipToContent contentAnchor="#main-content" />
      <HomeHashScroll />
      <ErrorBoundary>
        <Header />
        <main id="main-content">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
        <Footer />
        <CookieBanner />
      </ErrorBoundary>
      <ScrollToTop navSelector="#main-nav" />
      <MetrikaScript />
    </>
  );
}
