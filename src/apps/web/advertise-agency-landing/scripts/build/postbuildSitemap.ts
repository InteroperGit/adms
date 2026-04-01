/**
 * Post-build script: generate sitemap.xml for SSG builds.
 * Reads the same data sources as react-router.config.ts prerender() and
 * writes build/client/sitemap.xml.
 *
 * Usage:
 *   react-router build && vite-node scripts/postbuild-sitemap.ts
 *
 * Env vars:
 *   SITE_URL  Base URL (default: https://example.com)
 */

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { writeFileSync, readFileSync } from 'fs';
import { readJson, walkJsonFiles, extractYearMonth } from '../utils/buildUtils';
import { buildSitemapXml, type SitemapEntry } from '../../src/libs/sitemap';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..', '..');
const distDir = resolve(rootDir, 'build/client');

const BASE_URL = (process.env.SITE_URL ?? 'https://example.com').replace(/\/$/, '');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
};

function log(msg: string) {
  console.log(`${colors.cyan}[sitemap]${colors.reset} ${msg}`);
}

interface CategoryEntry {
  name: string;
  slug: string;
}
interface CaseEntry {
  slug: string;
  category: string;
  publishedAt: string;
}

const today = new Date().toISOString().slice(0, 10);

export function buildEntries(): SitemapEntry[] {
  const categories =
    readJson<CategoryEntry[]>(resolve(rootDir, 'data/content/config/categories.json')) ?? [];
  const catSlugs = ['all', ...categories.map((c) => c.slug)];

  const portfolioDir = resolve(rootDir, 'data/content/portfolio');
  const cases = walkJsonFiles(portfolioDir).map(
    (f) => JSON.parse(readFileSync(f, 'utf-8')) as CaseEntry
  );

  const staticRoutes: SitemapEntry[] = [
    { loc: `${BASE_URL}/`, changefreq: 'weekly', priority: 1.0, lastmod: today },
    { loc: `${BASE_URL}/portfolio`, changefreq: 'daily', priority: 0.9, lastmod: today },
  ];

  const categoryRoutes: SitemapEntry[] = catSlugs.map((s) => ({
    loc: `${BASE_URL}/portfolio/${s}`,
    changefreq: 'daily',
    priority: 0.8,
    lastmod: today,
  }));

  const caseRoutes: SitemapEntry[] = cases.flatMap((c) => {
    const { year, month } = extractYearMonth(c.publishedAt);
    const catSlug = categories.find((cat) => cat.name === c.category)?.slug;
    const entry = (p: string): SitemapEntry => ({
      loc: `${BASE_URL}${p}`,
      changefreq: 'monthly',
      priority: 0.7,
      lastmod: c.publishedAt.slice(0, 10),
    });
    const allPath = `/portfolio/all/${year}/${month}/${c.slug}`;
    return catSlug
      ? [entry(allPath), entry(`/portfolio/${catSlug}/${year}/${month}/${c.slug}`)]
      : [entry(allPath)];
  });

  return [...staticRoutes, ...categoryRoutes, ...caseRoutes];
}

try {
  const start = Date.now();
  log('Generating sitemap.xml...');
  const entries = buildEntries();
  const xml = buildSitemapXml(entries);
  writeFileSync(resolve(distDir, 'sitemap.xml'), xml, 'utf-8');
  log(
    `${colors.green}\u2713${colors.reset} ${entries.length} URLs written to build/client/sitemap.xml in ${Date.now() - start}ms`
  );
} catch (err) {
  console.error(`${colors.yellow}[sitemap] Error:${colors.reset}`, err);
  process.exit(1);
}
