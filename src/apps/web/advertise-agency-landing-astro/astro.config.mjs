import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

const productionUrl = process.env.PUBLIC_SITE_URL?.trim();

export default defineConfig({
  // Set the confirmed production origin in PUBLIC_SITE_URL at release time.
  site: productionUrl || undefined,
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
});
