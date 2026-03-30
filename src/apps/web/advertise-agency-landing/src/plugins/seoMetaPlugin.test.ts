/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { existsSync, writeFileSync, readdirSync, copyFileSync } from 'fs';

vi.mock('fs', () => {
  const existsSync = vi.fn();
  const readFileSync = vi.fn();
  const writeFileSync = vi.fn();
  const readdirSync = vi.fn();
  const copyFileSync = vi.fn();
  const mod = { existsSync, readFileSync, writeFileSync, readdirSync, copyFileSync };
  return { ...mod, default: mod };
});

vi.mock('../../scripts/utils/buildUtils', () => ({
  readJson: vi.fn(),
  walkJsonFiles: vi.fn(() => []),
  extractYearMonth: vi.fn(() => ({ year: '2024', month: '05' })),
}));

import { processBuiltHtml } from './seoMetaPlugin';
import { readJson, walkJsonFiles, extractYearMonth } from '../../scripts/utils/buildUtils';
import { readFileSync } from 'fs';

const ROOT = '/project';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const SEO = {
  siteUrl: 'https://example.com',
  siteName: 'TestSite',
  locale: 'ru_RU',
  twitterCard: 'summary_large_image',
  defaultOgImage: 'https://example.com/og.jpg',
};

const SITE = {
  name: 'TestAgency',
  description: 'Best ads ever',
  contact: { phone: '+7 999 000 00 00', email: 'hi@example.com', address: 'Some Street 1' },
};

const LEGAL = { company: { name: 'Test LLC' } };

const CATEGORIES = [{ name: 'Digital', slug: 'digital' }];

const BASE_HTML = `<!DOCTYPE html><html lang="en"><head><title>Old Title</title></head><body></body></html>`;

// Minimal dirent stub
function dirent(name: string, isDir: boolean) {
  return { name, isDirectory: () => isDir, isFile: () => !isDir };
}

// Normalize path separators for cross-platform matching
function normPath(p: string): string {
  return p.replace(/\\/g, '/');
}

// ---------------------------------------------------------------------------
// Helper: set up a simple build dir with one root index.html
// ---------------------------------------------------------------------------
function setupBuildDir(html: string, entries: { name: string; isDir: boolean }[] = []) {
  const allEntries = [{ name: 'index.html', isDir: false }, ...entries];
  (existsSync as any).mockImplementation((p: string) => {
    const n = normPath(p);
    if (n.includes('build/client')) {
      return true;
    }
    if (n.endsWith('index.html')) {
      return true;
    }
    return false;
  });
  (readdirSync as any).mockImplementation(() => allEntries.map((e) => dirent(e.name, e.isDir)));
  (readFileSync as any).mockImplementation(() => html);
  (readJson as any).mockImplementation((p: string) => {
    if (p.includes('seo.json')) {
      return SEO;
    }
    if (p.includes('site.json')) {
      return SITE;
    }
    if (p.includes('legal.json')) {
      return LEGAL;
    }
    if (p.includes('categories.json')) {
      return CATEGORIES;
    }
    return null;
  });
  (walkJsonFiles as any).mockReturnValue([]);
  (extractYearMonth as any).mockReturnValue({ year: '2024', month: '05' });
}

beforeEach(() => {
  vi.clearAllMocks();
});

// ---------------------------------------------------------------------------
// processBuiltHtml guard: missing seo.json
// ---------------------------------------------------------------------------

