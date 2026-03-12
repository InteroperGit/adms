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
  meta?: { title?: string; description?: string };
  images?: { og?: string };
}

// ---------------------------------------------------------------------------
// HTML helpers
// ---------------------------------------------------------------------------

function escAttr(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** Replace content of an existing <meta> tag, or inject a new one before </head>. */
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

function injectBeforeHead(html: string, snippet: string): string {
  return html.replace('</head>', `  ${snippet}\n  </head>`);
}

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
  out = upsertMeta(out, 'property', 'og:title', title);
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
  const canonicalUrl = `${seo.siteUrl}/portfolio/${catSlug}/${caseSlug}`;

  let out = html;
  out = upsertMeta(out, 'property', 'og:title', ogTitle);
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

function readJson<T>(filePath: string): T | null {
  if (!existsSync(filePath)) {
    return null;
  }
  return JSON.parse(readFileSync(filePath, 'utf-8')) as T;
}

// Portfolio route params that vite-react-ssg generates from the RouteObject tree —
// these are replaced by concrete static paths built from actual data files.
const DYNAMIC_ROUTE_PATTERNS = new Set([
  '/portfolio',
  '/portfolio/:slug',
  '/portfolio/:categorySlug',
  '/portfolio/:categorySlug/:caseSlug',
]);

// ---------------------------------------------------------------------------
// includedRoutes builder
// ---------------------------------------------------------------------------

export function buildIncludedRoutes(rootDir: string): (paths: string[]) => string[] {
  const categories =
    readJson<CategoryEntry[]>(path.resolve(rootDir, 'data/content/config/categories.json')) ?? [];
  const catSlugs = ['all', ...categories.map((c) => c.slug)];

  const portfolioDir = path.resolve(rootDir, 'data/content/portfolio');
  const caseFiles = existsSync(portfolioDir)
    ? readdirSync(portfolioDir).filter((f) => f.endsWith('.json'))
    : [];
  const cases = caseFiles.map(
    (f) =>
      JSON.parse(readFileSync(path.join(portfolioDir, f), 'utf-8')) as {
        slug: string;
        category: string;
      }
  );

  // One listing page per category (including the "all" pseudo-category)
  const categoryRoutes = catSlugs.map((s) => `/portfolio/${s}`);

  // Each case page under /all/ and under its real category
  const caseRoutes = cases.flatMap((c) => {
    const catSlug = categories.find((cat) => cat.name === c.category)?.slug;
    return catSlug
      ? [`/portfolio/all/${c.slug}`, `/portfolio/${catSlug}/${c.slug}`]
      : [`/portfolio/all/${c.slug}`];
  });

  return (paths) => [
    ...paths.filter((p) => !DYNAMIC_ROUTE_PATTERNS.has(p)),
    '/portfolio',
    ...categoryRoutes,
    ...caseRoutes,
  ];
}

// ---------------------------------------------------------------------------
// onPageRendered factory — loads config files once, returns the handler
// ---------------------------------------------------------------------------

export function createSsgMetaHook(rootDir: string): (route: string, html: string) => string {
  const seo = readJson<SeoConfig>(path.resolve(rootDir, 'data/content/config/seo.json'));
  if (!seo) {
    return (_route, html) => html;
  }

  const site = readJson<SiteConfig>(path.resolve(rootDir, 'data/content/config/site.json'));
  const legal = readJson<LegalConfig>(path.resolve(rootDir, 'data/content/config/legal.json'));
  const categories =
    readJson<CategoryEntry[]>(path.resolve(rootDir, 'data/content/config/categories.json')) ?? [];

  return function onPageRendered(route: string, html: string): string {
    // Inject global defaults on every page
    let out = html;
    out = upsertMeta(out, 'property', 'og:site_name', seo.siteName);
    out = upsertMeta(out, 'property', 'og:locale', seo.locale);
    out = upsertMeta(out, 'name', 'twitter:card', seo.twitterCard);

    if (route === '/') {
      return handleHome(out, seo, site, legal);
    }

    const caseMatch = /^\/portfolio\/([^/]+)\/([^/]+)$/.exec(route);
    if (caseMatch) {
      const caseSlug = caseMatch[2];
      const caseData = readJson<CaseData>(path.resolve(rootDir, `data/content/portfolio/${caseSlug}.json`));
      if (caseData) {
        return handleCasePage(out, caseSlug, caseData, seo, categories);
      }
    }

    return out;
  };
}
