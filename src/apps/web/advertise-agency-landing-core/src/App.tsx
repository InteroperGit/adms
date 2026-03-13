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
