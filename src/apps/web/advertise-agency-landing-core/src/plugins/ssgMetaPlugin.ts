import { existsSync, readdirSync, readFileSync } from 'fs';
import path from 'path';

// ---------------------------------------------------------------------------
// Local types (mirrors src/types/config/* without importing app-side modules)
// ---------------------------------------------------------------------------

interface SeoConfig {
  siteUrl: string;
  siteName: string;
  locale: string;
  twitterCard: string;
  defaultOgImage: string;
}

interface SiteConfig {
  name: string;
  description: string;
  contact: { phone: string; email: string; address: string };
}

interface LegalConfig {
  company: { name: string };
}

interface CategoryEntry {
  name: string;
  slug: string;
}

interface CaseData {
  title: string;
  category: string;
  description: string;
  publishDate: string;
  meta?: { title?: string; description?: string };
  images?: { og?: string };
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

/**
 * Extract year and month components from an ISO 8601 date string.
 *
 * Parses a date string in the format "YYYY-MM-DD" and extracts the year
 * (first 4 characters) and month (characters 5-6) components.
 *
 * @param date - ISO date string in format "YYYY-MM-DD" (e.g., "2024-03-14")
 * @returns An object containing the extracted year and month as strings
 * @throws {Error} If the date string is not in the correct "YYYY-MM-DD" format
 */
function extractYearMonth(date: string): { year: string; month: string } {
  if (!date || typeof date !== 'string') {
    throw new Error('Date must be a non-empty string');
  }

  if (date.length !== 10) {
    throw new Error(
      `Invalid date format. Expected "YYYY-MM-DD", got "${date}" (length ${date.length})`
    );
  }

  if (date[4] !== '-' || date[7] !== '-') {
    throw new Error(
      `Invalid date format. Expected "YYYY-MM-DD" with dashes at positions 4 and 7, got "${date}"`
    );
  }

  const year = date.slice(0, 4);
  const month = date.slice(5, 7);

  if (!/^\d{4}$/.test(year)) {
    throw new Error(`Invalid year component in date "${date}". Expected 4 digits, got "${year}"`);
  }

  if (!/^\d{2}$/.test(month)) {
    throw new Error(`Invalid month component in date "${date}". Expected 2 digits, got "${month}"`);
  }

  const monthNum = parseInt(month, 10);
  if (monthNum < 1 || monthNum > 12) {
    throw new Error(
      `Invalid month value in date "${date}". Month must be between 01 and 12, got "${month}"`
    );
  }

  return { year, month };
}

// ---------------------------------------------------------------------------
// HTML helpers
// ---------------------------------------------------------------------------

/**
 * @description Escapes HTML special characters to safely include strings in HTML attributes.
 *
 * @param {string} s - String to escape
 * @returns {string} Escaped string safe for use in HTML attributes
 */
function escAttr(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * @description Updates an existing <meta> tag's content attribute or injects a new <meta> tag
 * before </head> if not found. Searches both name= and content= attribute orderings.
 *
 * @param {string} html - HTML string to modify
 * @param {'name' | 'property'} keyAttr - Meta attribute type (name or property)
 * @param {string} key - Meta attribute value (e.g., "description", "og:title")
 * @param {string} value - New content attribute value
 * @returns {string} Updated HTML string
 */
function upsertMeta(
  html: string,
  keyAttr: 'name' | 'property',
  key: string,
  value: string
): string {
  const escaped = escAttr(value);
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re1 = new RegExp(`(<meta\\s+${keyAttr}="${escapedKey}"\\s+content=")[^"]*("\\s*/?>)`, 'gi');
  const re2 = new RegExp(`(<meta\\s+content=")[^"]*("\\s+${keyAttr}="${escapedKey}"\\s*/?>)`, 'gi');
  if (re1.test(html)) {
    return html.replace(re1, `$1${escaped}$2`);
  }
  if (re2.test(html)) {
    return html.replace(re2, `$1${escaped}$2`);
  }
  return html.replace('</head>', `  <meta ${keyAttr}="${key}" content="${escaped}" />\n  </head>`);
}

/**
 * @description Injects HTML snippet before </head> tag.
 *
 * @param {string} html - HTML string to modify
 * @param {string} snippet - HTML code to inject (e.g., <link>, <script>, <meta>)
 * @returns {string} Updated HTML string
 */
function injectBeforeHead(html: string, snippet: string): string {
  return html.replace('</head>', `  ${snippet}\n  </head>`);
}

/**
 * @description Updates existing <title> tag or injects new one before </head>.
 *
 * @param {string} html - HTML string to modify
 * @param {string} text - New page title text
 * @returns {string} Updated HTML string
 */
function upsertTitle(html: string, text: string): string {
  const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  if (/<title>[^<]*<\/title>/i.test(html)) {
    return html.replace(/<title>[^<]*<\/title>/i, `<title>${escaped}</title>`);
  }
  return html.replace('</head>', `  <title>${escaped}</title>\n  </head>`);
}

/**
 * @description Wraps a JSON-LD schema object in <script> tags for structured data markup.
 *
 * @param {object} schema - JSON-LD schema object (e.g., Organization, BreadcrumbList)
 * @returns {string} HTML script tag containing JSON-LD schema
 */
function jsonLdTag(schema: object): string {
  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}

// ---------------------------------------------------------------------------
// Page-specific handlers
// ---------------------------------------------------------------------------

function handleHome(
  html: string,
  seo: SeoConfig,
  site: SiteConfig | null,
  legal: LegalConfig | null
): string {
  const title = site ? `${site.name} — реклама, которая работает` : seo.siteName;
  const desc = site?.description ?? '';
  const url = `${seo.siteUrl}/`;

  let out = html;
  out = upsertTitle(out, title);
  out = upsertMeta(out, 'name', 'description', desc);
  out = upsertMeta(out, 'property', 'og:description', desc);
  out = upsertMeta(out, 'property', 'og:image', seo.defaultOgImage);
  out = upsertMeta(out, 'property', 'og:url', url);
  out = upsertMeta(out, 'property', 'og:type', 'website');
  out = upsertMeta(out, 'name', 'twitter:title', title);
  out = upsertMeta(out, 'name', 'twitter:description', desc);
  out = upsertMeta(out, 'name', 'twitter:image', seo.defaultOgImage);
  out = injectBeforeHead(out, `<link rel="canonical" href="${escAttr(url)}" />`);

  if (site) {
    const orgSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: site.name,
      url: seo.siteUrl,
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: site.contact.phone,
        contactType: 'customer service',
        email: site.contact.email,
      },
      address: { '@type': 'PostalAddress', streetAddress: site.contact.address },
      ...(legal ? { legalName: legal.company.name } : {}),
    };
    out = injectBeforeHead(out, jsonLdTag(orgSchema));
  }

