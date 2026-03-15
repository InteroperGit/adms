// CSS vars (:root / .dark) must be in Vite's CSS pipeline so that
// @tailwindcss/vite picks them up in dev mode (not only via the HTML <style>).
import 'virtual:theme-vars.css';
import { ViteReactSSG } from 'vite-react-ssg';
import routes from './router';
import './index.css';
import { initGlobalErrorHandlers } from '@/libs/globalErrorHandler';

// Initialize global error handlers (catches errors outside React tree)
initGlobalErrorHandlers();

export const createRoot = ViteReactSSG({ routes });
