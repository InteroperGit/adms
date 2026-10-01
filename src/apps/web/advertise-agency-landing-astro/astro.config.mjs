import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Add `site` only after the agency's production URL is confirmed (see README).
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
});
