/// <reference types="vitest/config" />

import { getViteConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';

export default getViteConfig({
  resolve: {
    // Category registries are imported by project types and validators.
    // Resolve their JSON to versioned data even on a clean CI checkout.
    alias: {
      '@/data/content/config': fileURLToPath(
        new URL('./tests/fixtures/content/site/config', import.meta.url),
      ),
    },
  },
  test: {
    // Astro assets import virtual modules that must pass through Vite.
    server: { deps: { inline: ['astro'] } },
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    // Discover both legacy suites and tests colocated with source modules.
    include: [
      'tests/**/*.{test,spec}.{ts,tsx}',
      'src/**/*.{test,spec}.{ts,tsx}',
    ],
    exclude: ['node_modules', 'dist', 'output', 'tests/e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov', 'json'],
      // Include pure modules and every colocated component in the gate.
      include: [
        'src/validation/**/*.ts',
        'src/content/block-publication.ts',
        'src/content/pricing-publication.ts',
        'src/content/project-categories.ts',
        'src/content/faq-publication.ts',
        'src/content/introduction-publication.ts',
        'src/content/project-publication.ts',
        'src/content/service-publication.ts',
        'src/content/article-context.ts',
        'src/content/order-form-registry.ts',
        'src/content/paragraph-links.ts',
        'src/content/content-block-labels.ts',
        'src/components/content/resolve-image.ts',
        'src/server/inquiry-payload.ts',
        'src/scripts/project-catalog.ts',
        'src/scripts/chart-runtime.ts',
        'src/components/forms/order-inquiry.ts',
        'src/components/ui/{Button,Section,Breadcrumbs,ContactInfo}.astro',
        'src/components/cards/*.astro',
        // Colocated tests keep every component in the coverage report.
        'src/components/**/*.{astro,ts,tsx}',
      ],
    },
  },
} as Parameters<typeof getViteConfig>[0]);
