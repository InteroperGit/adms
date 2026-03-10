import type { RouteObject } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import { PortfolioPage } from './pages/PortfolioPage';
import { PortfolioCategoryPage } from './pages/PortfolioCategoryPage';
import { PortfolioCasePage } from './pages/PortfolioCasePage';
import PrivacyPolicy from '@/pages/PrivacyPolicy.tsx';
import UserAgreement from '@/pages/UserAgreement.tsx';
import Consent from '@/pages/Consent.tsx';

const routes: RouteObject[] = [
  {
    element: <App />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/portfolio', element: <PortfolioPage /> },
      { path: '/portfolio/:categorySlug', element: <PortfolioCategoryPage /> },
      { path: '/portfolio/:categorySlug/:caseSlug', element: <PortfolioCasePage /> },
      { path: '/privacy-policy', element: <PrivacyPolicy /> },
      { path: '/user-agreement', element: <UserAgreement /> },
      { path: '/consent', element: <Consent /> },
    ],
  },
];

export default routes;
