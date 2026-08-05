// Written as an endpoint rather than a file in public/ so lastmod is stamped at
// build time and stays honest with the nightly run, instead of freezing on the
// day someone remembered to edit it.
//
// The five sections are #anchors on the front page, not URLs, so they do not
// belong here. Listing them would be padding. The writ does belong: it is a
// separate document at its own address, and it is the thing most people
// arriving from a search are actually looking for. It is listed only when the
// PDF is really on disk, and as the file itself rather than the /resume page
// that hops to it: one address for one document.
//
// 404 and /resume are deliberately absent. Neither is a destination.

import resume from '../data/resume.js';

export async function GET({ site }) {
  const url = new URL(import.meta.env.BASE_URL, site).href;
  const lastmod = new Date().toISOString().slice(0, 10);

  const writ = resume.published
    ? `
  <url>
    <loc>${new URL(resume.href, site).href}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
  </url>`
    : '';

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
  </url>${writ}
</urlset>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
