import { describe, it, expect } from 'vitest';
import { buildRobotsContent } from './postbuild-robots';

describe('buildRobotsContent', () => {
  it('contains User-agent wildcard', () => {
    expect(buildRobotsContent('https://example.com')).toContain('User-agent: *');
  });

  it('contains Allow: /', () => {
    expect(buildRobotsContent('https://example.com')).toContain('Allow: /');
  });

  it('contains Disallow: /order/', () => {
    expect(buildRobotsContent('https://example.com')).toContain('Disallow: /order/');
  });

  it('Sitemap line uses provided baseUrl', () => {
    const content = buildRobotsContent('https://rmaster35.ru');
    expect(content).toContain('Sitemap: https://rmaster35.ru/sitemap.xml');
  });

  it('includes trailing slash in sitemap when baseUrl has one (stripping is caller responsibility)', () => {
    const content = buildRobotsContent('https://example.com/');
    expect(content).toContain('Sitemap: https://example.com//sitemap.xml');
  });

  it('output ends with newline', () => {
    expect(buildRobotsContent('https://example.com')).toMatch(/\n$/);
  });
});
