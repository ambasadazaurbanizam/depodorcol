import { exhibitions, locales, exhibitionUrl } from '@/lib/exhibitions';

export function GET(request: Request) {
  const origin = new URL(request.url).origin;
  const lastModified = new Date().toISOString();
  const sections = ['/exhibitions', ...exhibitions.flatMap(ex => locales.map(locale => exhibitionUrl(ex.slug, locale)))];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${origin}/</loc><lastmod>${lastModified}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>
${sections.map(path => `  <url><loc>${origin}${path}</loc><lastmod>${lastModified}</lastmod><changefreq>monthly</changefreq></url>`).join('\n')}
</urlset>`;

  return new Response(xml, { headers: { 'content-type': 'application/xml; charset=utf-8' } });
}
