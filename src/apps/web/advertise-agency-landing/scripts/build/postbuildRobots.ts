/**
 * Post-build script: generate robots.txt for SSG builds.
 * Writes build/client/robots.txt with the Sitemap directive pointing at SITE_URL.
 *
 * Usage:
 *   react-router build && vite-node scripts/postbuild-robots.ts
 *
 * Env vars:
 *   SITE_URL  Base URL (default: https://example.com)
 */

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { writeFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const distDir = resolve(__dirname, '..', '..', 'build/client');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
};

function log(msg: string) {
  console.log(`${colors.cyan}[robots]${colors.reset} ${msg}`);
}

const BASE_URL = (process.env.SITE_URL ?? 'https://example.com').replace(/\/$/, '');

export function buildRobotsContent(baseUrl: string): string {
  return `User-agent: *\nAllow: /\nDisallow: /order/\n\nSitemap: ${baseUrl}/sitemap.xml\n`;
}

const content = buildRobotsContent(BASE_URL);

try {
  const start = Date.now();
  log('Generating robots.txt...');
  writeFileSync(resolve(distDir, 'robots.txt'), content, 'utf-8');
  log(
    `${colors.green}\u2713${colors.reset} robots.txt written to build/client/robots.txt in ${Date.now() - start}ms`
  );
} catch (err) {
  console.error(`${colors.yellow}[robots] Error:${colors.reset}`, err);
  process.exit(1);
}
