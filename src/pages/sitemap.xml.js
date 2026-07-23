// One page, one entry. Written as an endpoint rather than a file in public/
// so lastmod is stamped at build time and stays honest with the nightly run,
// instead of freezing on the day someone remembered to edit it.
//
// The five sections are #anchors on this page, not URLs, so they do not belong
// here. Listing them would be padding.

export async function GET({ site }) {
  const url = new URL(import.meta.env.BASE_URL, site).href;
  const lastmod = new Date().toISOString().slice(0, 10);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
  </url>
</urlset>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
