export interface SitemapEntry {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export function buildSitemapXml(entries: SitemapEntry[]): string {
  const urls = entries
    .map((e) => {
      const loc = `  <loc>${e.loc}</loc>`;
      const lastmod = e.lastmod ? `\n  <lastmod>${e.lastmod}</lastmod>` : '';
      const changefreq = e.changefreq ? `\n  <changefreq>${e.changefreq}</changefreq>` : '';
      const priority =
        e.priority != null ? `\n  <priority>${e.priority.toFixed(1)}</priority>` : '';
      return `<url>\n${loc}${lastmod}${changefreq}${priority}\n</url>`;
    })
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
}