  return out;
}

function handleNotFound(html: string, seo: SeoConfig): string {
  const title = `404 — Страница не найдена — ${seo.siteName}`;

  let out = html;
  out = upsertTitle(out, title);
  out = upsertMeta(out, 'name', 'robots', 'noindex');
  return out;
}

function handleCasePage(
  html: string,
  caseSlug: string,
  caseData: CaseData,
  seo: SeoConfig,
  categories: CategoryEntry[]
): string {
  const ogTitle = caseData.meta?.title ?? caseData.title;
  const ogDesc = caseData.meta?.description ?? caseData.description;
  const ogImage = caseData.images?.og ?? seo.defaultOgImage;

  // Canonical always points to the real category URL (never /all/)
  const catSlug = categories.find((c) => c.name === caseData.category)?.slug ?? 'all';
  const { year, month } = extractYearMonth(caseData.publishDate);
  const canonicalUrl = `${seo.siteUrl}/portfolio/${catSlug}/${year}/${month}/${caseSlug}`;

  let out = html;
  out = upsertTitle(out, `${ogTitle} — ${seo.siteName}`);
  out = upsertMeta(out, 'name', 'description', ogDesc);
  out = upsertMeta(out, 'property', 'og:description', ogDesc);
  out = upsertMeta(out, 'property', 'og:image', ogImage);
  out = upsertMeta(out, 'property', 'og:url', canonicalUrl);
  out = upsertMeta(out, 'property', 'og:type', 'article');
  out = upsertMeta(out, 'name', 'twitter:title', ogTitle);
  out = upsertMeta(out, 'name', 'twitter:description', ogDesc);
  out = upsertMeta(out, 'name', 'twitter:image', ogImage);
  out = injectBeforeHead(out, `<link rel="canonical" href="${escAttr(canonicalUrl)}" />`);

  // BreadcrumbList JSON-LD — mirrors the <BreadCrumbs> component
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: seo.siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Портфолио', item: `${seo.siteUrl}/portfolio` },
      {
        '@type': 'ListItem',
        position: 3,
        name: caseData.category,
        item: `${seo.siteUrl}/portfolio/${catSlug}`,
      },
      { '@type': 'ListItem', position: 4, name: caseData.title, item: canonicalUrl },
    ],
  };
  out = injectBeforeHead(out, jsonLdTag(breadcrumbSchema));

  return out;
}

