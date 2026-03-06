import './index.css';
import { Outlet } from 'react-router-dom';
import { Header } from '@/components/sections/header';
import { Footer } from '@/components/sections/footer';
import { CookieBanner } from './components/banners/CookieBanner';
import { ScrollToTop } from '@/components/ui/ScrollToTop.tsx';

export default function App() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
      <ScrollToTop navSelector="#main-nav" />
      <CookieBanner />
    </>
  );
}
