import type { RouteObject } from 'react-router-dom'
import App from './App'
import { PortfolioCasePage } from './pages/PortfolioCasePage'

const routes: RouteObject[] = [
  { path: '/', element: <App /> },
  { path: '/portfolio/:slug', element: <PortfolioCasePage /> },
]

export default routes