describe('processBuiltHtml — seo.json missing', () => {
  it('returns early and writes nothing when seo.json not found', () => {
    (readJson as any).mockReturnValue(null);
    (walkJsonFiles as any).mockReturnValue([]);
    (existsSync as any).mockReturnValue(true);
    (readdirSync as any).mockReturnValue([]);

    processBuiltHtml(ROOT);

    expect(writeFileSync).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// processBuiltHtml guard: missing build dir
// ---------------------------------------------------------------------------

describe('processBuiltHtml — build dir missing', () => {
  it('returns early when build/client does not exist', () => {
    (readJson as any).mockImplementation((p: string) => {
      if (p.includes('seo.json')) {
        return SEO;
      }
      return null;
    });
    (walkJsonFiles as any).mockReturnValue([]);
    (existsSync as any).mockImplementation((p: string) => {
      if (normPath(p).includes('build/client')) {
        return false;
      }
      return true;
    });

    processBuiltHtml(ROOT);

    expect(writeFileSync).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// processBuiltHtml guard: index.html file doesn't exist
// ---------------------------------------------------------------------------

describe('processBuiltHtml — index.html missing on disk', () => {
  it('skips writing when index.html does not exist', () => {
    (readJson as any).mockImplementation((p: string) => {
      if (p.includes('seo.json')) {
        return SEO;
      }
      if (p.includes('site.json')) {
        return SITE;
      }
      if (p.includes('legal.json')) {
        return LEGAL;
      }
      if (p.includes('categories.json')) {
        return CATEGORIES;
      }
      return null;
    });
    (walkJsonFiles as any).mockReturnValue([]);
    (extractYearMonth as any).mockReturnValue({ year: '2024', month: '05' });
    (existsSync as any).mockImplementation((p: string) => {
      const n = normPath(p);
      if (n.includes('build/client') && !n.endsWith('index.html')) {
        return true;
      }
      return false;
    });
    (readdirSync as any).mockImplementation(() => [dirent('index.html', false)]);

    processBuiltHtml(ROOT);

    expect(writeFileSync).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// escAttr — tested via html output
// ---------------------------------------------------------------------------

describe('escAttr (via processBuiltHtml output)', () => {
  it('escapes &, ", <, > in meta content values', () => {
    const specialSeo = { ...SEO, siteName: 'A & B <Corp> "Ltd"' };
    (readJson as any).mockImplementation((p: string) => {
      if (p.includes('seo.json')) {
        return specialSeo;
      }
      if (p.includes('categories.json')) {
        return CATEGORIES;
      }
      return null;
    });
    (walkJsonFiles as any).mockReturnValue([]);
    (extractYearMonth as any).mockReturnValue({ year: '2024', month: '05' });

    const html = `<!DOCTYPE html><html lang="en"><head><title>Old</title></head><body></body></html>`;
    (existsSync as any).mockImplementation((p: string) => {
      const n = normPath(p);
      if (n.includes('404') && n.endsWith('index.html')) {
        return false;
      }
      return true;
    });
    (readdirSync as any).mockImplementation(() => [dirent('index.html', false)]);
    (readFileSync as any).mockReturnValue(html);

    processBuiltHtml(ROOT);

    const written = (writeFileSync as any).mock.calls[0][1] as string;
    expect(written).toContain('A &amp; B &lt;Corp&gt; &quot;Ltd&quot;');
  });
});

// ---------------------------------------------------------------------------
// upsertTitle — via processBuiltHtml output
// ---------------------------------------------------------------------------

describe('upsertTitle (via processBuiltHtml output)', () => {
  it('replaces existing <title> content', () => {
    setupBuildDir(BASE_HTML);

    processBuiltHtml(ROOT);

    const written = (writeFileSync as any).mock.calls[0][1] as string;
    expect(written).not.toContain('<title>Old Title</title>');
    expect(written).toContain('<title>');
    expect(written).toContain('TestAgency');
  });

  it('inserts <title> when absent', () => {
    const htmlNoTitle = `<!DOCTYPE html><html lang="en"><head></head><body></body></html>`;
    setupBuildDir(htmlNoTitle);

    processBuiltHtml(ROOT);

    const written = (writeFileSync as any).mock.calls[0][1] as string;
    expect(written).toContain('<title>');
  });
});

// ---------------------------------------------------------------------------
// upsertMeta — via processBuiltHtml output
// ---------------------------------------------------------------------------

describe('upsertMeta (via processBuiltHtml output)', () => {
  it('inserts missing meta tag before </head>', () => {
    const htmlNoMeta = `<!DOCTYPE html><html lang="en"><head><title>T</title></head><body></body></html>`;
    setupBuildDir(htmlNoMeta);

    processBuiltHtml(ROOT);

    const written = (writeFileSync as any).mock.calls[0][1] as string;
    expect(written).toContain('og:site_name');
    expect(written.indexOf('og:site_name')).toBeLessThan(written.indexOf('</head>'));
  });

  it('updates existing <meta name="..." content="..."> in place', () => {
    const htmlWithMeta = `<!DOCTYPE html><html lang="en"><head><title>T</title><meta name="twitter:card" content="old_value" /></head><body></body></html>`;
    setupBuildDir(htmlWithMeta);

    processBuiltHtml(ROOT);

    const written = (writeFileSync as any).mock.calls[0][1] as string;
    expect(written).not.toContain('old_value');
    expect(written).toContain('summary_large_image');
  });

  it('updates existing <meta property="..." content="..."> in place', () => {
    const htmlWithProp = `<!DOCTYPE html><html lang="en"><head><title>T</title><meta property="og:locale" content="en_US" /></head><body></body></html>`;
    setupBuildDir(htmlWithProp);

    processBuiltHtml(ROOT);

    const written = (writeFileSync as any).mock.calls[0][1] as string;
    expect(written).not.toContain('en_US');
    expect(written).toContain('ru_RU');
  });
});

// ---------------------------------------------------------------------------
// injectBeforeHead — via processBuiltHtml output
// ---------------------------------------------------------------------------

describe('injectBeforeHead (via processBuiltHtml output)', () => {
  it('inserts canonical link before </head>', () => {
    setupBuildDir(BASE_HTML);

    processBuiltHtml(ROOT);

    const written = (writeFileSync as any).mock.calls[0][1] as string;
    expect(written).toContain('<link rel="canonical"');
    expect(written.indexOf('<link rel="canonical"')).toBeLessThan(written.indexOf('</head>'));
  });
});

// ---------------------------------------------------------------------------
// handleHome (route /)
// ---------------------------------------------------------------------------

describe('handleHome (route /)', () => {
  beforeEach(() => {
    setupBuildDir(BASE_HTML);
  });

  it('sets page title to ${site.name} — реклама, которая работает', () => {
    processBuiltHtml(ROOT);
    const written = (writeFileSync as any).mock.calls[0][1] as string;
    expect(written).toContain('TestAgency — реклама, которая работает');
  });

  it('injects og:description', () => {
    processBuiltHtml(ROOT);
    const written = (writeFileSync as any).mock.calls[0][1] as string;
    expect(written).toContain('og:description');
    expect(written).toContain('Best ads ever');
  });

  it('injects og:url with trailing slash', () => {
    processBuiltHtml(ROOT);
    const written = (writeFileSync as any).mock.calls[0][1] as string;
    expect(written).toContain('og:url');
    expect(written).toContain('https://example.com/');
  });

  it('injects og:type=website', () => {
    processBuiltHtml(ROOT);
    const written = (writeFileSync as any).mock.calls[0][1] as string;
    expect(written).toContain('og:type');
    expect(written).toContain('website');
  });

  it('injects canonical link', () => {
    processBuiltHtml(ROOT);
    const written = (writeFileSync as any).mock.calls[0][1] as string;
    expect(written).toContain('rel="canonical"');
    expect(written).toContain('href="https://example.com/"');
  });

  it('injects Organization JSON-LD with name, contactPoint, address', () => {
    processBuiltHtml(ROOT);
    const written = (writeFileSync as any).mock.calls[0][1] as string;
    expect(written).toContain('application/ld+json');
    expect(written).toContain('"@type":"Organization"');
    expect(written).toContain('"name":"TestAgency"');
    expect(written).toContain('"ContactPoint"');
    expect(written).toContain('"PostalAddress"');
  });

  it('includes legalName in Organization schema when legal is present', () => {
    processBuiltHtml(ROOT);
    const written = (writeFileSync as any).mock.calls[0][1] as string;
    expect(written).toContain('"legalName":"Test LLC"');
  });
});

// ---------------------------------------------------------------------------
// handleNotFound (route /404)
// ---------------------------------------------------------------------------

describe('handleNotFound (route /404)', () => {
  beforeEach(() => {
    (readJson as any).mockImplementation((p: string) => {
      if (p.includes('seo.json')) {
        return SEO;
      }
      if (p.includes('site.json')) {
        return SITE;
      }
      if (p.includes('legal.json')) {
        return LEGAL;
      }
      if (p.includes('categories.json')) {
        return CATEGORIES;
      }
      return null;
    });
    (walkJsonFiles as any).mockReturnValue([]);
    (existsSync as any).mockReturnValue(true);
    let callCount = 0;
    (readdirSync as any).mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return [dirent('404', true), dirent('index.html', false)];
      }
      return [dirent('index.html', false)];
    });
    (readFileSync as any).mockReturnValue(BASE_HTML);
  });

  it('sets title with "404 — Страница не найдена"', () => {
    processBuiltHtml(ROOT);
    const calls = (writeFileSync as any).mock.calls as [string, string, string][];
    const notFoundCall = calls.find(([p]) => p.includes('404'));
    expect(notFoundCall).toBeTruthy();
    const written = notFoundCall![1];
    expect(written).toContain('404');
    expect(written).toContain('Страница не найдена');
  });

  it('injects <meta name="robots" content="noindex">', () => {
    processBuiltHtml(ROOT);
    const calls = (writeFileSync as any).mock.calls as [string, string, string][];
    const notFoundCall = calls.find(([p]) => p.includes('404'));
    const written = notFoundCall![1];
    expect(written).toContain('name="robots"');
    expect(written).toContain('noindex');
  });
});

// ---------------------------------------------------------------------------
// handleCasePage (route /portfolio/:cat/:year/:month/:slug)
// ---------------------------------------------------------------------------

describe('handleCasePage (route /portfolio/...)', () => {
  const CASE_DATA = {
    slug: 'my-case',
    title: 'My Case',
    category: 'Digital',
    description: 'A great case study',
    publishDate: '2024-05-15',
    meta: { title: 'Meta Title', description: 'Meta Description' },
    images: { og: 'https://example.com/case-og.jpg' },
  };
  const CASE_FILE = '/project/data/content/portfolio/digital/2024/05/my-case.json';

  beforeEach(() => {
    (readJson as any).mockImplementation((p: string) => {
      if (p.includes('seo.json')) {
        return SEO;
      }
      if (p.includes('site.json')) {
        return SITE;
      }
      if (p.includes('legal.json')) {
        return LEGAL;
      }
      if (p.includes('categories.json')) {
        return CATEGORIES;
      }
      return null;
    });
    (extractYearMonth as any).mockReturnValue({ year: '2024', month: '05' });
    (walkJsonFiles as any).mockReturnValue([CASE_FILE]);
    (existsSync as any).mockReturnValue(true);

    let callCount = 0;
    (readdirSync as any).mockImplementation(() => {
      callCount++;
      switch (callCount) {
        case 1:
          return [dirent('portfolio', true)];
        case 2:
          return [dirent('digital', true)];
        case 3:
          return [dirent('2024', true)];
        case 4:
          return [dirent('05', true)];
        case 5:
          return [dirent('my-case', true)];
        default:
          return [dirent('index.html', false)];
      }
    });
    (readFileSync as any).mockImplementation((p: string) => {
      if (p === CASE_FILE) {
        return JSON.stringify(CASE_DATA);
      }
      return BASE_HTML;
    });
  });

  it('sets title to ${meta.title} — ${siteName}', () => {
    processBuiltHtml(ROOT);
    const written = (writeFileSync as any).mock.calls[0][1] as string;
    expect(written).toContain('Meta Title — TestSite');
  });

  it('injects breadcrumb JSON-LD with 4 list items', () => {
    processBuiltHtml(ROOT);
    const written = (writeFileSync as any).mock.calls[0][1] as string;
    expect(written).toContain('"BreadcrumbList"');
    const matches = written.match(/"ListItem"/g);
    expect(matches).toHaveLength(4);
  });

  it('uses meta.title / meta.description when present', () => {
    processBuiltHtml(ROOT);
    const written = (writeFileSync as any).mock.calls[0][1] as string;
    expect(written).toContain('Meta Title');
    expect(written).toContain('Meta Description');
  });

  it('falls back to title / description when meta is absent', () => {
    const caseNoMeta = { ...CASE_DATA, meta: undefined };
    (readFileSync as any).mockImplementation((p: string) => {
      if (p === CASE_FILE) {
        return JSON.stringify(caseNoMeta);
      }
      return BASE_HTML;
    });

    processBuiltHtml(ROOT);
    const written = (writeFileSync as any).mock.calls[0][1] as string;
    expect(written).toContain('My Case');
    expect(written).toContain('A great case study');
  });

  it('injects canonical URL with correct category slug from categories list', () => {
    processBuiltHtml(ROOT);
    const written = (writeFileSync as any).mock.calls[0][1] as string;
    expect(written).toContain('rel="canonical"');
    expect(written).toContain('/portfolio/digital/2024/05/my-case');
  });
});

// ---------------------------------------------------------------------------
// 404.html copy
// ---------------------------------------------------------------------------

describe('processBuiltHtml — copies 404/index.html → 404.html', () => {
  it('calls copyFileSync when 404/index.html exists', () => {
    setupBuildDir(BASE_HTML);
    (existsSync as any).mockReturnValue(true);

    processBuiltHtml(ROOT);

    expect(copyFileSync).toHaveBeenCalled();
    const [src, dst] = (copyFileSync as any).mock.calls[0];
    expect(src).toContain('404');
    expect(dst).toContain('404.html');
    expect(dst).not.toContain('index.html');
  });

  it('does not call copyFileSync when 404/index.html is missing', () => {
    setupBuildDir(BASE_HTML);
    (existsSync as any).mockImplementation((p: string) => {
      const n = normPath(p);
      if (n.includes('404') && n.endsWith('index.html')) {
        return false;
      }
      return true;
    });

    processBuiltHtml(ROOT);

    expect(copyFileSync).not.toHaveBeenCalled();
  });
});
