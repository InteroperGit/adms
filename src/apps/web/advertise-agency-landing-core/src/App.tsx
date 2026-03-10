import './index.css';
import { Outlet } from 'react-router-dom';
import { Header } from '@/components/sections/header';
import { Footer } from '@/components/sections/footer';
import { CookieBanner } from './components/banners/CookieBanner';
import { ScrollToTop } from '@/components/ui/ScrollToTop.tsx';
import { HomeHashScroll } from '@/components/ui/HomeHashScroll';

export default function App() {
  return (
    <>
      <HomeHashScroll />
      <Header />
      <Outlet />
      <Footer />
      <ScrollToTop navSelector="#main-nav" />
      <CookieBanner />
    </>
  );
}
