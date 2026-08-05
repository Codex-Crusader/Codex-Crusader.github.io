// The writ, resolved against the filesystem rather than taken on trust.
//
// This runs in Node at build time, so a page can only ever link to a PDF that
// is genuinely sitting in public/. Delete the file and the download vanishes
// from every province instead of shipping as a 404, the same rule that keeps
// an unfinished contact row from becoming a dead link.
//
// The size is measured here rather than typed into profile.js, so the figure a
// visitor reads before committing to a download cannot drift from the file they
// actually get. Same principle as the Afon Empire ledger: drawn from the
// source, not from someone remembering to update it.

import fs from 'node:fs';
import path from 'node:path';
import profile from './profile.js';

// Vite replaces `import.meta.env` in anything it processes. Plain Node does
// not define it, so this module stays importable from the build scripts too.
const env = import.meta.env ?? {};
const base = env.BASE_URL ?? '/';

const { file, ...copy } = profile.resume ?? {};
const onDisk = file ? path.join(process.cwd(), 'public', file) : null;
const stat = onDisk && fs.existsSync(onDisk) ? fs.statSync(onDisk) : null;

export default {
  ...copy,
  file,
  // Every page checks this before rendering anything at all.
  published: Boolean(stat),
  href: `${base}${file}`,
  // The short road, src/pages/resume.astro. Trailing slash so the link lands on
  // the built page directly rather than through a Pages redirect.
  shortHref: `${base}resume/`,
  // Whole kilobytes. A download is a decision about someone's bandwidth, so the
  // number earns its place; three decimal places would not.
  size: stat ? `${Math.round(stat.size / 1024).toLocaleString('en-IN')} KB` : null,
};
