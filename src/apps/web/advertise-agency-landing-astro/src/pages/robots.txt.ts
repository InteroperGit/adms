// Publish crawler rules only from the confirmed production origin.
// Local builds disallow indexing until PUBLIC_SITE_URL is supplied.
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const lines = site
    ? [
      'User-agent: *',
      'Allow: /',
      `Sitemap: ${new URL('sitemap.xml', site).href}`,
    ]
    : ['User-agent: *', 'Disallow: /'];
  return new Response(`${lines.join('\n')}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
