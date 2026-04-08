import { existsSync, readFileSync, writeFileSync, readdirSync, copyFileSync } from 'fs';
import path from 'path';
import type { Plugin } from 'vite';
import { readJson, walkJsonFiles, extractYearMonth } from '../../scripts/utils/buildUtils';

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
  publishedAt: string;
  meta?: { title?: string; description?: string };
  images?: { og?: string };
}

interface GenericArticleData {
  title: string;
  description: string;
  publishedAt: string;
  meta?: { title?: string; description?: string; ogUrl?: string; ogImage?: string };
  images?: { og?: string };
  tags?: string[];
  category?: string;
  author?: { name: string; avatar?: string; title?: string };
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

function upsertTitle(html: string, text: string): string {
  const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  if (/<title>[^<]*<\/title>/i.test(html)) {
    return html.replace(/<title>[^<]*<\/title>/i, `<title>${escaped}</title>`);
  }
  return html.replace('</head>', `  <title>${escaped}</title>\n  </head>`);
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

  const catSlug = categories.find((c) => c.name === caseData.category)?.slug ?? 'all';
  const { year, month } = extractYearMonth(caseData.publishedAt);
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

function handleGenericArticle(
  html: string,
  article: GenericArticleData,
  seo: SeoConfig,
  canonicalPath: string,
  jsonLdType: string,
  breadcrumbs: Array<{ label: string; item?: string }>
): string {
  const ogTitle = article.meta?.title ?? article.title;
  const ogDesc = article.meta?.description ?? article.description;
  const ogImage = article.meta?.ogImage ?? article.images?.og ?? seo.defaultOgImage;
  const canonicalUrl = article.meta?.ogUrl ?? `${seo.siteUrl}${canonicalPath}`;

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

  const articleSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': jsonLdType,
    headline: article.title,
    description: ogDesc,
    datePublished: article.publishedAt,
    url: canonicalUrl,
    publisher: {
      '@type': 'Organization',
      name: seo.siteName,
      url: seo.siteUrl,
    },
  };
  if (article.author) {
    articleSchema.author = {
      '@type': 'Person',
      name: article.author.name,
      ...(article.author.title ? { jobTitle: article.author.title } : {}),
    };
  }
  if (article.images?.og) {
    articleSchema.image = `${seo.siteUrl}${article.images.og}`;
  }
  out = injectBeforeHead(out, jsonLdTag(articleSchema));

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.label,
      ...(crumb.item ? { item: crumb.item } : {}),
    })),
  };
  out = injectBeforeHead(out, jsonLdTag(breadcrumbSchema));

  return out;
}

// ---------------------------------------------------------------------------
// Vite plugin
// ---------------------------------------------------------------------------

/**
 * Processes all pre-rendered HTML files in build/client/ after `react-router build`.
 * Injects SEO meta tags, OG tags, JSON-LD, canonical links, and copies 404.html.
 *
 * Must run AFTER `react-router build` because prerendering creates the HTML files
 * during the SSR phase, which happens after Vite's writeBundle hook fires.
 * Called from scripts/postbuild-seo.ts in the build pipeline.
 */
