/**
 * Post-build script: generate site.webmanifest for SSG builds.
 * Reads site name/description from data/content/config/site.json and
 * theme colour from data/content/config/theme.json, then writes
 * build/client/site.webmanifest.
 *
 * Usage:
 *   react-router build && vite-node scripts/postbuild-webmanifest.ts
 */

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { writeFileSync } from 'fs';
import { readJson } from './buildUtils';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');
const distDir = resolve(rootDir, 'build/client');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
};

function log(msg: string) {
  console.log(`${colors.cyan}[webmanifest]${colors.reset} ${msg}`);
}

interface SiteConfig {
  name: string;
  description: string;
}

interface ThemeConfig {
  colors: { primary: string };
}

export function buildWebmanifest(site: SiteConfig, primaryHsl: string): object {
  return {
    name: site.name,
    short_name: site.name.replace(/[«»"]/g, '').trim(),
    description: site.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: `hsl(${primaryHsl})`,
    icons: [
      { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
  };
}

try {
  const start = Date.now();
  log('Generating site.webmanifest...');

  const site =
    readJson<SiteConfig>(resolve(rootDir, 'data/content/config/site.json')) ??
    ({ name: 'Site', description: '' } as SiteConfig);

  const theme =
    readJson<ThemeConfig>(resolve(rootDir, 'data/content/config/theme.json')) ??
    ({ colors: { primary: '0 0% 0%' } } as ThemeConfig);

  const manifest = buildWebmanifest(site, theme.colors.primary);
  writeFileSync(resolve(distDir, 'site.webmanifest'), JSON.stringify(manifest, null, 2), 'utf-8');
  log(
    `${colors.green}\u2713${colors.reset} site.webmanifest written to build/client/site.webmanifest in ${Date.now() - start}ms`
  );
} catch (err) {
  console.error(`${colors.yellow}[webmanifest] Error:${colors.reset}`, err);
  process.exit(1);
}
