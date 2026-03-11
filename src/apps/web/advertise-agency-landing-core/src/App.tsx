import './index.css';
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Header } from '@/components/sections/header';
import { Footer } from '@/components/sections/footer';
import { CookieBanner } from './components/banners/CookieBanner';
import { ScrollToTop } from '@/components/ui/ScrollToTop.tsx';
import { HomeHashScroll } from '@/components/ui/HomeHashScroll';

export default function App() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return (
    <>
      <a
        href="#main-content"
        className={cn(
          'sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100]',
          'focus:rounded-lg focus:bg-white focus:px-4 focus:py-2',
          'focus:text-sm focus:font-medium focus:text-primary',
          'focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary'
        )}
      >
        Перейти к содержимому
      </a>
      <HomeHashScroll />
      <Header />
      <Outlet />
      <Footer />
      <ScrollToTop navSelector="#main-nav" />
      <CookieBanner />
    </>
  );
}
