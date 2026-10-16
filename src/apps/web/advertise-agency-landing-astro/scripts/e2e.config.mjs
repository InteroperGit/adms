// Only the E2E command selects this config; normal output is untouched.
import { mergeConfig } from 'astro/config';
import { resolve } from 'node:path';
import config from '../astro.config.mjs';

export default mergeConfig(config, {
  outDir: './output/playwright/site',
  cacheDir: './output/playwright/cache',
  vite: {
    resolve: {
      alias: [
        {
          find: '@/data/content',
          replacement: resolve('output/playwright/content'),
        },
      ],
    },
  },
});
