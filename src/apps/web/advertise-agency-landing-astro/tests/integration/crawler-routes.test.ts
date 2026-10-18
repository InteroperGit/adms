// Exercise endpoint responses with real publication decisions at the boundary.
// @vitest-environment node
import type { APIContext, APIRoute } from 'astro';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import { GET as robots } from '../../src/pages/robots.txt';
import type { Project } from '../../src/types/project';
import type { ServicesContent } from '../../src/types/services';
import { buildProject, cloneFixture } from '../helpers/fixtures';
import fixture from '../fixtures/content/page-routes.json';

const content = vi.hoisted(() => ({
  projects: [] as Project[],
  services: undefined as ServicesContent | undefined,
}));

vi.mock('@/content/projects', () => ({
  get projects() {
    return content.projects;
  },
}));
vi.mock('@/content/services', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('../../src/content/services')>();
  return {
    ...actual,
    get services() {
      return content.services ?? actual.services;
    },
  };
});

const { services } = await vi.importActual<
  typeof import('../../src/content/services')
>('../../src/content/services');

// Only site is read by these endpoints. Keep the Astro context cast local.
function request(handler: APIRoute, site?: URL) {
  return handler({ site } as APIContext);
}

async function sitemap(site?: URL) {
  // Paths are captured at module evaluation, as they are during an Astro build.
  const { GET } = await import('../../src/pages/sitemap.xml');
  return request(GET, site);
}

const staticPaths = ['/', '/projects/', '/privacy-policy/', '/terms-of-use/'];

function xmlBody(locations: string[]) {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...locations.map((location) => `  <url><loc>${location}</loc></url>`),
    '</urlset>\n',
  ].join('\n');
}

beforeEach(() => {
  vi.resetModules();
  content.projects = [];
  content.services = { ...cloneFixture(services), items: [] };
});

describe('robots.txt', () => {
  it('disallows crawling when no production site is configured', async () => {
    const response = await request(robots);
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe(
      'text/plain; charset=utf-8',
    );
    expect(await response.text()).toBe('User-agent: *\nDisallow: /\n');
  });

  it.each([
    ['https://agency.example/', 'https://agency.example/sitemap.xml'],
    ['https://agency.example/base/', 'https://agency.example/base/sitemap.xml'],
    ['https://agency.example:8443/', 'https://agency.example:8443/sitemap.xml'],
  ])('advertises the configured sitemap at %s', async (site, location) => {
    const response = await request(robots, new URL(site));
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe(
      'text/plain; charset=utf-8',
    );
    expect(await response.text()).toBe(
      `User-agent: *\nAllow: /\nSitemap: ${location}\n`,
    );
  });
});

describe('sitemap.xml', () => {
  it('returns an empty valid document without a configured site', async () => {
    content.projects = [buildProject({ status: 'published', content: [] })];
    const response = await sitemap();
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe(
      'application/xml; charset=utf-8',
    );
    expect(await response.text()).toBe(xmlBody([]));
  });

  it('keeps static routes when no articles are public', async () => {
    const response = await sitemap(new URL('https://agency.example/base/'));
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe(
      'application/xml; charset=utf-8',
    );
    expect(await response.text()).toBe(
      xmlBody(staticPaths.map((path) => `https://agency.example${path}`)),
    );
  });

  it('includes approved articles and excludes drafts and demos', async () => {
    const blocks = cloneFixture(fixture.publishedBlocks) as Project['content'];
    content.projects = [
      buildProject({ id: 10, status: 'published', content: blocks }),
      buildProject({ id: 11, status: 'draft', content: blocks }),
      buildProject({ id: 12, status: 'demo', content: blocks }),
      buildProject({
        id: 13,
        status: 'published',
        content: [{ type: 'paragraph', paragraphs: ['Demo'], status: 'demo' }],
      }),
    ];
    const source = cloneFixture(services.items[0]);
    const approved = {
      ...source,
      confirmed: true,
      copyApproved: true,
      image: { ...source.image!, approved: true },
      article: { ...source.article, approved: true, content: blocks },
    };
    content.services = {
      ...cloneFixture(services),
      demoMode: false,
      copyApproved: true,
      items: [
        { ...approved, href: '/services/approved/' },
        {
          ...approved,
          href: '/services/draft/',
          article: { ...approved.article, approved: false },
        },
        { ...approved, href: '/services/unconfirmed/', confirmed: false },
        { ...approved, href: undefined },
      ],
    };
    const response = await sitemap(new URL('https://agency.example/'));
    expect(await response.text()).toBe(
      xmlBody(
        [...staticPaths, '/projects/10/', '/services/approved/'].map(
          (path) => `https://agency.example${path}`,
        ),
      ),
    );
  });

  it('escapes XML text while preserving absolute URL round trips', async () => {
    const origin = new URL("https://crawler&'@agency.example:8443/");
    const expected = staticPaths.map((path) => new URL(path, origin).href);
    const response = await sitemap(origin);
    const text = await response.text();
    expect(text).toBe(
      xmlBody(
        expected.map((location) =>
          location.replaceAll('&', '&amp;').replaceAll("'", '&apos;'),
        ),
      ),
    );
    expect(text).toContain('&amp;');
    const document = new JSDOM(text, { contentType: 'application/xml' }).window
      .document;
    expect(document.querySelector('parsererror')).toBeNull();
    expect(document.documentElement.namespaceURI).toBe(
      'http://www.sitemaps.org/schemas/sitemap/0.9',
    );
    expect(
      [...document.querySelectorAll('loc')].map((node) => node.textContent),
    ).toEqual(expected);
  });
});
