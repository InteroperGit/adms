import type { RouteObject } from 'react-router-dom';
import App from './App';
import { PortfolioCasePage } from './pages/PortfolioCasePage';
import PrivacyPolicy from '@/pages/PrivacyPolicy.tsx';
import UserAgreement from '@/pages/UserAgrrement.tsx';
import Consent from '@/pages/Consent.tsx';

const routes: RouteObject[] = [
  { path: '/', element: <App /> },
  { path: '/portfolio/:slug', element: <PortfolioCasePage /> },
  { path: '/privacy-policy', element: <PrivacyPolicy /> },
  { path: '/user-agreement', element: <UserAgreement /> },
  { path: '/consent', element: <Consent /> },
];

export default routes;
