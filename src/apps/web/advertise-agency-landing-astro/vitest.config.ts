/// <reference types="vitest/config" />

import { getViteConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';

export default getViteConfig({
  resolve: {
    // Category registries are imported by project types and validators.
    // Resolve their JSON to versioned data even on a clean CI checkout.
    alias: {
      '@/data/content/project-categories.json': fileURLToPath(new URL(
        './tests/fixtures/content/project-categories.json', import.meta.url,
      )),
    },
  },
  test: {
    // Astro assets import virtual modules that must pass through Vite.
    server: { deps: { inline: ['astro'] } },
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist', 'output'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov', 'json'],
      // Explicit scopes include unimported pure modules and task 090 cards/UI.
      // Broader component/client thresholds belong to task 095.
      include: [
        'src/validation/**/*.ts',
        'src/content/block-publication.ts',
        'src/content/pricing-publication.ts',
        'src/content/project-categories.ts',
        'src/components/content/resolve-image.ts',
        'src/server/inquiry-payload.ts',
        'src/scripts/project-catalog.ts',
        'src/components/forms/order-inquiry.ts',
        'src/components/ui/{Button,Section,Breadcrumbs,ContactInfo}.astro',
        'src/components/cards/*.astro',
      ],
    },
  },
} as Parameters<typeof getViteConfig>[0]);

