// Written as an endpoint rather than a file in public/ so the list of URLs is
// derived from the same arrays the pages are generated from, instead of being
// typed a second time and drifting.
//
// It carries no <lastmod> and no <changefreq>, and that is deliberate.
//
// This used to stamp `new Date()` into every entry on every build. The comment
// here called that "honest with the nightly run". It was the opposite. The
// nightly run rebuilds whether or not anything changed, so every URL claimed to
// have been modified today, every day, including pages untouched for months.
// Google's documented response to a lastmod it cannot corroborate is to stop
// believing lastmod for the whole site, which costs the signal on the one page
// that genuinely did change. A date that is always today carries no more
// information than no date at all, and it costs credibility that no date does
// not. <changefreq> is ignored by Google outright and was never read by
// anything.
//
// If a real lastmod is ever wanted, it has to come from the commit that last
// touched the page's source, not from the clock at build time.
//
// The five sections of the front page are #anchors, not URLs, so they do not
// belong here. Listing them would be padding. What belongs is anything that is
// a document at its own address holding text that exists nowhere else on the
// site, and every entry below passes that test:
//
//   /              the map, and the site
//   /about/        the long biography, the skills and the education
//   /experience/   the work history unpacked, post by post
//   /projects/     the register of holdings
//   /projects/…/   one charter per repository that has prose written for it
//   /writing/      the chronicles
//   /writing/…/    one article each
//   /resume/       the résumé as a real page
//
// The charters and the chronicles are DERIVED, not listed. Charters come from
// charters.js filtered against the survey, so one whose repository has gone
// leaves the sitemap on the same run it leaves the site. Articles come from
// chronicle.js, which is the same array the pages are generated from. Typing
// either list a second time here is how a sitemap ends up promising a URL that
// answers 404, or quietly omitting a page that exists.
//
// 404 is deliberately absent: it is noindex and it is not a destination.
//
// One note on the writ. This used to list the PDF itself and not /resume/,
// on the reasoning that a hop-page is not a destination. /resume/ is now a real
// résumé rather than a redirect, so it is the destination and the PDF is the
// download it offers. The page is listed and the file is not: a reader who
// wants the file reaches it from the page, and a search engine that wants
// something to rank is given the document with the text in it.

import charters from '../data/charters.js';
import articles from '../data/chronicle.js';
import github from '../data/github.json';

export async function GET({ site }) {
  const url = new URL(import.meta.env.BASE_URL, site).href;

  const names = new Set((github.repos ?? []).map((r) => r.name));

  const entries = [
    '',
    'about/',
    'experience/',
    'projects/',
    ...charters.filter((c) => names.has(c.repo)).map((c) => `projects/${c.slug}/`),
    'writing/',
    ...articles.map((a) => a.path),
    // The page exists whether or not the PDF does: it is the work history set
    // as a document, and the download is one row on it. resume.js still gates
    // the download itself, which is the thing that can actually go missing.
    'resume/',
  ];

  const body = entries
    .map(
      (path) => `
  <url>
    <loc>${new URL(path, url).href}</loc>
  </url>`,
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}
</urlset>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
