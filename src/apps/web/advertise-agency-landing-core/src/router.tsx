import type { RouteObject } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import { PortfolioCategoryPage } from './pages/PortfolioCategoryPage';
import { PortfolioCasePage } from './pages/PortfolioCasePage';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import UserAgreement from '@/pages/UserAgreement';
import Consent from '@/pages/Consent';
import { OrderPage } from '@/pages/OrderPage';

const routes: RouteObject[] = [
  {
    element: <App />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/portfolio', element: <PortfolioCategoryPage /> },
      { path: '/portfolio/:categorySlug', element: <PortfolioCategoryPage /> },
      { path: '/portfolio/:categorySlug/:year/:month/:caseSlug', element: <PortfolioCasePage /> },
      { path: '/privacy-policy', element: <PrivacyPolicy /> },
      { path: '/user-agreement', element: <UserAgreement /> },
      { path: '/consent', element: <Consent /> },
      { path: '/order', element: <OrderPage /> },
    ],
  },
];

export default routes;