// ---------------------------------------------------------------------------
// Shared utilities
// ---------------------------------------------------------------------------

/**
 * @description Safely reads and parses a JSON file, returning null if not found.
 *
 * @template T - Type to parse JSON into
 * @param {string} filePath - Absolute file path
 * @returns {T | null} Parsed JSON object or null if file doesn't exist
 */
function readJson<T>(filePath: string): T | null {
  if (!existsSync(filePath)) {
    return null;
  }
  return JSON.parse(readFileSync(filePath, 'utf-8')) as T;
}

/**
 * @description Recursively finds all .json files in a directory tree.
 *
 * @param {string} dir - Directory path to scan
 * @returns {string[]} Array of absolute paths to all .json files found
 */
function walkJsonFiles(dir: string): string[] {
  if (!existsSync(dir)) {
    return [];
  }
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return walkJsonFiles(full);
    }
    if (entry.isFile() && entry.name.endsWith('.json')) {
      return [full];
    }
    return [];
  });
}

// Portfolio route params that vite-react-ssg generates from the RouteObject tree —
// these are replaced by concrete static paths built from actual data files.
const DYNAMIC_ROUTE_PATTERNS = new Set([
  '/portfolio',
  '/portfolio/:slug',
  '/portfolio/:categorySlug',
  '/portfolio/:categorySlug/:year/:month/:caseSlug',
]);

// ---------------------------------------------------------------------------
// includedRoutes builder
// ---------------------------------------------------------------------------

/**
 * @description Factory function that builds the includedRoutes handler for vite-react-ssg.
 * Reads portfolio cases and categories from data files to generate all static routes:
 * listing pages (/portfolio, /portfolio/{category}) and case detail pages with date-based URLs
 * (/portfolio/{category}/{year}/{month}/{slug}). Returns a function that filters out dynamic
 * route patterns and inserts concrete routes.
 *
 * @param {string} rootDir - Project root directory (used to resolve data/ folder)
 * @returns {(paths: string[]) => string[]} Function accepting vite-react-ssg routes and returning
 *   all expanded static paths (listing + case pages)
 *
 * @example
 * // vite.config.ts
 * import { buildIncludedRoutes } from './src/plugins/ssgMetaPlugin';
 *
 * ssgOptions: {
 *   includedRoutes: buildIncludedRoutes(process.cwd()),
 * }
 */
