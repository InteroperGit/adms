// Generate the route map; service paths require article publication approval.
// The sitemap is empty-safe and omitted from indexing until a site is set.
import type { APIRoute } from 'astro';
import { projectRecords } from '@/content/projects';
import { services } from '@/content/services';
import { getPublishedServicePaths } from '@/content/service-publication';

const paths = [
  '/',
  '/privacy-policy/',
  '/terms-of-use/',
  ...projectRecords.map(project => `/projects/${project.id}/`),
  ...getPublishedServicePaths(services),
];

function escapeXml(value: string): string {
  return value.replace(/[<>&'\"]/g, character => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    "'": '&apos;',
    '"': '&quot;',
  })[character] ?? character);
}

export const GET: APIRoute = ({ site }) => {
  const urls = site
    ? paths.map(path => `  <url><loc>${escapeXml(
      new URL(path, site).href,
    )}</loc></url>`).join('\n')
    : '';
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    '</urlset>',
  ].filter(Boolean).join('\n');
  return new Response(`${body}\n`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
