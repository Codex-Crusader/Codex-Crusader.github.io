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
// The register and the charters belong on the same test and pass it. Each is a
// document at its own address holding text that exists nowhere else on the
// site, which is exactly what the anchors were not. They are generated from
// charters.js and the survey together, so a charter whose repository has gone
// leaves the sitemap on the same run it leaves the site, rather than lingering
// as a URL that answers 404.
//
// 404 and /resume are deliberately absent. Neither is a destination.

import resume from '../data/resume.js';
import charters from '../data/charters.js';
import github from '../data/github.json';

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

  const names = new Set((github.repos ?? []).map((r) => r.name));
  const pages = [
    'projects/',
    ...charters.filter((c) => names.has(c.repo)).map((c) => `projects/${c.slug}/`),
  ]
    .map(
      (path) => `
  <url>
    <loc>${new URL(path, url).href}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
  </url>`,
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
  </url>${pages}${writ}
</urlset>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
