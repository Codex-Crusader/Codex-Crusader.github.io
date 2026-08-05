// Warns about anything in profile.js that is still blank. Never fails the
// build: an incomplete contact row is skipped at render time, not shipped
// broken, so this is a nudge rather than a gate.

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
