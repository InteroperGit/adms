import { describe, it, expect } from 'vitest';
import { buildSitemapXml } from './sitemap';
import type { SitemapEntry } from './sitemap';

describe('buildSitemapXml', () => {
  it('returns valid XML declaration and urlset wrapper', () => {
    const xml = buildSitemapXml([]);
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(xml).toContain('</urlset>');
  });

  it('renders a minimal entry with only loc', () => {
    const entry: SitemapEntry = { loc: 'https://example.com/' };
    const xml = buildSitemapXml([entry]);
    expect(xml).toContain('<url>');
    expect(xml).toContain('  <loc>https://example.com/</loc>');
    expect(xml).toContain('</url>');
    expect(xml).not.toContain('<lastmod>');
    expect(xml).not.toContain('<changefreq>');
    expect(xml).not.toContain('<priority>');
  });

  it('renders all optional fields when provided', () => {
    const entry: SitemapEntry = {
      loc: 'https://example.com/page',
      lastmod: '2026-03-24',
      changefreq: 'weekly',
      priority: 0.8,
    };
    const xml = buildSitemapXml([entry]);
    expect(xml).toContain('  <loc>https://example.com/page</loc>');
    expect(xml).toContain('  <lastmod>2026-03-24</lastmod>');
    expect(xml).toContain('  <changefreq>weekly</changefreq>');
    expect(xml).toContain('  <priority>0.8</priority>');
  });

  it('formats priority to one decimal place', () => {
    const xml = buildSitemapXml([{ loc: 'https://example.com/', priority: 1 }]);
    expect(xml).toContain('  <priority>1.0</priority>');
  });

  it('renders multiple entries separated by newline', () => {
    const entries: SitemapEntry[] = [
      { loc: 'https://example.com/' },
      { loc: 'https://example.com/about' },
    ];
    const xml = buildSitemapXml(entries);
    const matches = xml.match(/<url>/g);
    expect(matches).toHaveLength(2);
  });

  it('returns empty urlset for empty input', () => {
    const xml = buildSitemapXml([]);
    expect(xml).not.toContain('<url>');
  });

  it('supports all changefreq values', () => {
    const freqs: SitemapEntry['changefreq'][] = [
      'always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never',
    ];
    for (const changefreq of freqs) {
      const xml = buildSitemapXml([{ loc: 'https://example.com/', changefreq }]);
      expect(xml).toContain(`  <changefreq>${changefreq}</changefreq>`);
    }
  });
});
