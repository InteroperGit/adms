// Build only the private table matrix, even if other article data is invalid.
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  srcDir: './output/playwright/vcb-05/source',
  outDir: './output/playwright/task-080/dist',
  vite: { plugins: [tailwindcss()] },
  integrations: [{
    name: 'table-acceptance',
    hooks: {
      'astro:config:setup': ({ injectRoute }) => injectRoute({
        pattern: '/__table-check/',
        entrypoint: fileURLToPath(new URL(
          './fixtures/table-blocks.astro', import.meta.url,
        )),
        prerender: true,
      }),
    },
  }],
});