export function buildIncludedRoutes(rootDir: string): (paths: string[]) => string[] {
  const categories =
    readJson<CategoryEntry[]>(path.resolve(rootDir, 'data/content/config/categories.json')) ?? [];
  const catSlugs = ['all', ...categories.map((c) => c.slug)];

  const portfolioDir = path.resolve(rootDir, 'data/content/portfolio');
  const caseFiles = walkJsonFiles(portfolioDir);
  const cases = caseFiles.map(
    (f) =>
      JSON.parse(readFileSync(f, 'utf-8')) as {
        slug: string;
        category: string;
        publishDate: string;
      }
  );

  // One listing page per category (including the "all" pseudo-category)
  const categoryRoutes = catSlugs.map((s) => `/portfolio/${s}`);

  // Each case page under /all/ and under its real category
  const caseRoutes = cases.flatMap((c) => {
    const { year, month } = extractYearMonth(c.publishDate);
    const catSlug = categories.find((cat) => cat.name === c.category)?.slug;
    return catSlug
      ? [
          `/portfolio/all/${year}/${month}/${c.slug}`,
          `/portfolio/${catSlug}/${year}/${month}/${c.slug}`,
        ]
      : [`/portfolio/all/${year}/${month}/${c.slug}`];
  });

  return (paths) => [
    ...paths.filter((p) => !DYNAMIC_ROUTE_PATTERNS.has(p)),
    '/404',
    '/portfolio',
    ...categoryRoutes,
    ...caseRoutes,
  ];
}

// ---------------------------------------------------------------------------
// onPageRendered factory — loads config files once, returns the handler
// ---------------------------------------------------------------------------

/**
 * @description Factory function creating the onPageRendered hook for vite-react-ssg.
 * Loads configuration and portfolio case data once, returning a handler that injects
 * SEO metadata (titles, meta tags, JSON-LD schemas) into rendered HTML. Handles homepage
 * with organization schema and case pages with breadcrumbs and case-specific metadata.
 *
 * @param {string} rootDir - Project root directory (used to resolve data/ folder)
 * @returns {(route: string, html: string) => string} Handler function that injects SEO metadata
 *   into HTML for each route during SSG build
 *
 * @example
 * // vite.config.ts
 * import { createSsgMetaHook } from './src/plugins/ssgMetaPlugin';
 *
 * ssgOptions: {
 *   onPageRendered: createSsgMetaHook(process.cwd()),
 * }
 */
export function createSsgMetaHook(rootDir: string): (route: string, html: string) => string {
  const seo = readJson<SeoConfig>(path.resolve(rootDir, 'data/content/config/seo.json'));
  if (!seo) {
    return (_route, html) => html;
  }

  const site = readJson<SiteConfig>(path.resolve(rootDir, 'data/content/config/site.json'));
  const legal = readJson<LegalConfig>(path.resolve(rootDir, 'data/content/config/legal.json'));
  const categories =
    readJson<CategoryEntry[]>(path.resolve(rootDir, 'data/content/config/categories.json')) ?? [];

  const caseFileMap = Object.fromEntries(
    walkJsonFiles(path.resolve(rootDir, 'data/content/portfolio')).map((f) => {
      const data = JSON.parse(readFileSync(f, 'utf-8')) as CaseData & { slug: string };
      return [data.slug, data];
    })
  );

  return function onPageRendered(route: string, html: string): string {
    // Inject global defaults on every page
    let out = html;
    out = upsertTitle(out, seo.siteName);
    if (site?.description) {
      out = upsertMeta(out, 'name', 'description', site.description);
    }
    out = upsertMeta(out, 'property', 'og:site_name', seo.siteName);
    out = upsertMeta(out, 'property', 'og:locale', seo.locale);
    out = upsertMeta(out, 'name', 'twitter:card', seo.twitterCard);

    if (route === '/') {
      return handleHome(out, seo, site, legal);
    }

    if (route === '/404') {
      return handleNotFound(out, seo);
    }

    const caseMatch = /^\/portfolio\/([^/]+)\/(\d{4})\/(\d{2})\/([^/]+)$/.exec(route);
    if (caseMatch) {
      const caseSlug = caseMatch[4];
      const caseData = caseFileMap[caseSlug] ?? null;
      if (caseData) {
        return handleCasePage(out, caseSlug, caseData, seo, categories);
      }
    }

    return out;
  };
}
