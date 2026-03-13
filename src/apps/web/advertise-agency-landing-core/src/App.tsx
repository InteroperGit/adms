import './index.css';
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '@/components/sections/header';
import { Footer } from '@/components/sections/footer';
import { CookieBanner } from './components/banners/CookieBanner';
import { MetrikaScript } from '@/components/analytics/MetrikaScript';
import { ScrollToTop } from '@/components/ui/ScrollToTop.tsx';
import { HomeHashScroll } from '@/components/ui/HomeHashScroll';
import { SkipToContent } from '@/components/ui/SkipToContent';
import { ThemeProvider } from '@/contexts/ThemeContext.tsx';

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
