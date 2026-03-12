// CSS vars (:root / .dark) must be in Vite's CSS pipeline so that
// @tailwindcss/vite picks them up in dev mode (not only via the HTML <style>).
import 'virtual:theme-vars.css';
import { ViteReactSSG } from 'vite-react-ssg';
import routes from './router';
import './index.css';

export const createRoot = ViteReactSSG({ routes });
