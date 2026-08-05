// Keeps the em dash out of anything a visitor reads.
//
// The rule is a decision about how the writing looks, and a decision that lives
// only in someone's memory is one that decays on the next edit. This reads the
// built pages rather than the source, because the source is not what anyone
// sees: a dash could arrive from profile.js, from a component, or out of a repo
// description pulled off the GitHub API at build time, and only the output
// knows about all three.
//
// Warns rather than fails, on the same grounds as check-profile.js: an em dash
// is a typographic slip, not a broken page, and a build that refuses to deploy
// over one is a build that will be worked around. The nightly run prints it.
//
// The date ranges in profile.js are deliberately exempt. An en dash is the
// correct mark for a span, and tenure.js parses those strings to draw the
// timeline, so the character there is load-bearing rather than decorative.

import fs from 'node:fs';
import path from 'node:path';

const DIST = 'dist';
const EM = '—';

// Text between tags, and the attributes a reader can actually end up seeing.
// Scripts and styles are skipped: an em dash inside JSON-LD or a CSS comment is
// not something anybody reads.
function visibleStrings(html) {
  // Every one of these has to be non-greedy. Astro leaves the source comments
  // in the output, so a page carries several, and a greedy `<!--[\s\S]*-->`
  // runs from the first opener to the last closer and swallows the markup
  // between them. That silently hides the very text this is meant to read, and
  // the check then passes on a page with an em dash sitting in it. The same
  // trap applies to the script and style pairs.
  //
  // The tag patterns are anchored rather than loose: `\b` so `<script` does not
  // also match `<scripture>`, `\s*>` so a closer with trailing space still
  // ends the match, and `i` because the casing is not ours to assume. They
  // collapse to a space, not to nothing, so that stripping a comment from
  // between two text runs cannot weld them into one false word.
  const body = html
    .replace(/<script\b[\s\S]*?<\/script\s*>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style\s*>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ');

  const out = [];
  for (const m of body.matchAll(/>([^<>]+)</g)) out.push(m[1]);
  for (const m of body.matchAll(/(?:content|aria-label|alt|title)="([^"]*)"/g)) out.push(m[1]);
  return out;
}

if (!fs.existsSync(DIST)) {
  console.warn('check-typography: no dist/, nothing to read');
  process.exit(0);
}

const pages = fs
  .readdirSync(DIST, { recursive: true })
  .filter((f) => typeof f === 'string' && f.endsWith('.html'))
  .map((f) => path.join(DIST, f));

const hits = [];

for (const page of pages) {
  const html = fs.readFileSync(page, 'utf8');
  for (const s of visibleStrings(html)) {
    if (!s.includes(EM)) continue;
    const text = s.trim().replace(/\s+/g, ' ');
    // The role dates are the one exempt shape: a month or year on each side.
    if (/\b(\w{3,9}\.?\s*\d{0,4}|\d{4})\s*—\s*(present|\w{3,9}\.?\s*\d{0,4}|\d{4})\b/i.test(text)) {
      continue;
    }
    hits.push({ page, text: text.length > 90 ? text.slice(0, 90) + '...' : text });
  }
}

if (hits.length) {
  console.warn(`check-typography: ${hits.length} em dash${hits.length > 1 ? 'es' : ''} in visible text`);
  for (const h of hits) console.warn(`  ${h.page}: ${h.text}`);
} else {
  console.log(`check-typography: no em dashes in ${pages.length} built page(s)`);
}
