/**
 * Post-build script for SEO meta injection.
 * Must run AFTER `react-router build` because prerendering creates HTML files
 * during the SSR phase, which happens after Vite's writeBundle hook fires.
 *
 * Usage:
 *   react-router build && vite-node scripts/postbuild-seo.ts
 */

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { processBuiltHtml } from '../../src/plugins/seoMetaPlugin.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..', '..');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
};

function log(msg: string) {
  console.log(`${colors.cyan}[seo-meta]${colors.reset} ${msg}`);
}

try {
  const start = Date.now();
  log('Injecting SEO meta into pre-rendered HTML...');
  processBuiltHtml(rootDir);
  log(`${colors.green}✓${colors.reset} Done in ${Date.now() - start}ms`);
} catch (err) {
  console.error(`${colors.yellow}[seo-meta] Error:${colors.reset}`, err);
  process.exit(1);
}
