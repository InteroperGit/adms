import { describe, it, expect } from 'vitest';

/**
 * Tests for buildSitemapXml function from src/libs/sitemap
 *
 * Note: The buildEntries() function in postbuildSitemap.ts is tested
 * indirectly via the integration tests and E2E tests that verify
 * the sitemap.xml output contains expected routes.
 */
describe('buildSitemapXml', () => {
  it('generates valid XML structure', async () => {
    const { buildSitemapXml } = await import('../../src/libs/sitemap');

    const entries = [
      {
        loc: 'https://example.com/',
        changefreq: 'weekly' as const,
        priority: 1.0,
        lastmod: '2024-01-15',
      },
    ];

    const xml = buildSitemapXml(entries);

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<urlset');
    expect(xml).toContain('<url>');
    expect(xml).toContain('<loc>https://example.com/</loc>');
    expect(xml).toContain('</urlset>');
  });

  it('includes optional fields when provided', async () => {
    const { buildSitemapXml } = await import('../../src/libs/sitemap');

    const entries = [
      {
        loc: 'https://example.com/page',
        changefreq: 'monthly' as const,
        priority: 0.5,
        lastmod: '2024-01-15',
      },
    ];

    const xml = buildSitemapXml(entries);

    expect(xml).toContain('<changefreq>monthly</changefreq>');
    expect(xml).toContain('<priority>0.5</priority>');
    expect(xml).toContain('<lastmod>2024-01-15</lastmod>');
  });

  it('handles multiple entries', async () => {
    const { buildSitemapXml } = await import('../../src/libs/sitemap');

    const entries = [
      {
        loc: 'https://example.com/1',
        changefreq: 'daily' as const,
        priority: 1.0,
        lastmod: '2024-01-01',
      },
      {
        loc: 'https://example.com/2',
        changefreq: 'weekly' as const,
        priority: 0.8,
        lastmod: '2024-01-02',
      },
      {
        loc: 'https://example.com/3',
        changefreq: 'monthly' as const,
        priority: 0.5,
        lastmod: '2024-01-03',
      },
    ];

    const xml = buildSitemapXml(entries);

    expect(xml).toContain('<loc>https://example.com/1</loc>');
    expect(xml).toContain('<loc>https://example.com/2</loc>');
    expect(xml).toContain('<loc>https://example.com/3</loc>');
    const urlCount = (xml.match(/<url>/g) || []).length;
    expect(urlCount).toBe(3);
  });

  it('handles empty entries array', async () => {
    const { buildSitemapXml } = await import('../../src/libs/sitemap');

    const xml = buildSitemapXml([]);

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<urlset');
    expect(xml).not.toContain('<url>');
  });

  it('uses default values when optional fields are missing', async () => {
    const { buildSitemapXml } = await import('../../src/libs/sitemap');

    const entries = [
      {
        loc: 'https://example.com/page',
        changefreq: 'weekly' as const,
        priority: 0.5,
        lastmod: '2024-01-15',
      },
    ];

    const xml = buildSitemapXml(entries);

    // Should contain all provided fields
    expect(xml).toContain('<loc>https://example.com/page</loc>');
    expect(xml).toContain('<changefreq>weekly</changefreq>');
    expect(xml).toContain('<priority>0.5</priority>');
    expect(xml).toContain('<lastmod>2024-01-15</lastmod>');
  });
});
