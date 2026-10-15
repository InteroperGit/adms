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
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist', 'output'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      // Task 089 baseline: explicit scope includes unimported pure modules.
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
      ],
    },
  },
} as Parameters<typeof getViteConfig>[0]);

