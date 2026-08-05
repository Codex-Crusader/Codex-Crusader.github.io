// Warns about anything in profile.js that is still blank. Never fails the
// build: an incomplete contact row is skipped at render time, not shipped
// broken, so this is a nudge rather than a gate.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import profile from '../src/data/profile.js';
import resume from '../src/data/resume.js';

const blanks = profile.contact.links
  .filter(([, text, href]) => !href || !text)
  .map(([label]) => label.toLowerCase());

if (blanks.length) {
  console.warn(
    `check-profile: not published yet, no value set in profile.js -> ${blanks.join(', ')}`,
  );
}

// The writ is named in profile.js but lives in public/, so the two can drift
// apart in a way no amount of reading profile.js would reveal. The build still
// succeeds. The download removes itself when the file is gone, so the site
// stays correct, but silently dropping a résumé is worth a line on the way
// past.
if (!resume.published) {
  console.warn(
    `check-profile: no writ at public/${resume.file}, so the résumé download is omitted from this build`,
  );
}

// A featured name is matched against the survey by exact repo name, and a
// rename on GitHub is invisible from here: the repo keeps appearing, it just
// stops being seated at the head of the province, which is the kind of quiet
// drift nobody notices for a month. Reading github.json rather than the API
// keeps this a check and not a network call.
//
// Skipped entirely when the survey is empty. ensure-data.js writes a stub with
// no repos in it so a fresh clone can build offline, and warning that all four
// featured names are missing from a file that is missing everything would be
// noise rather than a finding.
const here = dirname(fileURLToPath(import.meta.url));
const featured = profile.github.featured ?? [];

if (featured.length) {
  let repos = [];
  try {
    repos = JSON.parse(readFileSync(resolve(here, '../src/data/github.json'), 'utf8')).repos ?? [];
  } catch {
    repos = [];
  }

  if (repos.length) {
    const names = new Set(repos.map((r) => r.name));
    const missing = featured.filter((n) => !names.has(n));
    if (missing.length) {
      console.warn(
        `check-profile: featured in profile.js but not in the survey, so not seated first -> ${missing.join(', ')}`,
      );
    }
  }
}