export function processBuiltHtml(rootDir: string): void {
  const seo = readJson<SeoConfig>(path.resolve(rootDir, 'data/content/config/seo.json'));
  if (!seo) {
    console.warn('[seoMetaPlugin] seo.json not found — skipping SEO meta injection');
    return;
  }

  const site = readJson<SiteConfig>(path.resolve(rootDir, 'data/content/config/site.json'));
  const legal = readJson<LegalConfig>(path.resolve(rootDir, 'data/content/config/legal.json'));
  const categories =
    readJson<CategoryEntry[]>(path.resolve(rootDir, 'data/content/config/categories.json')) ?? [];

  // Build article file maps (slug → data)
  const articleBase = path.resolve(rootDir, 'data/content/articles');

  const caseFileMap = Object.fromEntries(
    walkJsonFiles(path.resolve(articleBase, 'portfolio')).map((f) => {
      const data = JSON.parse(readFileSync(f, 'utf-8')) as CaseData & { slug: string };
      return [data.slug, data];
    })
  );

  const serviceFileMap = Object.fromEntries(
    walkJsonFiles(path.resolve(articleBase, 'services')).map((f) => {
      const data = JSON.parse(readFileSync(f, 'utf-8')) as GenericArticleData & { slug: string };
      return [data.slug, data];
    })
  );
  const newsFileMap = Object.fromEntries(
    walkJsonFiles(path.resolve(articleBase, 'news')).map((f) => {
      const data = JSON.parse(readFileSync(f, 'utf-8')) as GenericArticleData & { slug: string };
      return [data.slug, data];
    })
  );
  const blogFileMap = Object.fromEntries(
    walkJsonFiles(path.resolve(articleBase, 'blog')).map((f) => {
      const data = JSON.parse(readFileSync(f, 'utf-8')) as GenericArticleData & { slug: string };
      return [data.slug, data];
    })
  );

  // Process built HTML files
  const buildDir = path.resolve(rootDir, 'build/client');
  if (!existsSync(buildDir)) {
    return;
  }

  const processHtml = (filePath: string, route: string) => {
    if (!existsSync(filePath)) {
      return;
    }

    let html = readFileSync(filePath, 'utf-8');

    // Inject global defaults
    html = upsertTitle(html, seo.siteName);
    if (site?.description) {
      html = upsertMeta(html, 'name', 'description', site.description);
    }
    html = upsertMeta(html, 'property', 'og:site_name', seo.siteName);
    html = upsertMeta(html, 'property', 'og:locale', seo.locale);
    html = upsertMeta(html, 'name', 'twitter:card', seo.twitterCard);

    // Route-specific processing
    if (route === '/') {
      html = handleHome(html, seo, site, legal);
    } else if (route === '/404') {
      html = handleNotFound(html, seo);
    } else {
      const caseMatch = /^\/portfolio\/([^/]+)\/(\d{4})\/(\d{2})\/([^/]+)$/.exec(route);
      if (caseMatch) {
        const caseSlug = caseMatch[4];
        const caseData = caseFileMap[caseSlug];
        if (caseData) {
          html = handleCasePage(html, caseSlug, caseData, seo, categories);
        }
      }

      // Service article: /services/:slug
      const serviceMatch = /^\/services\/([^/]+)$/.exec(route);
      if (serviceMatch) {
        const serviceSlug = serviceMatch[1];
        const serviceData = serviceFileMap[serviceSlug];
        if (serviceData) {
          html = handleGenericArticle(html, serviceData, seo, serviceMatch[0], 'Article', [
            { label: 'Главная', item: seo.siteUrl },
            { label: 'Услуги', item: `${seo.siteUrl}/services` },
            { label: serviceData.title },
          ]);
        }
      }

      // News article: /news/:year/:month/:slug
      const newsMatch = /^\/news\/(\d{4})\/(\d{2})\/([^/]+)$/.exec(route);
      if (newsMatch) {
        const newsSlug = newsMatch[3];
        const newsData = newsFileMap[newsSlug];
        if (newsData) {
          html = handleGenericArticle(html, newsData, seo, newsMatch[0], 'NewsArticle', [
            { label: 'Главная', item: seo.siteUrl },
            { label: 'Новости', item: `${seo.siteUrl}/news` },
            { label: newsData.title },
          ]);
        }
      }

      // Blog article: /blog/:year/:month/:slug
      const blogMatch = /^\/blog\/(\d{4})\/(\d{2})\/([^/]+)$/.exec(route);
      if (blogMatch) {
        const blogSlug = blogMatch[3];
        const blogData = blogFileMap[blogSlug];
        if (blogData) {
          html = handleGenericArticle(html, blogData, seo, blogMatch[0], 'Article', [
            { label: 'Главная', item: seo.siteUrl },
            { label: 'Блог', item: `${seo.siteUrl}/blog` },
            { label: blogData.title },
          ]);
        }
      }
    }

    writeFileSync(filePath, html, 'utf-8');
  };

  // Process all index.html files
  const walkBuildDir = (dir: string, routePath: string = '') => {
    readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
      const fullPath = path.join(dir, entry.name);
      const route = path.join(routePath, entry.name);

      if (entry.isDirectory()) {
        walkBuildDir(fullPath, route);
      } else if (entry.name === 'index.html') {
        // Convert file path to route — normalize backslashes for cross-platform regex matching
        const normalized = route.replace(/\\/g, '/');
        const routePath =
          normalized === 'index.html' ? '/' : `/${normalized.replace(/\/index\.html$/, '')}`;
        processHtml(fullPath, routePath);
      }
    });
  };

  walkBuildDir(buildDir);

  // Copy build/client/404/index.html → build/client/404.html for hosting platforms
  // (Netlify, Vercel, nginx etc. serve 404.html as the 404 error page)
  const src404 = path.resolve(buildDir, '404', 'index.html');
  const dst404 = path.resolve(buildDir, '404.html');
  if (existsSync(src404)) {
    copyFileSync(src404, dst404);
  }
}

// No-op Vite plugin stub. The actual HTML processing (meta tags, 404 handling) runs
// via scripts/postbuild-seo.ts after react-router build completes (see build script in package.json).
// This stub placeholder ensures vite.config.ts plugins array is complete and self-documenting.
export function seoMetaPluginStub(): Plugin {
  return { name: 'seo-meta-plugin' };
}
