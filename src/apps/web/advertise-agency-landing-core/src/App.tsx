import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '@/components/sections/header';
import { Footer } from '@/components/sections/footer';
import { CookieBanner } from './components/banners/CookieBanner';
import { MetrikaScript } from '@/components/analytics/MetrikaScript';
import { ScrollToTop } from '@/components/ui/navigation/ScrollToTop';
import { HomeHashScroll } from '@/components/ui/navigation/HomeHashScroll';
import { SkipToContent } from '@/components/ui/navigation/SkipToContent';
import { ThemeProvider } from '@/contexts/ThemeContext';

/**
 * @component
 * @description
 * Root application component that wraps all pages and features. Provides:
 * - Dark mode via ThemeProvider context
 * - Global accessibility (skip to content, hash scroll navigation)
 * - Persistent layout (header, footer, scroll-to-top button)
 * - Analytics (Metrika script) and cookies banner
 * - Scroll reset on route navigation
 * @returns {JSX.Element} Full app layout with theme provider, header, page outlet, footer, and utility features
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
    <ThemeProvider>
      <SkipToContent contentAnchor="#main-content" />
      <HomeHashScroll />
      <Header />
      <Outlet />
      <Footer />
      <ScrollToTop navSelector="#main-nav" />
      <CookieBanner />
      <MetrikaScript />
    </ThemeProvider>
  );
}
